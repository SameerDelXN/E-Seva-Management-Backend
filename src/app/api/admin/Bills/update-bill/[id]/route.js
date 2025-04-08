// // app/api/update-bill/[id]/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Invoice from '@/models/invoice';

// // PUT /api/update-bill/:id
// export async function PUT(req, { params }) {
//   const { id } = params;

//   try {
//     await dbConnect();

//     const body = await req.json();
//     const {
//       customerName,
//       customerNumber,
//       description,
//       items,
//       status,
//     } = body;

//     if (!customerName || !customerNumber || !items || items.length === 0) {
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }

//     // Totals recalculation
//     let subtotal = 0;
//     let totalCommission = 0;
//     let totalTax = 0;

//     items.forEach(item => {
//       const itemTotal = item.basePrice * item.qty;
//       const commission = item.commission * item.qty;
//       const tax = (item.tax / 100) * itemTotal;

//       subtotal += itemTotal;
//       totalCommission += commission;
//       totalTax += tax;
//     });

//     const grandTotal = subtotal + totalCommission + totalTax;

//     const updatedInvoice = await Invoice.findByIdAndUpdate(
//       id,
//       {
//         customerName,
//         customerNumber,
//         description,
//         items,
//         subtotal,
//         totalCommission,
//         totalTax,
//         grandTotal,
//         status: status || 'Finalized',
//       },
//       { new: true } // return the updated doc
//     );

//     if (!updatedInvoice) {
//       return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: 'Invoice updated successfully',
//       invoice: updatedInvoice,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating invoice:', error);
//     return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
//   }
// }


// app/api/update-bill/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Invoice from '@/models/invoice';

// Helper: Set CORS headers
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle CORS preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// PUT /api/update-bill/:id
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const body = await req.json();
    const {
      customerName,
      customerNumber,
      description,
      items,
      status,
    } = body;

    if (!customerName || !customerNumber || !items || items.length === 0) {
      return setCorsHeaders(NextResponse.json({ message: 'Missing required fields' }, { status: 400 }));
    }

    // Totals recalculation
    let subtotal = 0;
    let totalCommission = 0;
    let totalTax = 0;

    items.forEach(item => {
      const itemTotal = item.basePrice * item.qty;
      const commission = item.commission * item.qty;
      const tax = (item.tax / 100) * itemTotal;

      subtotal += itemTotal;
      totalCommission += commission;
      totalTax += tax;
    });

    const grandTotal = subtotal + totalCommission + totalTax;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        customerName,
        customerNumber,
        description,
        items,
        subtotal,
        totalCommission,
        totalTax,
        grandTotal,
        status: status || 'Finalized',
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return setCorsHeaders(NextResponse.json({ message: 'Invoice not found' }, { status: 404 }));
    }

    return setCorsHeaders(NextResponse.json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    }, { status: 200 }));

  } catch (error) {
    console.error('Error updating invoice:', error);
    return setCorsHeaders(NextResponse.json({ message: 'Server Error', error }, { status: 500 }));
  }
}
