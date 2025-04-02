import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Service from '@/models/service';

export async function GET() {
  try {
    await connectDB();

    // Fetch all services from the database
    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "All services fetched successfully",
      data: services
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching all services:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch services",
      error: error.message
    }, { status: 500 });
  }
}


 