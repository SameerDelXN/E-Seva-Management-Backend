// app/api/admin/newService/addService/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';

// Handle OPTIONS requests (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',  // In production, replace with specific origin
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Handle POST requests
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.document) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create the new service
    const newService = new NewService({
      name: body.name,
      document: body.document,
      visibility: body.visibility,
      availablity: body.availablity,
      price: body.price || 0,
      planPrices: body.planPrices || [],
      status: body.status || []
    });

    // Save to database
    await newService.save();

    return new NextResponse(
      JSON.stringify({ 
        message: 'Service added successfully', 
        service: newService 
      }),
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error adding service:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}