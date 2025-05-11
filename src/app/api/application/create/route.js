// app/api/applications/create/route.js
// import connectDB from "@/utils/db";
// import Application from "@/models/application";
// import { NextResponse } from "next/server";

// // Helper function to add CORS headers to responses
// const addCorsHeaders = (response) => {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   return response;
// };

// export async function POST(request) {
//   try {
//     await connectDB();
//     const body = await request.json();
//     const newApplication = await Application.create(body);
//     const response = NextResponse.json(newApplication, { status: 201 });
//     return addCorsHeaders(response);
//   } catch (error) {
//     const response = NextResponse.json(
//       { error: "Failed to create application" },
//       { status: 500 }
//     );
//     return addCorsHeaders(response);
//   }
// }

// // Add OPTIONS method for CORS preflight
// export async function OPTIONS() {
//   const response = new NextResponse(null, { status: 204 });
//   return addCorsHeaders(response);
// }



// app/api/applications/create/route.js
// app/api/applications/create/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Application from '@/models/application';
import NewService from '@/models/newServicesSchema';
import Notification from '@/models/Notification';
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
    console.log("data in backend :", body);

    const serviceId = body.service._id;
    const service = await NewService.findById(serviceId);
    console.log(service);
    if (!service) {
      return new NextResponse(
        JSON.stringify({ message: 'Service not found' }),
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

    const statusArray = Array.isArray(service.status) ? service.status : [];

    // Create the new application
    const newApplication = new Application({
      name: body.name,
      provider: body.provider,
      phone: body.phone,
      date: body.date || new Date(),
      delivery: body.delivery,
      staff: body.staff,
      amount: body.amount,
      document: body.document || [],
      receipt: body.receipt || [],
      additional: body.additional || [],
      initialStatus: body.initialStatus,
      service: {
        id: service._id,
        name: service.name,
        status: statusArray,
      }
    });

    // Save the application to database
    const savedApplication = await newApplication.save();

    // Create notifications for admin and staff-manager
    const notificationTitle = `New Application Created`;
    const notificationMessage = `A new application for ${service.name} has been created by ${body.name}`;

    // Notification for admin
    const adminNotification = new Notification({
      title: notificationTitle,
      message: notificationMessage,
      recipientRole: 'admin',
      playSound: true
    });

    // Notification for staff-manager
    const staffManagerNotification = new Notification({
      title: notificationTitle,
      message: notificationMessage,
      recipientRole: 'staff-manager',
      playSound: true
    });

    // Save notifications
    await Promise.all([
      adminNotification.save(),
      staffManagerNotification.save()
    ]);

    return new NextResponse(
      JSON.stringify({
        message: 'Application created successfully',
        application: savedApplication
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
    console.error('Error creating application:', error);
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