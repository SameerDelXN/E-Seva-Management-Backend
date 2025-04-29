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

// GET method to fetch all plans
export async function GET() {
  try {
    await connectDB();

    const plans = await Plan.find();

    return new NextResponse(
      JSON.stringify({ message: "Plans fetched successfully", plans }),
      {
        status: 200,
        headers: setCorsHeaders(),
      }
    );
  } catch (error) {
    console.error("Error fetching plans:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: setCorsHeaders(),
      }
    );
  }
}
