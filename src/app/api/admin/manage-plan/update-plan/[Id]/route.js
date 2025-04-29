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

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { Id } = params;
    const body = await req.json();

    const updatedPlan = await Plan.findByIdAndUpdate(Id, body, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!updatedPlan) {
      return new NextResponse(
        JSON.stringify({ message: "Plan not found" }),
        {
          status: 404,
          headers: setCorsHeaders(),
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Plan updated successfully", updatedPlan }),
      {
        status: 200,
        headers: setCorsHeaders(),
      }
    );
  } catch (error) {
    console.error("Error updating plan:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: setCorsHeaders(),
      }
    );
  }
}
