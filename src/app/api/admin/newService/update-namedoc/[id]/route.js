// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import NewService from '@/models/newServicesSchema';

// // PATCH /api/admin/newService/update-basic/[id]
// export async function PATCH(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = params;
//     const { name, documents } = await req.json();

//    console.log(documents);

//     const updatedService = await NewService.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           name: name,
//           document: documents, // replaces entire array
//         }
//       },
//       { new: true }
//     );

//     if (!updatedService) {
//       return NextResponse.json(
//         { message: 'Service not found.' },
//         { status: 404 }
//       );
//     }

//     const response = NextResponse.json(
//       { message: 'Service updated successfully.', service: updatedService },
//       { status: 200 }
//     );

//     // CORS headers
//     response.headers.set('Access-Control-Allow-Origin', '*');
//     response.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
//     response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

//     return response;
//   } catch (error) {
//     console.error('Error updating service:', error);
//     return NextResponse.json(
//       { message: 'Internal server error.' },
//       { status: 500 }
//     );
//   }
// }

// // ✅ FIXED: CORS Preflight Handler
// export function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     }
//   });
// }




import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';
import Application from '@/models/application';
import ServiceGroup from '@/models/ServiceGroup';

// PUT /api/admin/newService/updateService/[id]
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await req.json();
    console.log(body);
    

    if (!id) {
      return NextResponse.json(
        { message: 'Service ID is required.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Get the current service before update to compare status changes
    const currentService = await NewService.findById(id);
    if (!currentService) {
      return NextResponse.json(
        { message: 'Service not found.' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Update the service
    const updatedService = await NewService.findByIdAndUpdate(
      id,
      body, // Update with all fields from request body
      { new: true }
    );

    // Check if status array was modified
    const statusChanged = 
      body.status && 
      JSON.stringify(currentService.status) !== JSON.stringify(body.status);

    // Update Service Groups that contain this service
    if (statusChanged || body.name) {
      await ServiceGroup.updateMany(
        { 'services.serviceId': id },
        {
          $set: {
            'services.$.name': body.name || updatedService.name,
            ...(statusChanged && { 'services.$.status': updatedService.status })
          }
        }
      );
    }

    // Update Applications that use this service
    if (statusChanged) {
      await Application.updateMany(
        { 'service.id': id },
        {
          $set: {
            'service.status': updatedService.status
          }
        }
      );
    }

    return NextResponse.json(
      { 
        message: 'Service updated successfully.', 
        service: updatedService,
        statusUpdated: statusChanged,
        applicationsUpdated: statusChanged
      },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}