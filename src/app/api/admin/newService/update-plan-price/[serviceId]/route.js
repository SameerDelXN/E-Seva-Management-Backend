// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import NewService from '@/models/newServicesSchema';
// import ServiceGroup from '@/models/ServiceGroup';
// // PATCH /api/admin/newService/update-plan-price/[serviceId]
// export async function PATCH(req, { params }) {
//   await dbConnect();

//   const { serviceId } = params;
 
//   const { district, state, planId, newPrice } = await req.json();
//  console.log(planId);
//   if (!district || !state || !planId || newPrice === undefined) {
//     return new NextResponse(JSON.stringify({ message: 'Missing required fields.' }), {
//       status: 400,
//       headers: corsHeaders,
//     });
//   }

//   try {
//     const service = await NewService.findById(serviceId);
//    console.log("asdfas",service);
//     if (!service) {
//       return new NextResponse(JSON.stringify({ message: 'Service not found' }), {
//         status: 404,
//         headers: corsHeaders,
//       });
//     }

//     // Find the district/state entry
//     const location = service.planPrices.find(
//       (loc) => loc.district === district && loc.state === state
//     );

//     if (!location) {
//       return new NextResponse(JSON.stringify({ message: 'Location not found in planPrices' }), {
//         status: 404,
//         headers: corsHeaders,
//       });
//     }

//     // Find the plan entry
//     const plan = location.plans.find((p) => p._id.toString() === planId);
 
//     if (!plan) {
//       return new NextResponse(JSON.stringify({ message: 'Plan not found in location' }), {
//         status: 404,
//         headers: corsHeaders,
//       });
//     }

//     // Update the price
//     plan.price = newPrice;

//     await service.save();
//  const serviceIdStr = service.serviceGroup.name.toString();
//        const group = await ServiceGroup.findOne({ 'name': serviceIdStr });
//       console.log("group",group)
//     return new NextResponse(
//       JSON.stringify({ message: 'Plan price updated successfully', planPrices: service.planPrices }),
//       {
//         status: 200,
//         headers: corsHeaders,
//       }
//     );
//   } catch (err) {
//     console.error(err);
//     return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// }

// // CORS Preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type',
// };
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';
import ServiceGroup from '@/models/ServiceGroup';

// PATCH /api/admin/newService/update-plan-price/[serviceId]
export async function PATCH(req, context) {
  const { params } = context;
  await dbConnect();

  const { serviceId } = params;
  const { subdistrict, district, planId, newPrices } = await req.json();

  if (!subdistrict || !district || !planId || !newPrices) {
    return new NextResponse(JSON.stringify({ message: 'Missing required fields.' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const service = await NewService.findById(serviceId);
    if (!service) {
      return new NextResponse(JSON.stringify({ message: 'Service not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const location = service.planPrices.find(
      (loc) => loc.subdistrict === subdistrict && loc.district === district
    );
    if (!location) {
      return new NextResponse(JSON.stringify({ message: 'Location not found in planPrices' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const plan = location.plans.find((p) => p._id.toString() === planId);
    if (!plan) {
      return new NextResponse(JSON.stringify({ message: 'Plan not found in location' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    plan.price = newPrices;
    await service.save();

    // Also update in ServiceGroup
    const group = await ServiceGroup.findOne({ 'services.serviceId': serviceId.toString() });
    if (group) {
      const targetService = group.services.find(s => s.serviceId === serviceId.toString());
      if (targetService) {
        const targetLocation = targetService.planPrices.find(
          (loc) => loc.subdistrict === subdistrict && loc.district === district
        );
        if (targetLocation) {
          const targetPlan = targetLocation.plans.find((p) => p._id.toString() === planId);
          if (targetPlan) {
            targetPlan.price = newPrices;
            await group.save();
          }
        }
      }
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Plan price updated successfully',
        planPrices: service.planPrices
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
