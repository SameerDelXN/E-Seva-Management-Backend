// import { NextResponse } from 'next/server';
// import connectDB from '@/utils/db';

// import {Appointment} from '@/models/Appointment';

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { serviceName, serviceGroup, price, duration, appointmentDate, timeSlot, slotType, fullName, email, phone, city, address } = await req.json();
//         console.log(fullName);

//         // Validate input
//         if (!serviceName || !serviceGroup || !price || !appointmentDate || !timeSlot || !slotType || !fullName || !email || !phone || !city || !address) {
//             return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
//         }

//         // Create a new appointment
//         const newAppointment = new Appointment({ serviceName, serviceGroup, price, duration, appointmentDate, timeSlot, slotType, fullName, email, phone, city, address });
//         await newAppointment.save();

//         return NextResponse.json({ message: "Appointment booked successfully", appointment: newAppointment });
//     } catch (error) {
//         console.error("Error booking appointment:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Appointment } from '@/models/Appointment';

export async function POST(req) {
    try {
        await connectDB();

        const {
            serviceName,
            serviceGroup,
            price,
            duration,
            appointmentDate,
            timeSlot,

            fullName,
            email,
            phone,
            city,
            address
        } = await req.json();

        // Validate input
        if (
            !serviceName || !serviceGroup || !price || !appointmentDate ||
            !timeSlot ||  !fullName || !email ||
            !phone || !city || !address
        ) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // ✅ Check if appointment already exists for same user in the same time slot
        const existingAppointment = await Appointment.findOne({
            email,
            phone,
            appointmentDate,
            timeSlot
        });

        if (existingAppointment) {
            return NextResponse.json(
                { error: "Appointment already booked for this time slot" },
                { status: 409 }
            );
        }

        // Create and save new appointment
        const newAppointment = new Appointment({
            serviceName,
            serviceGroup,
            price,
            duration,
            appointmentDate,
            timeSlot,
        
            fullName,
            email,
            phone,
            city,
            address
        });

        await newAppointment.save();

        const response = NextResponse.json({
            message: "Appointment booked successfully",
            appointment: newAppointment
        });

        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return response;
    } catch (error) {
        console.error("Error booking appointment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }
    );
}
