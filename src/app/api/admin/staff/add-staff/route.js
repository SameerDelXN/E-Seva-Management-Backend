
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



export async function POST(req) {
    try {
        await connectDB();

        const { name, username, contactNo, location, password, serviceGroups  } = await req.json();
        console.log("gr",password );
        // Ensure unique username and contact number
        const AlreadyStaff = await Staff.findOne({ $or: [{ username }, { contactNo }] });

        if (AlreadyStaff) {
            console.log(true)
            return NextResponse.json({ error: "Already Registered Staff" }, { status: 400 });
        }

        // Hash password for security
        // const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = new Staff({
            name,
            username,
            contactNo,
            location,
            password,  // Store hashed password
            serviceGroups 
        });

        await newStaff.save();

        const response = NextResponse.json(
            { message: "success", Staff: newStaff },
            {
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;

    } catch (error) {
        console.log("Internal Server Error", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    }
}
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
}
