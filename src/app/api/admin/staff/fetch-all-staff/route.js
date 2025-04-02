// import { NextResponse } from "next/server";
// import Staff from "@/models/staff";
// import connectDB from "@/utils/db";

// export async function GET(){
//     try{

//         await connectDB();

//         const staffs=await Staff.find({});

//         return NextResponse.json({message:"All data",data:staffs},{ status: 200 })
//     }
//     catch(error){

//         console.log("Internal server error",error);
//         return NextResponse.json({error:"Internal server error",status:500})

//     }

// } 

import { NextResponse } from "next/server";
import Staff from "@/models/staff";
import connectDB from "@/utils/db";

export async function GET() {
    try {
        await connectDB();

        const staffs = await Staff.find({});

        // Create a response with CORS headers
        const response = NextResponse.json(
            { message: "All data", data: staffs },
            { status: 200 }
        );

        // Add CORS headers
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return response;

    } catch (error) {
        console.log("Internal server error", error);

        const errorResponse = NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );

        // Add CORS headers to error response as well
        errorResponse.headers.set("Access-Control-Allow-Origin", "*");
        errorResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return errorResponse;
    }
}
