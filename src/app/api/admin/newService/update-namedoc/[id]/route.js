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
const mongoose = require("mongoose");

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

    // Get the current service before update to compare changes
    const currentService = await NewService.findById(id);
    if (!currentService) {
      return NextResponse.json(
        { message: 'Service not found.' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value) && (new mongoose.Types.ObjectId(value)).toString() === value;
};

let serviceGroup = null;

if (body.serviceGroup) {
  if (isValidObjectId(body.serviceGroup)) {
    // It's an ObjectId string
    serviceGroup = await ServiceGroup.findById(body.serviceGroup);
  } else {
    // It's a name string
    serviceGroup = await ServiceGroup.findOne({ name: body.serviceGroup });
  }

  if (!serviceGroup) {
    return NextResponse.json({ error: 'Service group not found' }, { status: 404 });
  }
}

 console.log("group",serviceGroup);
 const data={
  name:body.name,
  document:body.document,
  planPrices:body.planPrices,
  serviceGroup: {
        id: serviceGroup._id,
        name:serviceGroup.name,
      },
      status:body.status,
      price:body.price,
      formData:body.formData,
      visibility:body.visibility
}
    // Update the service
    const updatedService = await NewService.findByIdAndUpdate(
      id,
      data, // Update with all fields from request body
      { new: true }
    );

    // Check which fields were modified
    const statusChanged = 
      body.status && 
      JSON.stringify(currentService.status) !== JSON.stringify(body.status);
    
    const nameChanged = 
      body.name && 
      currentService.name !== body.name;
    
    const formDataChanged = 
      body.formData && 
      JSON.stringify(currentService.formData) !== JSON.stringify(body.formData);

    // Prepare update object for Service Groups
    const serviceGroupUpdates = {};
    if (nameChanged) {
      serviceGroupUpdates['services.$.name'] = updatedService.name;
    }
    if (statusChanged) {
      serviceGroupUpdates['services.$.status'] = updatedService.status;
    }
    if (formDataChanged) {
      serviceGroupUpdates['services.$.formData'] = updatedService.formData;
    }

    // Update Service Groups that contain this service if any relevant field changed
    if (nameChanged || statusChanged || formDataChanged) {
      await ServiceGroup.updateMany(
        { 'services.serviceId': id },
        { $set: serviceGroupUpdates }
      );
    }

    // Update Applications that use this service if status changed
    if (statusChanged) {
      await Application.updateMany(
        { 'service.id': id },
        { $set: { 'service.status': updatedService.status } }
      );
    }

    return NextResponse.json(
      { 
        message: 'Service updated successfully.', 
        service: updatedService,
        updates: {
          statusUpdated: statusChanged,
          nameUpdated: nameChanged,
          formDataUpdated: formDataChanged,
          applicationsUpdated: statusChanged
        }
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
      'Access-Control-Allow-Methods': 'PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}