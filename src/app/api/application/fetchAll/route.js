import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Application from "@/models/application";

// CORS middleware wrapper
const withCors = (handler) => async (request) => {
  const response = await handler(request);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export const GET = withCors(async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const phoneFilter = searchParams.get("phone")
    // Optional filters
    const query = {};

    if (phoneFilter) query.phone = phoneFilter
    const applications = await Application.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Applications retrieved successfully",
        data: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
});

// CORS preflight
export const OPTIONS = withCors(async () => {
  return new NextResponse(null, { status: 204 });
});
