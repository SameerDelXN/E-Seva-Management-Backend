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


// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
//  import Application from "@/models/application";
// // PUT: update initialStatus
// export async function PUT(req, { params }) {
//   await connectDB();

//   const { id } = params;
//   const body = await req.json();
//   const { initialStatus ,staff} = body;
//   console.log(initialStatus);

//   // if (!initialStatus || !Array.isArray(initialStatus)) {
//   //   return new NextResponse(
//   //     JSON.stringify({ error: 'initialStatus must be an array' }),
//   //     {
//   //       status: 400,
//   //       headers: corsHeaders(),
//   //     }
//   //   );
//   // }

//   try {
//     const updated = await Application.findByIdAndUpdate(
//       id,
//       { initialStatus,staff },
//       { new: true }
//     );

//     if (!updated) {
//       return new NextResponse(JSON.stringify({ error: 'Not found' }), {
//         status: 404,
//         headers: corsHeaders(),
//       });
//     }

//     return new NextResponse(JSON.stringify({ message: 'Updated', data: updated }), {
//       status: 200,
//       headers: corsHeaders(),
//     });
//   } catch (err) {
//     return new NextResponse(JSON.stringify({ error: 'Server error' }), {
//       status: 500,
//       headers: corsHeaders(),
//     });
//   }
// }

// // Handle preflight requests
// export async function OPTIONS() {
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders(),
//   });
// }

// // Reusable CORS headers
// function corsHeaders() {
//   return {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   };
// }




// NOTIFICATION
// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import Application from "@/models/application";
// import Staff from "@/models/staff";
// import Notification from "@/models/Notification";

// // Handle OPTIONS requests (preflight)
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//       'Access-Control-Max-Age': '86400'
//     }
//   });
// }

// export async function PUT(req, { params }) {
//   await connectDB();

//   const { id } = params;
//   const body = await req.json();
//   const { initialStatus, staff, remark, remarkAuthorId, document, provider } = body;
//   try {
//     // First get the current application to compare changes
//     const currentApp = await Application.findById(id);
//     if (!currentApp) {
//       return new NextResponse(
//         JSON.stringify({ error: 'Application not found' }), 
//         {
//           status: 404,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }

//     const updatedApp = await Application.findByIdAndUpdate(
//       id,
//       { initialStatus, staff, document },
//       { new: true }
//     );

//     if (!updatedApp) {
//       return new NextResponse(
//         JSON.stringify({ error: 'Application not found' }), 
//         {
//           status: 404,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }

//     // Check if staff was changed
//     if (staff && currentApp.staff?.toString() !== staff?.toString()) {
//       const newStaff = await Staff.findById(staff);
//       const appName = updatedApp.name || "an application";
      
//       // Notification for the new staff member
//       if (newStaff) {
//         const staffNotification = new Notification({
//           title: "New Assignment",
//           message: `You have been assigned to handle ${appName}`,
//           recipientId: staff,
//           playSound: true
//         });
//         await staffNotification.save();
//       }

//       // Notification for admin (tracking staff changes)
//       const adminNotification = new Notification({
//         title: "Staff Assignment Changed",
//         message: `Staff for ${appName} has been changed to ${newStaff?.name || "new staff"}`,
//         recipientRole: 'admin',
//         playSound: true
//       });
//       await adminNotification.save();
//     }
   
//     if (initialStatus && currentApp.initialStatus[0]?.name !== initialStatus?.name) {
//       console.log(true)
//       const appName = updatedApp.name || "an application";
//       const statusName = initialStatus?.name || "updated status";
//       console.log(appName,statusName)
//       // Notification for admin
//       const adminStatusNotification = new Notification({
//         title: "Application Status Updated",
//         message: `Status for ${appName} has been changed to ${statusName}`,
//         recipientRole: 'admin',
//         playSound: true
//       });

//       // Notification for agent (provider)
//       const agentNotification = new Notification({
//         title: "Your Application Status Updated",
//         message: `Status for your application ${appName} has been changed to ${statusName}`,
//         recipientId: provider || currentApp.provider, // Use body.provider or fallback to current app provider
//         playSound: true
//       });

//       await Promise.all([
//         adminStatusNotification.save(),
//         agentNotification.save()
//       ]);
//     }

//     return new NextResponse(
//       JSON.stringify({ message: 'Updated', data: updatedApp }), 
//       {
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (err) {
//     console.error(err);
//     return new NextResponse(
//       JSON.stringify({ error: 'Server error', details: err.message }), 
//       {
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   }
// }


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


// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
//  import Application from "@/models/application";
// // PUT: update initialStatus
// export async function PUT(req, { params }) {
//   await connectDB();

//   const { id } = params;
//   const body = await req.json();
//   const { initialStatus ,staff} = body;
//   console.log(initialStatus);

//   // if (!initialStatus || !Array.isArray(initialStatus)) {
//   //   return new NextResponse(
//   //     JSON.stringify({ error: 'initialStatus must be an array' }),
//   //     {
//   //       status: 400,
//   //       headers: corsHeaders(),
//   //     }
//   //   );
//   // }

//   try {
//     const updated = await Application.findByIdAndUpdate(
//       id,
//       { initialStatus,staff },
//       { new: true }
//     );

//     if (!updated) {
//       return new NextResponse(JSON.stringify({ error: 'Not found' }), {
//         status: 404,
//         headers: corsHeaders(),
//       });
//     }

//     return new NextResponse(JSON.stringify({ message: 'Updated', data: updated }), {
//       status: 200,
//       headers: corsHeaders(),
//     });
//   } catch (err) {
//     return new NextResponse(JSON.stringify({ error: 'Server error' }), {
//       status: 500,
//       headers: corsHeaders(),
//     });
//   }
// }

// // Handle preflight requests
// export async function OPTIONS() {
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders(),
//   });
// }

// // Reusable CORS headers
// function corsHeaders() {
//   return {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   };
// }
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Application from "@/models/application";
import Staff from "@/models/staff";
import Notification from "@/models/Notification";

// Handle OPTIONS requests (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = params;  
  console.log(id)
  const body = await req.json();
  console.log("body = ",body)
  const { initialStatus, staff, remark, remarkAuthorId,document,delivery,receipt } = body;
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { initialStatus, staff,document,delivery,receipt },
      { new: true }
    );
    console.log(updatedApp)
    if (!updatedApp) {
      return new NextResponse(
        JSON.stringify({ error: 'Application not found' }), 
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

     const adminNotification = new Notification({
          title: `${body.name}'s Application is Updated`,
          message: `${body.name}'s Application is Updated`,
          recipientRole: 'admin',
          playSound: true
        });
    
        // Notification for staff-manager
        const staffManagerNotification = new Notification({
          title: `${updatedApp?.name}'s Application is Updated`,
          message: `${updatedApp?.name}'s Application is Updated`,
          recipientRole: `staff-manager - ${updatedApp?.location}`,
          playSound: true
        });
         const AgentNotification = new Notification({
          title: `${updatedApp?.name}'s Application is Updated`,
          message: `${updatedApp?.name}'s Application is Updated`,
          recipientId:updatedApp?.provider ? updatedApp.provider[0].id : null,
          playSound: true
        });
    
        const staffNotification = new Notification({
           title: `${updatedApp?.name}'s Application is Assigned to you.`,
          message:`${updatedApp?.name}'s Application is Assigned to you by Staff Manager`,
          recipientId:updatedApp?.staff ? updatedApp?.staff[0].id : null,
          playSound: true
        })
    
        // Save notifications
        await Promise.all([
          adminNotification.save(),
          staffManagerNotification.save(),
          updatedApp?.staff ? staffNotification.save() : null,
          updatedApp?.provider ? AgentNotification.save() : null
        ]);
    

   
    return new NextResponse(
      JSON.stringify({ message: 'Updated', data: updatedApp }), 
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: 'Server error' }), 
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}