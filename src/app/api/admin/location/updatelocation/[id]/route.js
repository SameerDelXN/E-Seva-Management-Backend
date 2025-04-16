import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';

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

    location.district = district;
    location.state = state;

    await location.save();

    return new NextResponse(
      JSON.stringify({ location }),
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


