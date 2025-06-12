import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

// Handle preflight OPTIONS request
export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*", // Update to your frontend URL if needed
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}

// Handle GET request: Only fetch visible service groups
export async function GET() {
    try {
        await connectDB();

        // Fetch only service groups with visibility: true
        const serviceGroups = await ServiceGroup.find({ visibility: true });

        return createCORSResponse({ serviceGroups }, 200);
    } catch (error) {
        console.error("Error fetching visible service groups:", error);
        return createCORSResponse({ error: "Internal Server Error" }, 500);
    }
}

// Helper function to add CORS headers
function createCORSResponse(data, status) {
    return NextResponse.json(data, {
        status,
        headers: {
            "Access-Control-Allow-Origin": "*", // Update to your frontend URL if needed
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}
