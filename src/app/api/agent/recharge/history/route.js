import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import rechargeHistory from "@/models/rechargeHistory";

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

    
    const history = await rechargeHistory.find({})

    return NextResponse.json(
      {
        message: "Applications retrieved successfully",
        data: history,
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
