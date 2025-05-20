import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';
import NewService from '@/models/newServicesSchema';
import ServiceGroup from '@/models/ServiceGroup';
import Plan from '@/models/Plans';
import mongoose from 'mongoose';

export const POST = async (req) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { subdistrict, district } = body;

    if (!subdistrict || !district) {
      return new NextResponse(
        JSON.stringify({ message: 'Sub District and district are required' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 1. Add location to Location model
    const newLocation = new Location({ subdistrict, district });
    await newLocation.save();

    // 2. Fetch all plans
    const allPlans = await Plan.find({});

    // 3. Update all services in NewService collection
    const allServices = await NewService.find({});
    const serviceBulkOps = allServices.map((service) => {
      const locationExists = service.planPrices.some(
        (loc) => loc.district === district && loc.subdistrict === subdistrict
      );

      if (!locationExists) {
        // Create plan entries with the service's original price
        const planEntries = allPlans.map((plan) => ({
          plan: plan._id,
          planName: plan.name,
          price: service.price || 0, // Use service's price or default to 0
          _id: new mongoose.Types.ObjectId(),
        }));

        const newLocationEntry = {
          district,
          subdistrict,
          plans: planEntries,
          _id: new mongoose.Types.ObjectId(),
        };

        return {
          updateOne: {
            filter: { _id: service._id },
            update: {
              $push: { planPrices: newLocationEntry },
              $inc: { __v: 1 },
            },
          },
        };
      }
      return null;
    }).filter(Boolean);

    // 4. Update all service groups and their embedded services
    const allServiceGroups = await ServiceGroup.find({});
    const groupBulkOps = [];

    for (const group of allServiceGroups) {
      for (const service of group.services) {
        const locationExists = service.planPrices.some(
          (loc) => loc.district === district && loc.subdistrict === subdistrict
        );

        if (!locationExists) {
          // Create plan entries with the service's original price
          const planEntries = allPlans.map((plan) => ({
            plan: plan._id,
            planName: plan.name,
            price: service.price || 0, // Use service's price or default to 0
            _id: new mongoose.Types.ObjectId(),
          }));

          const newLocationEntry = {
            district,
            subdistrict,
            plans: planEntries,
            _id: new mongoose.Types.ObjectId(),
          };

          groupBulkOps.push({
            updateOne: {
              filter: { 
                _id: group._id,
                "services._id": service._id 
              },
              update: {
                $push: { "services.$.planPrices": newLocationEntry },
                $inc: { __v: 1 },
              },
            },
          });
        }
      }
    }

    // Execute all bulk operations
    if (serviceBulkOps.length > 0) {
      await NewService.bulkWrite(serviceBulkOps);
    }

    if (groupBulkOps.length > 0) {
      await ServiceGroup.bulkWrite(groupBulkOps);
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Location added and applied to all services and service groups with all plans',
        location: newLocation,
        servicesUpdated: serviceBulkOps.length,
        serviceGroupsUpdated: groupBulkOps.length,
      }),
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error adding location:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Preflight
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}