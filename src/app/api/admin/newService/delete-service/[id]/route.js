import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';
import ServiceGroup from '@/models/ServiceGroup';

// DELETE /api/admin/newService/delete-service/[id]
export const DELETE = async (req, { params }) => {
  try {
    await dbConnect();

    const { id } = params;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: 'Service ID is required' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // First find the service to get its name
    const serviceToDelete = await NewService.findById(id);
    
    if (!serviceToDelete) {
      return new NextResponse(
        JSON.stringify({ message: 'Service not found' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Remove the service from all service groups that contain it (matching by name)
    const updateResult = await ServiceGroup.updateMany(
      { 'services.name': serviceToDelete.name },
      { $pull: { services: { name: serviceToDelete.name } } }
    );

    // Now delete the service itself
    const deletedService = await NewService.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({ 
        message: 'Service deleted successfully', 
        deletedService,
        groupsUpdated: updateResult.modifiedCount // Number of groups that were updated
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
    console.error('Error deleting service:', error);
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
};

// Preflight OPTIONS handler (required for CORS)
export const OPTIONS = () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};