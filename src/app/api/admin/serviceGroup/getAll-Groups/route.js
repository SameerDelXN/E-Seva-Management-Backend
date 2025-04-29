// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import ServiceGroup from "@/models/ServiceGroup";

// export async function GET() {
//     try {
//         await connectDB();

//         // Fetch all service groups from the database
//         const serviceGroups = await ServiceGroup.find();

//         return NextResponse.json({ serviceGroups });
//     } catch (error) {
//         console.error("Error fetching service groups:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

// Handle preflight OPTIONS request
export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*", // Change this to your frontend URL if needed
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}

// Handle GET request
export async function GET() {
    try {
        await connectDB();

        // Fetch all service groups from the database
        const serviceGroups = await ServiceGroup.find();

        return createCORSResponse({ serviceGroups }, 200);
    } catch (error) {
        console.error("Error fetching service groups:", error);
        return createCORSResponse({ error: "Internal Server Error" }, 500);
    }
}

// Helper function to add CORS headers
function createCORSResponse(data, status) {
    return NextResponse.json(data, {
        status,
        headers: {
            "Access-Control-Allow-Origin": "*", // Change to your frontend URL if needed
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}
