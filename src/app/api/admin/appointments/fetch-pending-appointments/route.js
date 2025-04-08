import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import {Appointment} from '@/models/Appointment';


// export async function GET(params) {

//     try {
//         await connectDB();
//         const appointments = await Appointment.find({ status: 'Pending' }).sort({ createdAt: -1 });
        
//         const response=NextResponse.json({
//             success: true,
//             message: "Appointments with status pending fetched successfully",
//             data: appointments
//           }, { status: 200 });
//           response.headers.set("Access-Control-Allow-Origin", "*");
//           response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
//           response.headers.set("Access-Control-Allow-Headers", "Content-Type");
          
//         return response;
        
//       } catch (error) {
//         return NextResponse.json({
//           success: false,
//           message: error.message
//         }, { status: 500 });
//       }
    
// }


export async function GET(request) {
    try {
      await connectDB();
      
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status'); // Optional filter
      
      // If status is provided, validate it
      const validStatuses = ['Pending', 'Visited', 'Rejected'];
      if (status && !validStatuses.includes(status)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid status parameter'
        }, { status: 400 });
      }
  
      // Fetch appointments (filtered if status is provided, otherwise all)
      const query = status ? { status } : {};
      const appointments = await Appointment.find(query).sort({ createdAt: -1 });
      
      const response = NextResponse.json({
        success: true,
        message: status 
          ? `Appointments with status ${status} fetched successfully` 
          : 'All appointments fetched successfully',
        data: appointments
      }, { status: 200 });
      
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      
      return response;
      
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
  }