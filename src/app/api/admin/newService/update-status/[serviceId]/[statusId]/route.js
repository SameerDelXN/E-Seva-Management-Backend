import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';

// PATCH /api/admin/newService/update-status/[serviceId]/[statusId]
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { serviceId, statusId } = params;
    const body = await req.json();

    const { name, hexcode, askreason, priority } = body;

    const service = await NewService.findById(serviceId);
    if (!service) {
      return new NextResponse(JSON.stringify({ message: 'Service not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const statusIndex = service.status.findIndex(
      (s) => s._id.toString() === statusId
    );

    if (statusIndex === -1) {
      return new NextResponse(JSON.stringify({ message: 'Status not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (name !== undefined) service.status[statusIndex].name = name;
    if (hexcode !== undefined) service.status[statusIndex].hexcode = hexcode;
    if (askreason !== undefined) service.status[statusIndex].askreason = askreason;
    if (priority !== undefined) service.status[statusIndex].priority = priority;

    await service.save();

    return new NextResponse(
      JSON.stringify({
        message: 'Status updated successfully',
        status: service.status[statusIndex],
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error updating service status:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// CORS headers config
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
