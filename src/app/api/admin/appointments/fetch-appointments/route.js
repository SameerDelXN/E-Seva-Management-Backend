import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import {Appointment} from '@/models/Appointment';

export async function GET(request) {
  try {
    await connectDB();
    

 
    
   
    
    const appointments = await Appointment.find({});
    
    
    return NextResponse.json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}