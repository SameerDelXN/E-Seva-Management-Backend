import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Service from '@/models/service';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Build query object
    const query = {};
    if (status !== null) {
      query.status = status === 'true';
    }
    
    const services = await Service.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      message: "Services fetched successfully",
      data: services
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch services",
      error: error.message
    }, { status: 500 });
  }
}

