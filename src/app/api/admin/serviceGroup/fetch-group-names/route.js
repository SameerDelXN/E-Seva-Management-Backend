import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}

export async function GET() {
    try {
        await connectDB();

        // Fetch all service groups with their full data
        const serviceGroups = await ServiceGroup.find({});

        return createCORSResponse({ serviceGroups }, 200);
    } catch (error) {
        console.error("Error fetching service groups:", error);
        return createCORSResponse({ error: "Internal Server Error" }, 500);
    }
}

function createCORSResponse(data, status) {
    return NextResponse.json(data, {
        status,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}