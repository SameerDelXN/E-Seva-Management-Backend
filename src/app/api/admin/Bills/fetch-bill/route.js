// // app/api/get-bill/[id]/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Invoice from '@/models/invoice';

// // GET /api/get-bill/:id
// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     await dbConnect();

//     const invoice = await Invoice.findById(id);

//     if (!invoice) {
//       return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: 'Invoice fetched successfully',
//       invoice,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching invoice:', error);
//     return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
//   }
// }


// app/api/get-bill/[id]/route.js

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

// GET /api/get-bill/:id
export async function GET() {


  try {
    await dbConnect();

    const invoice = await Invoice.find({});

    if (!invoice) {
      return setCorsHeaders(NextResponse.json({ message: 'Invoice not found' }, { status: 404 }));
    }

    return setCorsHeaders(NextResponse.json({
      message: 'Invoice fetched successfully',
      invoice,
    }, { status: 200 }));

  } catch (error) {
    console.error('Error fetching invoice:', error);
    return setCorsHeaders(NextResponse.json({ message: 'Server Error', error }, { status: 500 }));
  }
}
