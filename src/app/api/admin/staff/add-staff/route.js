
// import connectDB from '@/utils/db'
// import { NextResponse } from "next/server";
// import Staff from '@/models/staff'
// import bcrypt from "bcryptjs";


// export async function POST(req){

//     try{
//         await connectDB();
//         const  {
//             name,
//             username,
//             contactNo,
//             location,
//             password,
//             ServiceGroup
//         }  = await req.json();

//         const AlreadyStaff= await Staff.findOne({$or : [{email},{phone}]})

//         if(AlreadyStaff){
//             return NextResponse.json({error:"Already Registered Staff"},{status:400})
//         }
//         //  const hashedPassword = await bcrypt.hash(password, 10);


//         const newStaff = new Staff({
//             name, 
//             username,
//             contactNo,
//              location,
//              password,
//              ServiceGroup
//         });

//         await newStaff.save();

//         return NextResponse.json({
//             message:"success", Staff: newStaff
//         })

//     }
//     catch(error){
//         console.log("Internal Server Error",error);
//         return NextResponse.json({error:"Internal Server Error",status:500});
//     }

// }

import connectDB from '@/utils/db'
import { NextResponse } from "next/server";
import Staff from '@/models/staff'
import bcrypt from "bcryptjs";

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
}

export async function POST(req) {
    try {
        await connectDB();

        const { name, username, contactNo, location, password, serviceGroups  } = await req.json();
        console.log("gr",serviceGroups );
        // Ensure unique username and contact number
        const AlreadyStaff = await Staff.findOne({ $or: [{ username }, { contactNo }] });

        if (AlreadyStaff) {
            return NextResponse.json({ error: "Already Registered Staff" }, { status: 400 });
        }

        // Hash password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = new Staff({
            name,
            username,
            contactNo,
            location,
            password: hashedPassword,  // Store hashed password
            serviceGroups 
        });

        await newStaff.save();

        return NextResponse.json(
            { message: "success", Staff: newStaff },
            {
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );

    } catch (error) {
        console.log("Internal Server Error", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    }
}
