import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Invoice from '@/models/invoice';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      invoiceNumber,
      date,
      customerName,
      customerNumber,
      description,
      items,
      totalCommission,
      totalTax,
      grandTotal,
      status,
      currency
    } = body;

    if (!invoiceNumber || !customerName || !customerNumber || !items || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Required fields are missing or items are empty'
      }, { status: 400 });
    }

    // Create new invoice
    const newInvoice = new Invoice({
      invoiceNumber,
      date,
      customerName,
      customerNumber,
      description,
      items,
      totalCommission,
      totalTax,
      grandTotal,
      status,
      currency
    });

    const savedInvoice = await newInvoice.save();

    const response = NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: savedInvoice
    }, { status: 201 });


    // src\app\api\admin\Bills\create-bill\route.js
    // CORS headers if needed
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

// For CORS preflight request
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
