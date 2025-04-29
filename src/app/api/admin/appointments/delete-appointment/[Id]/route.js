import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Appointment } from '@/models/Appointment';

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // Ensure params exists and correctly extract the id
    const { Id } =await params;  // Assuming "id" is the correct key
    if (!Id) {
      return NextResponse.json({
        success: false,
        message: "Appointment ID is required",
      }, { status: 400 });
    }



    const appointment = await Appointment.findByIdAndDelete(Id);

    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: "Appointment not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
