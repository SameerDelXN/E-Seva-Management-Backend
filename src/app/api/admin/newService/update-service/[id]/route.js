// // import { NextResponse } from 'next/server';
// // import dbConnect from '@/utils/db';
// // import NewService from '@/models/newServicesSchema';

// // // PATCH /api/services/[id]
// // export async function PATCH(req, { params }) {
// //   try {
// //     await dbConnect();

// //     const { id } = params;
// //     const body = await req.json();

// //     const {
// //       name,
// //       document,
// //       visibility,
// //       availablity,
// //       price,
// //       planPrices,
// //       status,
// //     } = body;

// //     const updatedService = await NewService.findByIdAndUpdate(
// //       id,
// //       {
// //         name,
// //         document,
// //         visibility,
// //         availablity,
// //         price,
// //         planPrices,
// //         status,
// //       },
// //       { new: true }
// //     );

// //     if (!updatedService) {
// //       return NextResponse.json(
// //         { message: 'Service not found.' },
// //         { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
// //       );
// //     }

// //     return NextResponse.json(
// //       { message: 'Service updated successfully.', service: updatedService },
// //       { 
// //         status: 200,
// //         headers: { 'Access-Control-Allow-Origin': '*' }  // Allow all origins
// //       }
// //     );
// //   } catch (error) {
// //     console.error('Error updating service:', error);
// //     return NextResponse.json(
// //       { message: 'Internal server error.' },
// //       { 
// //         status: 500,
// //         headers: { 'Access-Control-Allow-Origin': '*' }  // Allow all origins
// //       }
// //     );
// //   }
// // }


// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import NewService from '@/models/newServicesSchema';

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

//     return new NextResponse(
//       JSON.stringify({ message: 'Status added successfully.', service: updatedService }),
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

// PATCH /api/services/[id]
export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await req.json();

    const { newStatus } = body;

    if (!newStatus || !newStatus.name || !newStatus.hexcode) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required status fields.' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Update the service with the new status
    const updatedService = await NewService.findByIdAndUpdate(
      id,
      { $push: { status: newStatus } },
      { new: true }
    );

    if (!updatedService) {
      return new NextResponse(
        JSON.stringify({ message: 'Service not found.' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Also update any applications that reference this service
    // Find all applications that have this service ID
    await Application.updateMany(
      { 'service.id': id },
      {
        $set: {
          'service.status': {
            name: newStatus.name,
            hexcode: newStatus.hexcode,
            askreason: newStatus.askreason || false
          }
        }
      }
    );

    return new NextResponse(
      JSON.stringify({ 
        message: 'Status added successfully and applications updated.', 
        service: updatedService 
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error updating service status:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error.' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}