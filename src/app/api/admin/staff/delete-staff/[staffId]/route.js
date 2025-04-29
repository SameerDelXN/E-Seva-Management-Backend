import { NextResponse } from "next/server";
import Staff from "@/models/staff";
import connectDB from "@/utils/db";
import mongoose from "mongoose";

// Helper function to set CORS headers
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { staffId } = params;

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      const response = NextResponse.json(
        { success: false, error: "Invalid Staff ID" },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      const response = NextResponse.json(
        { message: "Staff not found", status: 400 }
      );
      return setCorsHeaders(response);
    }

    await Staff.findByIdAndDelete(staffId);
    const response = NextResponse.json(
      { message: "Deleted Successfully", status: 200 }
    );
    return setCorsHeaders(response);

  } catch (error) {
    console.log("Internal server error", error);
    const response = NextResponse.json(
      { error: "Internal server error", status: 500 }
    );
    return setCorsHeaders(response);
  }
}

// Required for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}