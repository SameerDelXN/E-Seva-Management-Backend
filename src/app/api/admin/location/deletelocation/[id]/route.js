import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';

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

    const location = await Location.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({ message: 'Location deleted successfully' }),
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
