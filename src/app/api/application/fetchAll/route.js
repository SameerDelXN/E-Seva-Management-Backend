// app/api/application/fetchAll/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Appointment } from "@/models/Appointment"; // Import the Appointment model

export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get the mobile number from the URL query parameters
    const { searchParams } = new URL(req.url);
    const mobileNumber = searchParams.get('phone');
    
    // Validate mobile number
    if (!mobileNumber) {
      return NextResponse.json({ 
        message: "Mobile number is required", 
        status: 400 
      }, { status: 400 });
    }
    
    // Find all appointments with the provided mobile number
    const applications = await Appointment.find({ 
      phone: mobileNumber 
    }).sort({ createdAt: -1 }); // Sort by newest first
    console.log(applications)
    // Format the response data for better display
    const formattedApplications = applications.map(app => ({
      id: app._id,
      name: app.serviceName,
      serviceGroup: app.serviceGroup,
      status: app.status,
      date: app.appointmentDate,
      timeSlot: app.timeSlot,
      price: app.price,
      contactInfo: {
        name: app.fullName,
        email: app.email,
        phone: app.phone,
        city: app.city
      },
      createdAt: app.createdAt
    }));
    
     
    const response = NextResponse.json({
        message: "Applications retrieved successfully", 
        data: formattedApplications,
        status: 200
      }, { status: 200 });
  
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({
      error: "Internal server error", 
      status: 500
    }, { status: 500 });
  }
}