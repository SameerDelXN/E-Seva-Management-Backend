import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Appointment } from '@/models/Appointment';

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    // Extract appointment ID from params
    const { Id } = await params;

    if (!Id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId
    if (!Id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment ID format" },
        { status: 400 }
      );
    }

    // Get the update data from the request body
    const updateData = await req.json();

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(Id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures new data follows schema rules
    });

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Appointment updated successfully", appointment: updatedAppointment },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
