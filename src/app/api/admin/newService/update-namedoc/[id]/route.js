import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import NewService from '@/models/newServicesSchema';

// PATCH /api/admin/newService/update-basic/[id]
export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const { name, documents } = await req.json();

   console.log(documents);

    const updatedService = await NewService.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          document: documents, // replaces entire array
        }
      },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { message: 'Service not found.' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { message: 'Service updated successfully.', service: updatedService },
      { status: 200 }
    );

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// ✅ FIXED: CORS Preflight Handler
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
