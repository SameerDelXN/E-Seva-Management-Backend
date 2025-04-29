// app/api/new-service/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import NewService from "@/models/newServices";

export async function POST(req) {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  try {
    await connectDB();
    const body = await req.json();

    const newService = new NewService(body);
    const saved = await newService.save();

    return NextResponse.json({ success: true, data: saved }, { status: 201, headers });
  } catch (error) {
    console.error("Error creating new service:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create service", error: error.message },
      { status: 500, headers }
    );
  }
}

