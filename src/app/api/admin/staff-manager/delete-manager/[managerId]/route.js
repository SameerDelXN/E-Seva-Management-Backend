import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        // Ensure params is defined and contains managerId
       

        // Extract managerId correctly without awaiting it
        const { managerId } = await params;

        const manager = await StaffManager.findById(managerId);
        if (!manager) {
            return NextResponse.json(
                { success: false, message: "Manager not found" },
                { status: 404 }
            );
        }

        await StaffManager.findByIdAndDelete(managerId);

        return NextResponse.json(
            { success: true, message: "Manager deleted successfully" },
            
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting manager:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
