import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // Fetch all managers
        const managers = await StaffManager.find();

        return addCorsHeaders(
            NextResponse.json(
                { success: true, managers },
                { status: 200 }
            )
        );
    } catch (error) {
        console.error("Error fetching managers:", error);
        return addCorsHeaders(
            NextResponse.json(
                { success: false, error: "Internal Server Error" },
                { status: 500 }
            )
        );
    }
}

// Middleware function to add CORS headers
function addCorsHeaders(response) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

// Handle preflight requests (OPTIONS method)
export async function OPTIONS() {
    return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
