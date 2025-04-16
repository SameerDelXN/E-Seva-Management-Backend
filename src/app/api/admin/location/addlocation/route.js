// src/app/api/admin/location/addlocation/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';

export const POST = async (req) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { district, state } = body;

    if (!district || !state) {
      return new NextResponse(
        JSON.stringify({ message: 'District and State are required' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const newLocation = new Location({ district, state });
    await newLocation.save();

    return new NextResponse(
      JSON.stringify({ message: 'Location added successfully', location: newLocation }),
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error adding location:', error);
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

// For preflight OPTIONS request
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
