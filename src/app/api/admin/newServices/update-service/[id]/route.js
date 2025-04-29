// app/api/new-service/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import NewService from "@/models/newServices";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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
    return NextResponse.json(
      { success: false, message: "Failed to fetch service", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const deleted = await NewService.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete service", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const body = await req.json();

    const updated = await NewService.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update service", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}


 