// app/api/new-service/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import NewService from "@/models/newServices";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const service = await NewService.findById(id)
      .populate("planPrices.location")
      .populate("planPrices.plans.plan");

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, data: service }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch service", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
