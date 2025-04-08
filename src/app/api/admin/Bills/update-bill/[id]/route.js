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

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Invoice from '@/models/invoice';

// // Helper: Set CORS headers
// function setCorsHeaders(response) {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// }

// // Handle CORS preflight
// export function OPTIONS() {
//   const response = new NextResponse(null, { status: 204 });
//   return setCorsHeaders(response);
// }

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
//       return setCorsHeaders(NextResponse.json({ message: 'Missing required fields' }, { status: 400 }));
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
//       { new: true }
//     );

//     if (!updatedInvoice) {
//       return setCorsHeaders(NextResponse.json({ message: 'Invoice not found' }, { status: 404 }));
//     }

//     return setCorsHeaders(NextResponse.json({
//       message: 'Invoice updated successfully',
//       invoice: updatedInvoice,
//     }, { status: 200 }));

//   } catch (error) {
//     console.error('Error updating invoice:', error);
//     return setCorsHeaders(NextResponse.json({ message: 'Server Error', error }, { status: 500 }));
//   }
// }


// app/api/admin/Bills/update-bill/[id]/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Invoice from '@/models/invoice';

// // Helper: Set CORS headers
// function setCorsHeaders(response) {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// }

// // Handle CORS preflight
// export function OPTIONS() {
//   const response = new NextResponse(null, { status: 204 });
//   return setCorsHeaders(response);
// }

// // PUT /api/admin/Bills/update-bill/:id
// export async function PUT(req, { params }) {
//   const { id } = params;

//   try {
//     await dbConnect();

//     const body = await req.json();
//     const {
//       customerName,
//       customerNumber,
//       description,
//       date,
//       grandTotal,
//       totalCommission,
//       totalTax,
//       items
//     } = body;

//     // Get the existing invoice to maintain any fields not being updated
//     const existingInvoice = await Invoice.findById(id);
    
//     if (!existingInvoice) {
//       return setCorsHeaders(NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 }));
//     }

//     // Prepare and validate items
//     let processedItems = [];
//     let calculatedSubtotal = 0;
//     let calculatedCommission = 0;
//     let calculatedTax = 0;

//     // If items are provided, process them, otherwise keep existing items
//     if (items && Array.isArray(items)) {
//       items.forEach(item => {
//         const itemBasePrice = item.basePrice || 0;
//         const itemQuantity = item.quantity || 1;
//         const itemCommission = item.commission || 0;
//         // Handle tax as either percentage or fixed amount based on your schema
//         const itemTax = item.tax || 0;
        
//         const itemSubtotal = itemBasePrice * itemQuantity;
//         // Calculate tax based on your business logic (percentage or fixed)
//         const taxAmount = typeof itemTax === 'number' ? 
//           (itemTax < 1 ? itemSubtotal * itemTax : itemTax) : 0;
        
//         calculatedSubtotal += itemSubtotal;
//         calculatedCommission += itemCommission * itemQuantity;
//         calculatedTax += taxAmount;

//         processedItems.push({
//           name: item.name,
//           basePrice: itemBasePrice,
//           commission: itemCommission,
//           tax: itemTax,
//           quantity: itemQuantity,
//           subtotal: itemSubtotal,
//           total: itemSubtotal.toString() // As per your schema
//         });
//       });
//     } else {
//       processedItems = existingInvoice.items;
//       calculatedSubtotal = existingInvoice.subtotal || 0;
//       calculatedCommission = existingInvoice.totalCommission || 0;
//       calculatedTax = existingInvoice.totalTax || 0;
//     }

//     // Use provided totals or calculated ones
//     const finalGrandTotal = grandTotal !== undefined ? 
//       parseFloat(grandTotal) : (calculatedSubtotal + calculatedCommission + calculatedTax);
    
//     const finalCommission = totalCommission !== undefined ? 
//       parseFloat(totalCommission) : calculatedCommission;
    
//     const finalTax = totalTax !== undefined ? 
//       parseFloat(totalTax) : calculatedTax;

//     // Update the invoice
//     const updatedInvoice = await Invoice.findByIdAndUpdate(
//       id,
//       {
//         customerName: customerName || existingInvoice.customerName,
//         customerNumber: customerNumber || existingInvoice.customerNumber,
//         description: description || existingInvoice.description,
//         date: date ? new Date(date) : existingInvoice.date,
//         items: processedItems,
//         subtotal: calculatedSubtotal,
//         totalCommission: finalCommission,
//         totalTax: finalTax,
//         grandTotal: finalGrandTotal,
//         // Keep status as is or set to Finalized if not specified
//         status: body.status || existingInvoice.status || 'Finalized'
//       },
//       { new: true, runValidators: true }
//     );

//     return setCorsHeaders(NextResponse.json({ 
//       success: true, 
//       message: 'Invoice updated successfully', 
//       invoice: updatedInvoice 
//     }, { status: 200 }));

//   } catch (error) {
//     console.error("Error updating invoice:", error);
//     return setCorsHeaders(NextResponse.json({ 
//       success: false, 
//       message: 'Error updating invoice', 
//       error: error.message 
//     }, { status: 500 }));
//   }
// }

// app/api/admin/Bills/update-bill/[id]/route.js

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

// PUT /api/admin/Bills/update-bill/:id
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const body = await req.json();
    const {
      customerName,
      customerNumber,
      description,
      date,
      grandTotal,
      totalCommission,
      totalTax,
      items
    } = body;

    // Get the existing invoice to maintain any fields not being updated
    const existingInvoice = await Invoice.findById(id);
    
    if (!existingInvoice) {
      return setCorsHeaders(NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 }));
    }

    // Prepare and validate items
    let processedItems = [];
    let calculatedSubtotal = 0;
    let calculatedCommission = 0;
    let calculatedTax = 0;

    // If items are provided, process them, otherwise keep existing items
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const itemBasePrice = item.basePrice || 0;
        const itemQuantity = item.quantity || 1;
        const itemCommission = item.commission || 0;
        // Handle tax as either percentage or fixed amount based on your schema
        const itemTax = item.tax || 0;
        
        const itemSubtotal = itemBasePrice * itemQuantity;
        // Calculate tax based on your business logic (percentage or fixed)
        const taxAmount = typeof itemTax === 'number' ? 
          (itemTax < 1 ? itemSubtotal * itemTax : itemTax) : 0;
        
        calculatedSubtotal += itemSubtotal;
        calculatedCommission += itemCommission * itemQuantity;
        calculatedTax += taxAmount;

        processedItems.push({
          name: item.name,
          basePrice: itemBasePrice,
          commission: itemCommission,
          tax: itemTax,
          quantity: itemQuantity,
          subtotal: itemSubtotal,
          total: itemSubtotal.toString() // As per your schema
        });
      });
    } else {
      processedItems = existingInvoice.items;
      calculatedSubtotal = existingInvoice.subtotal || 0;
      calculatedCommission = existingInvoice.totalCommission || 0;
      calculatedTax = existingInvoice.totalTax || 0;
    }

    // Use provided totals or calculated ones
    const finalGrandTotal = grandTotal !== undefined ? 
      parseFloat(grandTotal) : (calculatedSubtotal + calculatedCommission + calculatedTax);
    
    const finalCommission = totalCommission !== undefined ? 
      parseFloat(totalCommission) : calculatedCommission;
    
    const finalTax = totalTax !== undefined ? 
      parseFloat(totalTax) : calculatedTax;

    // Update the invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        customerName: customerName || existingInvoice.customerName,
        customerNumber: customerNumber || existingInvoice.customerNumber,
        description: description || existingInvoice.description,
        date: date ? new Date(date) : existingInvoice.date,
        items: processedItems,
        subtotal: calculatedSubtotal,
        totalCommission: finalCommission,
        totalTax: finalTax,
        grandTotal: finalGrandTotal,
        // Keep status as is or set to Finalized if not specified
        status: body.status || existingInvoice.status || 'Finalized'
      },
      { new: true, runValidators: true }
    );

    return setCorsHeaders(NextResponse.json({ 
      success: true, 
      message: 'Invoice updated successfully', 
      invoice: updatedInvoice 
    }, { status: 200 }));

  } catch (error) {
    console.error("Error updating invoice:", error);
    return setCorsHeaders(NextResponse.json({ 
      success: false, 
      message: 'Error updating invoice', 
      error: error.message 
    }, { status: 500 }));
  }
}