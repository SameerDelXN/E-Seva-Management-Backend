import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params; // Extract ID from URL
        const { name, image, services } = await req.json();

        // Validate ID
        if (!id) {
            return NextResponse.json({ success: false, error: "Service Group ID is required" }, { status: 400 });
        }

        // Find and update the service group
        const updatedServiceGroup = await ServiceGroup.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(image && { image }),
                ...(services && { services })
            },
            { new: true } // Return the updated document
        );

        if (!updatedServiceGroup) {
            return NextResponse.json({ success: false, error: "Service Group not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Service Group updated successfully", serviceGroup: updatedServiceGroup });
    } catch (error) {
        console.error("Error updating service group:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
