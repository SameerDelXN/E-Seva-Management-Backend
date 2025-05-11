// app/api/applications/filter/route.js
import connectDB from "@/utils/db";
import Application from "@/models/application";
import { NextResponse } from "next/server";

// Reusable CORS middleware (same as in your read route)
const withCors = (handler) => async (request) => {
  const response = await handler(request);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export const GET = withCors(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const applications = await Application.find({ location: location });
    
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error filtering applications by location:", error);
    return NextResponse.json(
      { error: "Failed to filter applications", details: error.message },
      { status: 500 }
    );
  }
});

// CORS preflight handler
export const OPTIONS = withCors(async () => {
  return new NextResponse(null, { status: 204 });
});