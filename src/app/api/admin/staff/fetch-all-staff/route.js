import { NextResponse } from "next/server";
import Staff from "@/models/staff";
import connectDB from "@/utils/db";

export async function GET(){
    try{

        await connectDB();

        const staffs=await Staff.find({});

        return NextResponse.json({message:"All data",data:staffs},{ status: 200 })
    }
    catch(error){

        console.log("Internal server error",error);
        return NextResponse.json({error:"Internal server error",status:500})

    }

} 