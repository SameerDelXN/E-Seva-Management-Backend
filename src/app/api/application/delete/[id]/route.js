// app/api/applications/[id]/route.js
import connectDB from "@/utils/db";
import Application from "@/models/application";
import { NextResponse } from "next/server";

const addCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
};

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedApplication = await Application.findByIdAndDelete(id);
    if (!deletedApplication) {
      const response = NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
    return addCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}