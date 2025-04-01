import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Agent from "@/models/agent";

export async function PUT(req, { params }) {
    try {
        await dbConnect();

        const { agentId } = params;
        const body = await req.json();

        if (!agentId) {
            return NextResponse.json(
                { success: false, error: "Agent ID is required" },
                { status: 400 }
            );
        }

        const updatedAgent = await Agent.findByIdAndUpdate(agentId, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedAgent) {
            return NextResponse.json(
                { success: false, error: "Agent not found" },
                { status: 404 }
            );
        }

        const response = NextResponse.json(
            { success: true, message: "Agent updated successfully", data: updatedAgent },
            { status: 200 }
        );

        // Add CORS headers
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error) {
        console.error("Error updating agent:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// **Handle OPTIONS preflight requests**
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
}
