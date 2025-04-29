import FieldBoy from "@/models/fieldboy";

import connectDB from "@/utils/db";
import { NextResponse } from "next/server";


export async function GET(req){

    try{
        await connectDB();

        const Fieldboys= await FieldBoy.find();

        return NextResponse.json({message:"All data ",data:Fieldboys,status:200});
    }
    catch(error){
        console.log("Internal server error",error);
        return NextResponse.json({error:"Internal server error",status:500})

    }

}