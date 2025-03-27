import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Agent from "@/models/agent";

export async function GET(req, { params }) {
    try {
        await dbConnect(); // Connect to MongoDB

        const { agentId } =await params; // Extract agentId from URL params

        // Validate agentId
        if (!agentId) {
            return NextResponse.json({
                success: false,
                error: "Agent ID is required",
            }, { status: 400 });
        }

        // Fetch agent by ID
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return NextResponse.json({
                success: false,
                error: "Agent not found",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: agent,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching agent:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error",
        }, { status: 500 });
    }
}
