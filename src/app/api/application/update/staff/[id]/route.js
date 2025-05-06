// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import Application from "@/models/application";

// // CORS middleware wrapper
// const withCors = (handler) => async (request, context) => {
//   const response = await handler(request, context);
//   response.headers.set("Access-Control-Allow-Origin", "*");
//   response.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
//   response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   return response;
// };

// // UPDATE by ID
// export const PUT = withCors(async (request, { params }) => {
//   try {
//     await connectDB();
    
//     const { id } = params;
//     const updateData = await request.json();
//     console.log(updateData);
//     if (!id) {
//       return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
//     }
    
//     // Handle $push operator for status history if present
//     let finalUpdateData = { ...updateData };
//     let updateOperation = {};
    
//     if (updateData.$push) {
//       // Extract the push operation and prepare a proper MongoDB update operation
//       updateOperation = { 
//         ...finalUpdateData,
//         $push: updateData.$push 
//       };
      
//       // Remove $push from the regular update data
//       delete finalUpdateData.$push;
//     } else {
//       updateOperation = finalUpdateData;
//     }
    
//     const updated = await Application.findByIdAndUpdate(id, updateOperation, {
//       new: true,
//       runValidators: true,
//     });
    
//     if (!updated) {
//       return NextResponse.json({ error: "Application not found" }, { status: 404 });
//     }
    
//     // Return just the updated document without the message wrapper
//     // This matches what the frontend is expecting
//     return NextResponse.json(updated, { status: 200 });
//   } catch (error) {
//     console.error("Error updating application:", error);
//     return NextResponse.json(
//       { error: "Failed to update application", details: error.message },
//       { status: 500 }
//     );
//   }
// }); 

// // Optional: FETCH by ID (for completeness)
// export const GET = withCors(async (request, { params }) => {
//   try {
//     await connectDB();
//     const { id } = params;

//     const app = await Application.findById(id);
//     if (!app) {
//       return NextResponse.json({ error: "Application not found" }, { status: 404 });
//     }

//     return NextResponse.json({ data: app }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal error", details: error.message },
//       { status: 500 }
//     );
//   }
// });

// // CORS preflight
// export const OPTIONS = withCors(async () => {
//   return new NextResponse(null, { status: 204 });
// });


import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
 import Application from "@/models/application";
// PUT: update initialStatus
export async function PUT(req, { params }) {
  await connectDB();

  const { id } = params;
  const body = await req.json();
  const { staff } = body;
  console.log(staff);

  // if (!initialStatus || !Array.isArray(initialStatus)) {
  //   return new NextResponse(
  //     JSON.stringify({ error: 'initialStatus must be an array' }),
  //     {
  //       status: 400,
  //       headers: corsHeaders(),
  //     }
  //   );
  // }

  try {
    const updated = await Application.findByIdAndUpdate(
      id,
      { staff },
      { new: true }
    );

    if (!updated) {
      return new NextResponse(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders(),
      });
    }

    return new NextResponse(JSON.stringify({ message: 'Updated', data: updated }), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// Reusable CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}