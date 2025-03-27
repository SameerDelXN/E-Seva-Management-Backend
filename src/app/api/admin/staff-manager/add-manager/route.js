import StaffManager from "@/models/staffManager";
import connectDB from "@/utils/db";
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";
import { use } from "react";


export async function POST(req) {
    try{

        await connectDB();
        

    const {
        name,
        username,
        password
    }= await req.json();

    const hashedPassword = await bcrypt.hash(password,10);

    const newStaffManager = new StaffManager(
       { name,username,password:hashedPassword}
    )
await newStaffManager.save();
return NextResponse.json({message:"Registered Succcesfully", data:newStaffManager,stauts:200})
    }
    catch(error){
        console.log("Internal Server Error",error);
        return NextResponse.json({error:"Internal Server Error",status:500});

    }
    
}