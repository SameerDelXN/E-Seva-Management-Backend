import Plan from "@/models/Plans";
import NewService from "@/models/newServicesSchema";
import Location from "@/models/location";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const setCorsHeaders = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
};

export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function POST(req) {
  try {
    await connectDB();
    
    // Validate request body
    const { name, price, duration, durationUnit, services } = await req.json();
    
    if (!name || price === undefined || !duration || !durationUnit) {
      const response = NextResponse.json(
        { error: "Missing required fields (name, price, duration, durationUnit)" },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Case-insensitive check for existing plan
    const existingPlan = await Plan.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingPlan) {
      const response = NextResponse.json(
        { 
          error: "Plan with this name already exists",
          existingPlanId: existingPlan._id,
          suggestion: "Use a different name or update the existing plan"
        },
        { status: 409 }
      );
      return setCorsHeaders(response);
    }
    
    // Create new plan document
    const newPlan = new Plan({
      name,
      price,
      duration,
      durationUnit,
      services: services || []
    });
    
    await newPlan.save();
    
    // Get all locations and services in parallel for better performance
    const [locations, allServices] = await Promise.all([
      Location.find({}).select('state district'),
      NewService.find({})
    ]);

    // Prepare the new plan entry format
    const newPlanEntry = {
      plan: newPlan._id,
      planName: newPlan.name,
      price: 0, // Default price
      _id: new mongoose.Types.ObjectId() // Generate new ID for the plan entry
    };

    // Update all services with the new plan for all locations
    const bulkUpdateOps = allServices.map(service => {
      // Create a map of existing locations for quick lookup
      const locationMap = new Map();
      service.planPrices.forEach(locPrice => {
        const key = `${locPrice.state}|${locPrice.district}`;
        locationMap.set(key, locPrice);
      });

      // Process all locations
      const updatedPlanPrices = locations.map(location => {
        const key = `${location.state}|${location.district}`;
        
        if (locationMap.has(key)) {
          // Location exists - check if plan exists
          const locEntry = locationMap.get(key);
          const planExists = locEntry.plans.some(
            p => p.plan.toString() === newPlan._id.toString()
          );
          
          if (!planExists) {
            // Add new plan to existing location
            locEntry.plans.push({ ...newPlanEntry });
          }
          return locEntry;
        } else {
          // New location - create full entry
          return {
            state: location.state,
            district: location.district,
            plans: [{ ...newPlanEntry }],
            _id: new mongoose.Types.ObjectId()
          };
        }
      });

      return {
        updateOne: {
          filter: { _id: service._id },
          update: { 
            $set: { 
              planPrices: updatedPlanPrices,
              // Maintain other fields if needed
              __v: service.__v + 1 
            } 
          }
        }
      };
    });

    // Execute bulk update if there are services to update
    if (bulkUpdateOps.length > 0) {
      await NewService.bulkWrite(bulkUpdateOps);
    }

    const response = NextResponse.json(
      { 
        success: true,
        message: "Plan created and added to all services successfully",
        plan: newPlan,
        servicesUpdated: allServices.length,
        locations: locations.length
      },
      { status: 201 }
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    console.error("Error in add-plan API:", error);
    const response = NextResponse.json(
      { 
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}