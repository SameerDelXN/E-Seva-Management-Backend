// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import ServiceGroup from "@/models/ServiceGroup";

// export async function DELETE(req, { params }) {
//     try {
//         await connectDB();
//         const { id } = params; // Extract ID from URL

//         // Validate ID
//         if (!id) {
//             return NextResponse.json({ success: false, error: "Service Group ID is required" }, { status: 400 });
//         }

//         // Find and delete the service group
//         const deletedServiceGroup = await ServiceGroup.findByIdAndDelete(id);

//         if (!deletedServiceGroup) {
//             return NextResponse.json({ success: false, error: "Service Group not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, message: "Service Group deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting service group:", error);
//         return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//     }
// }



import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params; // Extract ID from URL

        // Validate ID
        if (!id) {
            return NextResponse.json(
                { success: false, error: "Service Group ID is required" },
                { 
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }

        // Find and delete the service group
        const deletedServiceGroup = await ServiceGroup.findByIdAndDelete(id);

        if (!deletedServiceGroup) {
            return NextResponse.json(
                { success: false, error: "Service Group not found" },
                { 
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }

        return NextResponse.json(
            { success: true, message: "Service Group deleted successfully" },
            { 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
    } catch (error) {
        console.error("Error deleting service group:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
    }
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS() {
    return NextResponse.json(
        {},
        { 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    );
}