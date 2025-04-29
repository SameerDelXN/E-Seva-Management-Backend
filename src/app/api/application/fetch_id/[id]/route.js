import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Application from "@/models/application";

// CORS middleware
const withCors = (handler) => async (request, context) => {
  const response = await handler(request, context);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export const GET = withCors(async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Application fetched successfully", data: application },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching application by ID:", error);
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
