import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Appointment } from '@/models/Appointment';

// Handle OPTIONS preflight request
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { Id } = params;

    if (!Id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 }
      );
    }

    if (!Id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment ID format" },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    const updatedAppointment = await Appointment.findByIdAndUpdate(Id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully",
        appointment: updatedAppointment,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db'; // Assuming you have a database connection utility
// import Appointment from '@/models/Appointment'; // Import your appointment model

// export async function PUT(request) {
//   try {
//     // Connect to database
//     await connectDB();
    
//     // Parse the request body
//     const body = await request.json();
//     const { appointmentId, status } = body;
    
//     // Validate inputs
//     if (!appointmentId || !status) {
//       return NextResponse.json(
//         { success: false, message: 'Appointment ID and status are required' },
//         { status: 400 }
//       );
//     }

//     // Check if status is valid
//     const validStatuses = ['Pending', 'Visited', 'Rejected'];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid status value' },
//         { status: 400 }
//       );
//     }

//     // Find and update the appointment
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status },
//       { new: true } // Return the updated document
//     );

//     if (!updatedAppointment) {
//       return NextResponse.json(
//         { success: false, message: 'Appointment not found' },
//         { status: 404 }
//       );
//     }

//     // Return success response with updated appointment

//     const response =  NextResponse.json(
//       { 
//         success: true, 
//         message: 'Appointment status updated successfully',
//         data: updatedAppointment 
//       },
//       { status: 200 }
//     );
//     response.headers.set("Access-Control-Allow-Origin", "*");
//     response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
//     response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
//     return response;

//   } catch (error) {
//     console.error('Error updating appointment status:', error);
    
//     return NextResponse.json(
//       { success: false, message: 'Failed to update appointment status', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Appointment from '@/models/Appointment';
// export async function PUT(request) {
//   // Handle CORS preflight request
//   if (request.method === 'OPTIONS') {
//     return new NextResponse(null, {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'PUT, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       },
//     });
//   }

//   try {
//     await connectDB();
//     const body = await request.json();
//     const { appointmentId, status } = body;
    
//     if (!appointmentId || !status) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: 'Appointment ID and status are required' }),
//         { 
//           status: 400, 
//           headers: { 
//             'Content-Type': 'application/json', 
//             'Access-Control-Allow-Origin': '*',
//           } 
//         }
//       );
//     }

//     const validStatuses = ['Pending', 'Visited', 'Rejected'];
//     if (!validStatuses.includes(status)) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: 'Invalid status value' }),
//         { 
//           status: 400, 
//           headers: { 
//             'Content-Type': 'application/json', 
//             'Access-Control-Allow-Origin': '*',
//           } 
//         }
//       );
//     }

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status },
//       { new: true }
//     );

//     if (!updatedAppointment) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: 'Appointment not found' }),
//         { 
//           status: 404, 
//           headers: { 
//             'Content-Type': 'application/json', 
//             'Access-Control-Allow-Origin': '*',
//           } 
//         }
//       );
//     }

//     return new NextResponse(
//       JSON.stringify({ 
//         success: true, 
//         message: 'Appointment status updated successfully',
//         data: updatedAppointment 
//       }),
//       { 
//         status: 200, 
//         headers: { 
//           'Content-Type': 'application/json', 
//           'Access-Control-Allow-Origin': '*',
//         } 
//       }
//     );

//   } catch (error) {
//     console.error('Error updating appointment status:', error);
//     return new NextResponse(
//       JSON.stringify({ 
//         success: false, 
//         message: 'Failed to update appointment status', 
//         error: error.message 
//       }),
//       { 
//         status: 500, 
//         headers: { 
//           'Content-Type': 'application/json', 
//           'Access-Control-Allow-Origin': '*',
//         } 
//       }
//     );
//   }
// }




