import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Agent from "@/models/agent";

export async function GET() {
    try {
        await dbConnect(); // Connect to MongoDB

        // Fetch all agents
        const agents = await Agent.find({});

        return NextResponse.json({
            success: true,
            data: agents,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching agents:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error",
        }, { status: 500 });
    }
}
