// // src/app/api/admin/location/addlocation/route.js
// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Location from '@/models/location';

// export const POST = async (req) => {
//   try {
//     await dbConnect();

//     const body = await req.json();
//     const { district, state } = body;

//     if (!district || !state) {
//       return new NextResponse(
//         JSON.stringify({ message: 'District and State are required' }),
//         {
//           status: 400,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }

//     const newLocation = new Location({ district, state });
//     await newLocation.save();

//     return new NextResponse(
//       JSON.stringify({ message: 'Location added successfully', location: newLocation }),
//       {
//         status: 201,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (error) {
//     console.error('Error adding location:', error);
//     return new NextResponse(
//       JSON.stringify({ message: 'Internal Server Error' }),
//       {
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   }
// };

// // For preflight OPTIONS request
// export function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';
import NewService from '@/models/newServicesSchema';
import Plan from '@/models/Plans';
import mongoose from 'mongoose';

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

    // 1. Add location to Location model
    const newLocation = new Location({ district, state });
    await newLocation.save();

    // 2. Fetch all plans
    const allPlans = await Plan.find({});

    // Prepare plan array for this new location
    const planEntries = allPlans.map((plan) => ({
      plan: plan._id,
      planName: plan.name,
      price: 0,
      _id: new mongoose.Types.ObjectId(),
    }));

    // 3. Fetch all services and update them
    const allServices = await NewService.find({});

    const bulkOps = allServices.map((service) => {
      const locationExists = service.planPrices.some(
        (loc) => loc.state === state && loc.district === district
      );

      if (!locationExists) {
        const newLocationEntry = {
          state,
          district,
          plans: planEntries,
          _id: new mongoose.Types.ObjectId(),
        };

        return {
          updateOne: {
            filter: { _id: service._id },
            update: {
              $push: { planPrices: newLocationEntry },
              $inc: { __v: 1 },
            },
          },
        };
      }
      return null;
    }).filter(Boolean); // Remove nulls

    if (bulkOps.length > 0) {
      await NewService.bulkWrite(bulkOps);
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Location added and applied to all services with all plans',
        location: newLocation,
        servicesUpdated: bulkOps.length,
      }),
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

// Preflight
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
