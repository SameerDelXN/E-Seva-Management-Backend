import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
    try {
        await connectDB();

       

        // Extract managerId
        const { managerId } = await params;

        // Parse request body
        const updatedData = await req.json();

        // If password is being updated, hash it
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        // Find and update the manager
        const manager = await StaffManager.findByIdAndUpdate(
            managerId,
            updatedData,
            { new: true, runValidators: true } // Return updated manager & validate fields
        );

        // If manager not found
        if (!manager) {
            return NextResponse.json(
                { success: false, message: "Manager not found" },
                { status: 404 }
            );
        }

        // Return updated manager
        return NextResponse.json(
            { success: true, message: "Manager updated successfully", manager },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating manager:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
