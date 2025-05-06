import Plan from "@/models/Plans";
import NewService from "@/models/newServicesSchema";
import Location from "@/models/location";
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
    
    const { Id } = params || {};
    
    // First verify the plan exists
    const planToDelete = await Plan.findById(Id);
    if (!planToDelete) {
      return new NextResponse(
        JSON.stringify({ message: "Plan not found" }),
        {
          status: 404,
          headers: setCorsHeaders(),
        }
      );
    }

    // 1. Remove the plan from all services
    console.log(`Removing plan ${Id} from services...`);
    const serviceUpdateResult = await NewService.updateMany(
      { "planPrices.plans.plan": Id },
      { $pull: { "planPrices.$[].plans": { plan: Id } } }
    );
    
    console.log(`Removed plan from ${serviceUpdateResult.modifiedCount} services`);

   
    // 3. Finally delete the plan itself
    const deletedPlan = await Plan.findByIdAndDelete(Id);

    return new NextResponse(
      JSON.stringify({ 
        message: "Plan deleted successfully", 
        planName: planToDelete.name,
        servicesUpdated: serviceUpdateResult.modifiedCount
      }),
      {
        status: 200,
        headers: setCorsHeaders(),
      }
    );
  } catch (error) {
    console.error("Error deleting plan:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: setCorsHeaders(),
      }
    );
  }
}