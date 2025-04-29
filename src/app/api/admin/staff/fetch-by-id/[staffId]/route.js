import Staff from "@/models/staff";
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

export async function GET(req,{params}) {

    try{

        await connectDB();
        const {staffId}= await params;

        const staff= await Staff.findById(staffId);

        if(!staff){
            return NextResponse.json({ success: false,message:"Staff not found",status:400});
        }

         return NextResponse.json({
                    success: true,
                    data: staff,
                }, { status: 200 });
        

        

    }catch(error){
        console.log("Internal Server Error",error)
        return NextResponse.json({error:"Internal Server Error",status:500})
    }
    
}