import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();

        // Ensure params contains managerId
     

        // Extract managerId
        const { managerId } = await params;

        // Find manager by ID
        const manager = await StaffManager.findById(managerId);

        // If manager not found
        if (!manager) {
            return NextResponse.json(
                { success: false, message: "Manager not found" },
                { status: 404 }
            );
        }

        // Return found manager
        return NextResponse.json(
            { success: true, manager },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching manager:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
