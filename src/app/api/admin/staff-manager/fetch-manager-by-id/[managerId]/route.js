import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();

        // Extract managerId from params
        const { managerId } = params;

        if (!managerId) {
            return NextResponse.json(
                { success: false, message: "Manager ID is required" },
                { status: 400 }
            );
        }

        // Find manager by ID
        const manager = await StaffManager.findById(managerId);

        // If manager not found
        if (!manager) {
            return addCorsHeaders(
                NextResponse.json(
                    { success: false, message: "Manager not found" },
                    { status: 404 }
                )
            );
        }

        // Return found manager with CORS headers
        return addCorsHeaders(
            NextResponse.json(
                { success: true, manager },
                { status: 200 }
            )
        );
    } catch (error) {
        console.error("Error fetching manager:", error);
        return addCorsHeaders(
            NextResponse.json(
                { success: false, message: "Internal Server Error" },
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
