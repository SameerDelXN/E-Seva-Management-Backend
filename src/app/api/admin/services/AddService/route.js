// import { NextResponse } from 'next/server';
// import connectDB from '@/utils/db';
// import Service from '@/models/service';

// // POST API to create new service group
// export async function POST(req) {
//   try {
//     await connectDB();

//     const { title, imageUrl, services } = await req.json();

//     // Check if service title already exists
//     const alreadyExists = await Service.findOne({ title });

//     if (alreadyExists) {
//       return NextResponse.json({
//         success: false,
//         message: "Service title already exists",
//       }, { status: 400 });
//     }

//     // Create a new service
//     const newService = new Service({ title, imageUrl, services });
//     await newService.save();

//     return NextResponse.json({
//       success: true,
//       message: "Registration done",
//       data: newService,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error creating service group:", error);
//     return NextResponse.json({
//       success: false,
//       message: "Failed to create service group",
//       error: error.message
//     }, { status: 500 });
//   }
// }
