
import connectDB from '@/utils/db'
import { NextResponse } from "next/server";
import Staff from '@/models/staff'
import bcrypt from "bcryptjs";


export async function POST(req){

    try{
        await connectDB();
        const  {
            name,
            userName,
            phone,
            location,
            password,
            ServiceGroup
        }  = await req.json();

        const AlreadyStaff= await Staff.findOne({$or : [{email},{phone}]})

        if(AlreadyStaff){
            return NextResponse.json({error:"Already Registered Staff"},{status:400})
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newStaff = new Staff({
            name, 
            userName,
             phone,
             location,
             password:hashedPassword,
             ServiceGroup
        });

        await newStaff.save();

        return NextResponse.json({
            message:"success", Staff: newStaff
        })

    }
    catch(error){
        console.log("Internal Server Error",error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }

}