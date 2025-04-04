// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import ServiceGroup from "@/models/ServiceGroup";

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { serviceGroupName, serviceName, documentNames } = await req.json();

//         // Validate input
//         if (!serviceGroupName || !serviceName || !Array.isArray(documentNames)) {
//             return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
//         }

//         // Find the service group by name
//         const serviceGroup = await ServiceGroup.findOne({ name: serviceGroupName });
//         if (!serviceGroup) {
//             return NextResponse.json({ error: "Service group not found" }, { status: 404 });
//         }

//         // Check if the service already exists in the service group
//         const existingService = serviceGroup.services.find(service => service.name === serviceName);
//         if (existingService) {
//             return NextResponse.json({ error: "Service already exists in this group" }, { status: 400 });
//         }

//         // Create a new service object
//         const newService = { name: serviceName, documentNames };

//         // Add the service to the service group
//         serviceGroup.services.push(newService);
//         await serviceGroup.save();

//         return NextResponse.json({ message: "Service added successfully", serviceGroup });
//     } catch (error) {
//         console.error("Error adding service:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

export async function POST(req) {
    try {
        await connectDB();
        const { serviceGroupName, serviceName, documentNames } = await req.json();

        // Validate input
        if (!serviceGroupName || !serviceName || !Array.isArray(documentNames)) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // Find the service group by name
        const serviceGroup = await ServiceGroup.findOne({ name: serviceGroupName });
        if (!serviceGroup) {
            return NextResponse.json({ error: "Service group not found" }, { status: 404 });
        }

        // Check if the service already exists in the service group
        const existingService = serviceGroup.services.find(service => service.name === serviceName);
        if (existingService) {
            return NextResponse.json({ error: "Service already exists in this group" }, { status: 400 });
        }

        // Create a new service object
        const newService = { name: serviceName, documentNames };

        // Add the service to the service group
        serviceGroup.services.push(newService);
        await serviceGroup.save();

        // Add CORS headers
        const response = NextResponse.json({
            message: "Service added successfully",
            serviceGroup
        });

        response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return response;
    } catch (error) {
        console.error("Error adding service:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
