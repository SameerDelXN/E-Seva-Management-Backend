// // app/api/delete-bill/[id]/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Invoice from '@/models/invoice';

// // DELETE /api/delete-bill/:id
// export async function DELETE(req, { params }) {
//   const { id } = params;

//   try {
//     await dbConnect();

//     const deletedInvoice = await Invoice.findByIdAndDelete(id);

//     if (!deletedInvoice) {
//       return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: 'Invoice deleted successfully',
//       invoice: deletedInvoice,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error deleting invoice:', error);
//     return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
//   }
// }


// app/api/delete-bill/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Invoice from '@/models/invoice';

// Helper: Set CORS headers
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle CORS preflight for DELETE
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// DELETE /api/delete-bill/:id
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return setCorsHeaders(NextResponse.json({ message: 'Invoice not found' }, { status: 404 }));
    }

    return setCorsHeaders(NextResponse.json({
      message: 'Invoice deleted successfully',
      invoice: deletedInvoice,
    }, { status: 200 }));

  } catch (error) {
    console.error('Error deleting invoice:', error);
    return setCorsHeaders(NextResponse.json({ message: 'Server Error', error }, { status: 500 }));
  }
}
