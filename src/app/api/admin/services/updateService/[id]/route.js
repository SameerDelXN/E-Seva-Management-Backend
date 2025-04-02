// import { NextResponse } from 'next/server';
// import connectDB from '@/utils/db';
// import Service from '@/models/service';

// export async function PUT(request,{params}) {
//   try {
//     await connectDB();
    
//     const { id } = await params;
//     // const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json({
//         success: false,
//         message: "Service ID is required"
//       }, { status: 400 });
//     }
    
//     const body = await request.json();
    
//     // Validate update data
//     if (body.title && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
//       return NextResponse.json({
//         success: false,
//         message: "Title must be a non-empty string"
//       }, { status: 400 });
//     }

//     // if (body.imageUrl && (typeof body.imageUrl !== 'string' || !isValidUrl(body.imageUrl))) {
//     //   return NextResponse.json({
//     //     success: false,
//     //     message: "Invalid image URL format"
//     //   }, { status: 400 });
//     // }

//     if (body.services && (!Array.isArray(body.services) || body.services.length === 0)) {
//       return NextResponse.json({
//         success: false,
//         message: "Services must be a non-empty array"
//       }, { status: 400 });
//     }

//     const updatedService = await Service.findByIdAndUpdate(
//       id,
//       { 
//         ...body,
//         services: body.services?.map(service => service.trim())
//       },
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedService) {
//       return NextResponse.json({
//         success: false,
//         message: "Service not found"
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: "Service updated successfully",
//       data: updatedService
//     }, { status: 200 });
    
//   } catch (error) {
//     console.error("Error updating service:", error);
//     return NextResponse.json({
//       success: false,
//       message: "Failed to update service",
//       error: error.message
//     }, { status: 500 });
//   }
// }
