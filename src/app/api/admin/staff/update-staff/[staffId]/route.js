import { NextResponse } from "next/server";
import Staff from "@/models/staff";
import connectDB from "@/utils/db";

export async function PUT(req, { params }) {

    try {
        await connectDB();
        const { staffId } = await params;
        const body = await req.json();

        const staff = await Staff.findById(staffId);
        if(!staff){
            return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });


        }

        const newStaff = await Staff.findByIdAndUpdate(staffId,body, {
            new: true, 
            runValidators: true,
        })

        return NextResponse.json({ success: true, message: "Updated Successfully", data: newStaff }, { status: 200 });







    } catch (error) {

        console.log("Internal Server Error", error);
        return NextResponse.json({ error: "Internal Server Error", status: 500 });

    }

}