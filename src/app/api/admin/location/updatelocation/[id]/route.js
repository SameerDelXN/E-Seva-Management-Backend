import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';
import NewService from '@/models/newServicesSchema';
import mongoose from 'mongoose';

// PUT /api/admin/location/[id]
export async function PUT(req, { params }) {
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

    const { district, state } = await req.json();

    if (!district || !state) {
      return new NextResponse(
        JSON.stringify({ message: 'Both district and state are required' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

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

    // Store old values before updating
    const oldDistrict = location.district;
    const oldState = location.state;

    // Update location document
    location.district = district;
    location.state = state;
    await location.save();

    // Update location in all services
    const allServices = await NewService.find({
      "planPrices": {
        $elemMatch: {
          "state": oldState,
          "district": oldDistrict
        }
      }
    });

    const bulkOps = allServices.map(service => {
      return {
        updateOne: {
          filter: { 
            _id: service._id,
            "planPrices.state": oldState,
            "planPrices.district": oldDistrict
          },
          update: {
            $set: {
              "planPrices.$[elem].state": state,
              "planPrices.$[elem].district": district
            },
            $inc: { __v: 1 }
          },
          arrayFilters: [{ 
            "elem.state": oldState, 
            "elem.district": oldDistrict 
          }]
        }
      };
    });

    if (bulkOps.length > 0) {
      await NewService.bulkWrite(bulkOps);
    }

    return new NextResponse(
      JSON.stringify({ 
        message: 'Location updated successfully',
        location,
        servicesUpdated: bulkOps.length
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
    console.error('Error updating location by ID:', error);
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
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}