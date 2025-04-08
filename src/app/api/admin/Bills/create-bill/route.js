// // app/api/create-bill/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Invoice from '@/models/invoice';

// function generateInvoiceNumber() {
//   const random = Math.floor(1000 + Math.random() * 9000);
//   return `INV-${random}`;
// }

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const body = await req.json();
//     const { customerName, customerNumber, description, items } = body;

//     if (!customerName || !customerNumber || !items || items.length === 0) {
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }

//     // Totals calculation
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

//     const invoice = new Invoice({
//       invoiceNumber: generateInvoiceNumber(),
//       customerName,
//       customerNumber,
//       description,
//       items,
//       subtotal,
//       totalCommission,
//       totalTax,
//       grandTotal,
//       status: 'Finalized',
//       currency: 'INR'
//     });

//     const saved = await invoice.save();

//     return NextResponse.json({
//       message: 'Invoice created successfully',
//       invoice: saved
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error saving invoice:', error);
//     return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
//   }
// }


// app/api/create-bill/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Invoice from '@/models/invoice';

// Helper: Generate invoice number
function generateInvoiceNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${random}`;
}

// Helper: Set CORS headers
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle CORS preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Handle invoice creation
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { customerName, customerNumber, description, items } = body;

    if (!customerName || !customerNumber || !items || items.length === 0) {
      return setCorsHeaders(NextResponse.json({ message: 'Missing required fields' }, { status: 400 }));
    }

    // Totals calculation
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

    const invoice = new Invoice({
      invoiceNumber: generateInvoiceNumber(),
      customerName,
      customerNumber,
      description,
      items,
      subtotal,
      totalCommission,
      totalTax,
      grandTotal,
      status: 'Finalized',
      currency: 'INR'
    });

    const saved = await invoice.save();

    return setCorsHeaders(NextResponse.json({
      message: 'Invoice created successfully',
      invoice: saved
    }, { status: 201 }));

  } catch (error) {
    console.error('Error saving invoice:', error);
    return setCorsHeaders(NextResponse.json({ message: 'Server Error', error }, { status: 500 }));
  }
}
