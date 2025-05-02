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
    console.log("data in backend :",body)
    // Validate required fields
    // if (!body.name || !body.provider || !body.staff || !body.amount || !body.serviceId) {
    //   return new NextResponse(
    //     JSON.stringify({ message: 'Missing required fields' }),
    //     {
    //       status: 400,
    //       headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   );
    // }
// console.log(body);
    // Find the service by ID to get its status
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

    // Extract the default/initial status from the service's status array
    // Assuming the first status in the array is the initial status
    // let initialStatus = {
    //   name: "created",
    //   hexcode: "#34fc23",
    //   askreason: false
    // };

    // // If service has status information, use the first one (or appropriate one based on your logic)
    // if (service.status && service.status.length > 0) {
    //   initialStatus = {
    //     name: service.status[0].name || "created",
    //     hexcode: service.status[0].hexcode || "#34fc23",
    //     askreason: service.status[0].askreason || false
    //   };
    // }
    // Use the entire array of statuses from the service
    const statusArray = Array.isArray(service.status) ? service.status : [];
    // console.log(statusArray)

    // Create the new application with service reference and status from the service
    const newApplication = new Application({
      name: body.name,
      provider: body.provider,
      phone:body.phone,
      date: body.date || new Date(),
      delivery: body.delivery,
      staff: body.staff,
      amount: body.amount,
      document: body.document || [],
      receipt: body.receipt || [],
    initialStatus : body.initialStatus,
      // Service information with status from the service model
      service: {
        id: service._id,
        name: service.name,
        status: statusArray,
      }
    });

    // Save to database
     const savedApplication = await newApplication.save();

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