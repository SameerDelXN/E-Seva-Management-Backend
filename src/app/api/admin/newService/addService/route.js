// app/api/admin/newService/addService/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';
import ServiceGroup from '@/models/ServiceGroup';
import mongoose from 'mongoose';

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
    console.log("body",body.planPrices[0].plans);
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

    // Check if serviceGroupId is provided
    if (!body.serviceGroupId) {
      return new NextResponse(
        JSON.stringify({ message: 'Service group ID is required' }),
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

    // Find the service group first
    const serviceGroup = await ServiceGroup.findById(body.serviceGroupId);
    if (!serviceGroup) {
      return new NextResponse(
        JSON.stringify({ message: 'Service group not found' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create the new service with service group reference
    const newService = new NewService({
      name: body.name,
      document: body.document,
      visibility: body.visibility,
      formData:[],
      availablity: body.availablity,
      price: body.price || 0,
      planPrices: body.planPrices || [],
      status: body.status || [],
      serviceGroup: {
        id: serviceGroup._id,
        name: serviceGroup.name
      }
    });

    // Save to database
    const savedService = await newService.save();
    console.log("data",savedService.planPrices[0]);
    // Create a new service object for the service group
    // Explicitly use the service ID string to ensure it's stored correctly
    const serviceForGroup = {
      serviceId: savedService._id.toString(),  // Store as string to preserve exact ID
      name: savedService.name,
      price:savedService.price,
      status: body.status || [],
      documentNames: savedService.document,
      planPrices: savedService.planPrices || [],
      formData:savedService.formDaa || []
    };

    // Push the service to the service group
    serviceGroup.services.push(serviceForGroup);
    await serviceGroup.save();

    return new NextResponse(
      JSON.stringify({
        message: 'Service added successfully and allocated to service group',
        service: savedService,
        serviceGroup: {
          _id: serviceGroup._id,
          name: serviceGroup.name,
          serviceReference: serviceForGroup  // Return the reference for verification
        }
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