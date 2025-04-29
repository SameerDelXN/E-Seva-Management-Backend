// import connectDB from "@/utils/db";
// import StaffManager from "@/models/staffManager";
// import { NextResponse } from "next/server";

// // CORS Headers
// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// // Handle CORS Preflight Request
// export async function OPTIONS() {
//     return NextResponse.json({}, { status: 200, headers: corsHeaders });
// }

// // DELETE API Route
// export async function DELETE(req, { params }) {
//     try {
//         await connectDB();

//         // ✅ Extract managerId properly
//         const { managerId } = await params;
        
//         if (!managerId) {
//             return NextResponse.json(
//                 { success: false, message: "Manager ID is required" },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         const manager = await StaffManager.findById(managerId);
//         if (!manager) {
//             return NextResponse.json(
//                 { success: false, message: "Manager not found" },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         await StaffManager.findByIdAndDelete(managerId);

//         return NextResponse.json(
//             { success: true, message: "Manager deleted successfully" },
//             { status: 200, headers: corsHeaders }
//         );
//     } catch (error) {
//         console.error("Error deleting manager:", error);
//         return NextResponse.json(
//             { success: false, error: "Internal Server Error" },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }



import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import { NextResponse } from "next/server";

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Corrected DELETE function for dynamic route
export async function DELETE(_, { params }) {
    try {
        await connectDB();

        const managerId = params.managerId;

        if (!managerId) {
            return NextResponse.json(
                { success: false, message: "Manager ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const manager = await StaffManager.findById(managerId);

        if (!manager) {
            return NextResponse.json(
                { success: false, message: "Manager not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        await StaffManager.findByIdAndDelete(managerId);

        return NextResponse.json(
            { success: true, message: "Manager deleted successfully" },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Error deleting manager:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
