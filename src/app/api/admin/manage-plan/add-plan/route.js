import Plan from "@/models/Plans";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

// ✅ Handle preflight request
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// ✅ Handle POST request
export async function POST(req) {
  try {
    await connectDB();
    const { name, price, duration, durationUnit, services } = await req.json();

    const checkPlan = await Plan.findOne({ name });
    if (checkPlan) {
      const response = NextResponse.json({ message: "Already have plan" }, { status: 409 });
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    const newPlan = new Plan({ name, price, duration, durationUnit, services });
    await newPlan.save();

    const response = NextResponse.json({ message: "Successfully added", plan: newPlan });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("Internal Server Error", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
