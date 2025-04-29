import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Agent from "@/models/agent";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
    try {
        await dbConnect(); // Connect to MongoDB

        const { agentId } = params; // Fetch agentId from dynamic route params

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(agentId)) {
            return NextResponse.json({ success: false, error: "Invalid Agent ID" }, { status: 400 });
        }

        // Check if agent exists
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
        }

        // Delete the agent
        await Agent.findByIdAndDelete(agentId);

        // Enable CORS headers
        const response = NextResponse.json(
            { success: true, message: "Agent deleted successfully" },
            { status: 200 }
        );

        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return response;
    } catch (error) {
        console.error("Error deleting agent:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
