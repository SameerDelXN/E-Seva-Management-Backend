import FieldBoy from "@/models/fieldboy";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {

    try{

        await connectDB();

        const {
            name,
            phone,
            aadharNo,
            pancardNo,
            address,
            location
        }= await req.json();

        const newFieldBoy = new FieldBoy({
            name,
            phone,
            aadharNo,
            pancardNo,
            address,
            location
        })
        await newFieldBoy.save();
        return NextResponse.json({message:"Successfully Registered", data:newFieldBoy,status:200});

    }
    catch(error){
        console.log("Internal server error",error);
        return NextResponse.json({error:"Internal server error",status:500})

    }
    
}