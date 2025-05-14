// app/api/agent/wallet/[agentId]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Agent from "@/models/agent"; // Assuming your agent model is in this path
import connectDB from "@/utils/db";

// CORS headers configuration (same as before)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400", // Cache preflight request for 24 hours
      },
    }
  );
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { agentID } = params;

    if (!agentID) {
      return NextResponse.json(
        { success: false, message: "Agent ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Find the agent by ID and select only the wallet field
    const agent = await Agent.findById(agentID).select("wallet");

    if (!agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        wallet: agent.wallet,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching agent wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wallet amount",
        error: error.message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}