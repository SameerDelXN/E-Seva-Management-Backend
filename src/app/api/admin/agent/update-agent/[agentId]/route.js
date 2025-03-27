import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Agent from "@/models/agent";

export async function PUT(req, { params }) {
    try {
        await dbConnect(); // Connect to MongoDB

        const { agentId } = await params; // Extract agentId from URL params
        const body = await req.json(); // Parse request body

        // Validate agentId
        if (!agentId) {
            return NextResponse.json({
                success: false,
                error: "Agent ID is required",
            }, { status: 400 });
        }

        // Find and update the agent
        const updatedAgent = await Agent.findByIdAndUpdate(agentId, body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules apply
        });

        if (!updatedAgent) {
            return NextResponse.json({
                success: false,
                error: "Agent not found",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Agent updated successfully",
            data: updatedAgent,
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating agent:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error",
        }, { status: 500 });
    }
}
