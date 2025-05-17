// app/api/applications/read/route.js
import connectDB from "@/utils/db";
import Application from "@/models/application";
import { NextResponse } from "next/server";

// Reusable CORS middleware
const withCors = (handler) => async (request) => {
  const response = await handler(request);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export const GET = withCors(async () => {
  try {
    await connectDB();
    const applications = await Application.find({});
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error.message },
      { status: 500 }
    );
  }
});

// CORS preflight handler
export const OPTIONS = withCors(async () => {
  return new NextResponse(null, { status: 204 });
});
