import { NextResponse } from "next/server";
import Staff from "@/models/staff";
import connectDB from "@/utils/db";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    // Set CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    const { staffId } = params;
    const body = await req.json();

    const staff = await Staff.findById(staffId);
    if(!staff){
      return new NextResponse(
        JSON.stringify({ success: false, message: "Staff not found" }), 
        { status: 404, headers }
      );
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      body, 
      {
        new: true, 
        runValidators: true,
      }
    );

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: "Updated Successfully", 
        data: updatedStaff 
      }), 
      { status: 200, headers }
    );

  } catch (error) {
    console.log("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS preflight
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return new NextResponse(null, { headers });
}