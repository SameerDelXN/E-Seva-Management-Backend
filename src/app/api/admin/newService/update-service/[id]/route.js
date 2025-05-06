// // // import { NextResponse } from 'next/server';
// // // import dbConnect from '@/utils/db';
// // // import NewService from '@/models/newServicesSchema';

// // // // PATCH /api/services/[id]
// // // export async function PATCH(req, { params }) {
// // //   try {
// // //     await dbConnect();

// // //     const { id } = params;
// // //     const body = await req.json();

// // //     const {
// // //       name,
// // //       document,
// // //       visibility,
// // //       availablity,
// // //       price,
// // //       planPrices,
// // //       status,
// // //     } = body;

// // //     const updatedService = await NewService.findByIdAndUpdate(
// // //       id,
// // //       {
// // //         name,
// // //         document,
// // //         visibility,
// // //         availablity,
// // //         price,
// // //         planPrices,
// // //         status,
// // //       },
// // //       { new: true }
// // //     );

// // //     if (!updatedService) {
// // //       return NextResponse.json(
// // //         { message: 'Service not found.' },
// // //         { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
// // //       );
// // //     }

// // //     return NextResponse.json(
// // //       { message: 'Service updated successfully.', service: updatedService },
// // //       { 
// // //         status: 200,
// // //         headers: { 'Access-Control-Allow-Origin': '*' }  // Allow all origins
// // //       }
// // //     );
// // //   } catch (error) {
// // //     console.error('Error updating service:', error);
// // //     return NextResponse.json(
// // //       { message: 'Internal server error.' },
// // //       { 
// // //         status: 500,
// // //         headers: { 'Access-Control-Allow-Origin': '*' }  // Allow all origins
// // //       }
// // //     );
// // //   }
// // // }


// // import { NextResponse } from 'next/server';
// // import dbConnect from '@/utils/db';
// // import NewService from '@/models/newServicesSchema';

// // // PATCH /api/services/[id]
// // export async function PATCH(req, { params }) {
// //   try {
// //     await dbConnect();

// //     const { id } = params;
// //     const body = await req.json();

// //     const { newStatus } = body;

// //     if (!newStatus || !newStatus.name || !newStatus.hexcode) {
// //       return new NextResponse(
// //         JSON.stringify({ message: 'Missing required status fields.' }),
// //         {
// //           status: 400,
// //           headers: {
// //             'Access-Control-Allow-Origin': '*',
// //             'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
// //             'Access-Control-Allow-Headers': 'Content-Type',
// //           },
// //         }
// //       );
// //     }

// //     const updatedService = await NewService.findByIdAndUpdate(
// //       id,
// //       { $push: { status: newStatus } },
// //       { new: true }
// //     );

// //     if (!updatedService) {
// //       return new NextResponse(
// //         JSON.stringify({ message: 'Service not found.' }),
// //         {
// //           status: 404,
// //           headers: {
// //             'Access-Control-Allow-Origin': '*',
// //             'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
// //             'Access-Control-Allow-Headers': 'Content-Type',
// //           },
// //         }
// //       );
// //     }

// //     return new NextResponse(
// //       JSON.stringify({ message: 'Status added successfully.', service: updatedService }),
// //       {
// //         status: 200,
// //         headers: {
// //           'Access-Control-Allow-Origin': '*',
// //           'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
// //           'Access-Control-Allow-Headers': 'Content-Type',
// //         },
// //       }
// //     );
// //   } catch (error) {
// //     console.error('Error updating service status:', error);
// //     return new NextResponse(
// //       JSON.stringify({ message: 'Internal server error.' }),
// //       {
// //         status: 500,
// //         headers: {
// //           'Access-Control-Allow-Origin': '*',
// //           'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
// //           'Access-Control-Allow-Headers': 'Content-Type',
// //         },
// //       }
// //     );
// //   }
// // }

// // // CORS Preflight
// // export async function OPTIONS() {
// //   return new NextResponse(null, {
// //     status: 204,
// //     headers: {
// //       'Access-Control-Allow-Origin': '*',
// //       'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
// //       'Access-Control-Allow-Headers': 'Content-Type',
// //     },
// //   });
// // }



// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import NewService from '@/models/newServicesSchema';
// import Application from '@/models/application';
// import ServiceGroup from '@/models/ServiceGroup';

// // PATCH /api/services/[id]
// export async function PATCH(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = params;
//     const body = await req.json();

//     const { newStatus } = body;

//     if (!newStatus || !newStatus.name || !newStatus.hexcode) {
//       return new NextResponse(
//         JSON.stringify({ message: 'Missing required status fields.' }),
//         {
//           status: 400,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type',
//           },
//         }
//       );
//     }

//     // Update the service with the new status
//     const updatedService = await NewService.findByIdAndUpdate(
//       id,
//       { $push: { status: newStatus } },
//       { new: true }
//     );

//     if (!updatedService) {
//       return new NextResponse(
//         JSON.stringify({ message: 'Service not found.' }),
//         {
//           status: 404,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type',
//           },
//         }
//       );
//     }

//     // Also update any applications that reference this service
//     // Find all applications that have this service ID
// await await ServiceGroup.updateOne(
//   { 'services.serviceId': id },
//   {
//     $set: {
//       'services.$.status': updatedService.status  // this already includes the new status
//     }
//   }
// );

//     // await Application.updateMany(
//     //   { 'service.id': id },
//     //   {
//     //     $set: {
//     //       'service.status': {
//     //         name: newStatus.name,
//     //         hexcode: newStatus.hexcode,
//     //         askreason: newStatus.askreason || false
//     //       }
//     //     }
//     //   }
//     // );

//     await Application.updateMany(
//       { 'service.id': id },
//       {
//         $push: {
//           'service.status': {
//             name: newStatus.name,
//             hexcode: newStatus.hexcode,
//             askreason: newStatus.askreason || false
//           }
//         }
//       }
//     );
    
//     return new NextResponse(
//       JSON.stringify({ 
//         message: 'Status added successfully and applications updated.', 
//         service: updatedService 
//       }),
//       {
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         },
//       }
//     );
//   } catch (error) {
//     console.error('Error updating service status:', error);
//     return new NextResponse(
//       JSON.stringify({ message: 'Internal server error.' }),
//       {
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         },
//       }
//     );
//   }
// }

// // CORS Preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
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
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}