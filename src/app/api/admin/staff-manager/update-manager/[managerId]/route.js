// import connectDB from "@/utils/db";
// import StaffManager from "@/models/staffManager";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",  // Allow all domains (or specify frontend domain)
//     "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function PATCH(req, { params }) {
//     try {
//         await connectDB();

//         // Extract managerId
//         const { managerId } = params;

//         // Parse request body
//         const updatedData = await req.json();

//         // If password is being updated, hash it
//         if (updatedData.password) {
//             updatedData.password = await bcrypt.hash(updatedData.password, 10);
//         }

//         // Find and update the manager
//         const manager = await StaffManager.findByIdAndUpdate(
//             managerId,
//             updatedData,
//             { new: true, runValidators: true }
//         );

//         // If manager not found
//         if (!manager) {
//             return NextResponse.json(
//                 { success: false, message: "Manager not found" },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         // Return updated manager with CORS headers
//         return NextResponse.json(
//             { success: true, message: "Manager updated successfully", manager },
//             { status: 200, headers: corsHeaders }
//         );
//     } catch (error) {
//         console.error("Error updating manager:", error);
//         return NextResponse.json(
//             { success: false, error: "Internal Server Error" },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }

// // ✅ Handle OPTIONS Preflight Request
// export async function OPTIONS() {
//     return NextResponse.json({}, { status: 200, headers: corsHeaders });
// }


import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const { managerId } = params;
        const { name, contactNo, city, date, username, password } = await req.json();

        const updatedFields = { name, contactNo, city, date, username };

        // Hash new password if provided
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        const updatedManager = await StaffManager.findByIdAndUpdate(
            managerId,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedManager) {
            return NextResponse.json(
                { success: false, message: "Manager not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: "Manager updated successfully", data: updatedManager },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Error updating manager:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
