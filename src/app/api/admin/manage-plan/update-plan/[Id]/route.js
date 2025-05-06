import Plan from "@/models/Plans";
import NewService from "@/models/newServicesSchema";
import Location from "@/models/location";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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

    // Make sure to await params if needed
    const { Id } = params || {};
    const body = await req.json();

    // Get the original plan to check if name has changed
    const originalPlan = await Plan.findById(Id);
    if (!originalPlan) {
      return new NextResponse(
        JSON.stringify({ message: "Plan not found" }),
        {
          status: 404,
          headers: setCorsHeaders(),
        }
      );
    }

    // Update the plan itself
    const updatedPlan = await Plan.findByIdAndUpdate(Id, body, {
      new: true,
      runValidators: true,
    });

    // Check if name has changed
    const nameChanged = originalPlan.name !== updatedPlan.name;
    console.log(`Plan name changed: ${nameChanged}, from "${originalPlan.name}" to "${updatedPlan.name}"`);

    let servicesUpdated = 0;
    
    // Only update services if the name has changed
    if (nameChanged) {
      // Direct update to services using updateMany
      const serviceUpdateResult = await NewService.updateMany(
        { "planPrices.plans.plan": Id }, // Use the ID string directly
        { $set: { "planPrices.$[].plans.$[planElem].planName": updatedPlan.name } },
        { 
          arrayFilters: [{ "planElem.plan": Id }], // Use the ID string directly
          multi: true 
        }
      );
      
      servicesUpdated = serviceUpdateResult.modifiedCount;
      console.log(`Updated plan name in ${servicesUpdated} services`);

    
      return new NextResponse(
        JSON.stringify({ 
          message: "Plan updated successfully across all collections",
          updatedPlan,
          servicesUpdated
        }),
        {
          status: 200,
          headers: setCorsHeaders(),
        }
      );
    } else {
      // If name hasn't changed, just return success
      return new NextResponse(
        JSON.stringify({ 
          message: "Plan updated successfully. No name change detected, so no services were updated.",
          updatedPlan,
          servicesUpdated: 0,
          locationsUpdated: 0
        }),
        {
          status: 200,
          headers: setCorsHeaders(),
        }
      );
    }
  } catch (error) {
    console.error("Error updating plan:", error);
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