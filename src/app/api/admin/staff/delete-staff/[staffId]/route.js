import { NextResponse } from "next/server";
import Staff from "@/models/staff";
import connectDB from "@/utils/db";
import mongoose from "mongoose";

export async function DELETE(req,{params}) {

    try
    {
        await connectDB();
        const {staffId}=await params;

          if (!mongoose.Types.ObjectId.isValid(staffId)) {
                    return NextResponse.json({ success: false, error: "Invalid Staff ID" }, { status: 400 });
                }

        const staff=await Staff.findById(staffId);
        if(!staff){
            return NextResponse.json({message:"Staff not found",status:400});
        }

        await Staff.findOneAndDelete(staffId)
        return NextResponse.json({message:"Delete Successfully",status:200});
        

    }
    catch(error){
        console.log("Internal server error",error);
        return NextResponse.json({
            error:"Internal server error",
            status:500
        });

    }
    
}