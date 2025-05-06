import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';
import NewService from '@/models/newServicesSchema';

// DELETE /api/admin/location/[id]
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: 'Location ID is required' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // First, find the location to get its district and state before deletion
    const location = await Location.findById(id);
    
    if (!location) {
      return new NextResponse(
        JSON.stringify({ message: 'Location not found' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const { district, state } = location;
    
    // Delete the location from Location collection
    await Location.findByIdAndDelete(id);
    
    // Find services that have this location in their planPrices
    const servicesWithLocation = await NewService.find({
      "planPrices": {
        $elemMatch: {
          "state": state,
          "district": district
        }
      }
    });
    
    let servicesUpdated = 0;
    
    // Update each service by pulling the matching location from planPrices array
    if (servicesWithLocation.length > 0) {
      const bulkOps = servicesWithLocation.map(service => {
        return {
          updateOne: {
            filter: { _id: service._id },
            // Remove the plan price entry matching this location
            update: {
              $pull: {
                "planPrices": {
                  "state": state,
                  "district": district
                }
              },
              $inc: { __v: 1 }
            }
          }
        };
      });
      
      const result = await NewService.bulkWrite(bulkOps);
      servicesUpdated = result.modifiedCount || bulkOps.length;
    }
    
    return new NextResponse(
      JSON.stringify({ 
        message: 'Location deleted successfully',
        servicesUpdated
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting location by ID:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// For preflight OPTIONS request
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}