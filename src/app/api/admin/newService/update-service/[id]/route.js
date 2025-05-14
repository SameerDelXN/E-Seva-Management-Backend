


import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';
import Application from '@/models/application';
import ServiceGroup from '@/models/ServiceGroup';

// PATCH /api/services/[id]
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



export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const { newStatus } = body;

    if (!newStatus || !newStatus.name || !newStatus.hexcode || typeof newStatus.priority !== 'number') {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required status fields.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Fetch the current service
    const service = await NewService.findById(id);
    if (!service) {
      return new NextResponse(
        JSON.stringify({ message: 'Service not found.' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Adjust priorities in existing statuses
    const updatedStatuses = service.status.map((status) => {
      if (status.priority >= newStatus.priority) {
        return { ...status.toObject(), priority: status.priority + 1 };
      }
      return status;
    });

    // Add the new status
    updatedStatuses.push(newStatus);

    // Update the service with new statuses array
    service.status = updatedStatuses;
    await service.save();

    // Optional: update serviceGroup and Application if needed
    await ServiceGroup.updateOne(
      { 'services.serviceId': id },
      {
        $set: {
          'services.$.status': updatedStatuses
        }
      }
    );

    await Application.updateMany(
      { 'service.id': id },
      {
        $push: {
          'service.status': {
            name: newStatus.name,
            hexcode: newStatus.hexcode,
            askreason: newStatus.askreason || false,
            priority: newStatus.priority
          }
        }
      }
    );

    return new NextResponse(
      JSON.stringify({
        message: 'Status added with priority adjustment.',
        service
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error updating service status:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// CORS helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

