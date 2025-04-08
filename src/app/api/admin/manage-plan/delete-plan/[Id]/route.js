import Plan from "@/models/Plans";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";


function setCorsHeaders() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: setCorsHeaders(),
  });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { Id } = params;

    const deletedPlan = await Plan.findByIdAndDelete(Id);

    if (!deletedPlan) {
      return new NextResponse(
        JSON.stringify({ message: "Plan not found" }),
        {
          status: 404,
          headers: setCorsHeaders(),
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Plan deleted successfully" }),
      {
        status: 200,
        headers: setCorsHeaders(),
      }
    );
  } catch (error) {
    console.error("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: setCorsHeaders(),
      }
    );
  }
}
