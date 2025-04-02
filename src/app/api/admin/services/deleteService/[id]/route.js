// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import connectDB from '@/utils/db';
// import Service from '@/models/service';

// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();

//     const { id } = params; // Extract ID from route parameters

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ success: false, error: "Invalid Service ID" }, { status: 400 });
//     }

//     const deletedService = await Service.findByIdAndDelete(id);

//     if (!deletedService) {
//       return NextResponse.json({
//         success: false,
//         message: "Service not found"
//       }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Service deleted successfully"
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error deleting service:", error);
//     return NextResponse.json({
//       success: false,
//       message: "Failed to delete service",
//       error: error.message
//     }, { status: 500 });
//   }
// }
