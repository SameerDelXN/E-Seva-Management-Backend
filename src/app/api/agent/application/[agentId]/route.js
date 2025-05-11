// app/api/agent/application/[agentId]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Application from "@/models/application";
import connectDB from "@/utils/db";

// CORS headers configuration
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
    const { agentId } = params;
    console.log(agentId)
    if (!agentId) {
      return NextResponse.json(
        { success: false, message: "Agent ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Find all applications where provider matches agentId
   const applications = await Application.find({ 
  "provider.id": agentId 
});

    return NextResponse.json(
      {
        success: true,
        data: applications,
        count: applications.length,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching agent applications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch applications",
        error: error.message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}