// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import NewService from '@/models/newServicesSchema';


// export const GET = async () => {
//     try {
//       await dbConnect();
//       const servicesData = await NewService.find();
  
//       return new NextResponse(
//         JSON.stringify({ message: 'Locations fetched successfully', servicesData }),
//         {
//           status: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//       return new NextResponse(
//         JSON.stringify({ message: 'Internal Server Error' }),
//         {
//           status: 500,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }
//   };




import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';
import Location from '@/models/location';
import Plan from '@/models/Plans'
export const GET = async () => {
  try {
    await dbConnect();

    const servicesData = await NewService.find()
      .populate('planPrices.location')           // ✅ Populating location name
      .populate('planPrices.plans.plan');        // ✅ Populating plan name inside each plan

    return new NextResponse(
      JSON.stringify({ message: 'Services fetched successfully', servicesData }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
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
