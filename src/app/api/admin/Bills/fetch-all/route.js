
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Invoice from '@/models/invoice';

// Helper: Set CORS headers
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle CORS preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// GET /api/get-bills
export async function GET() {
  try {
    await dbConnect();

    const invoices = await Invoice.find().sort({ createdAt: -1 }); // latest first

    return setCorsHeaders(NextResponse.json({
      message: 'Invoices fetched successfully',
      invoices,
    }, { status: 200 }));

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return setCorsHeaders(NextResponse.json({ message: 'Server Error', error }, { status: 500 }));
  }
}
  

