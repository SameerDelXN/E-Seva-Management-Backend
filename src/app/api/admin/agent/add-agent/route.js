import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Agent from "../../../../../models/agent";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        
        const {
            fullName,
            email,
            address,
            phone,
            shopName,
            shopAddress,
            location,
            username,
            password,
            documents,
        } = await req.json();

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
        if (existingAgent) {
            return NextResponse.json({ error: "Agent already exists" }, { status: 400 });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new agent
        const newAgent = new Agent({
            fullName,
            email,
            address,
            phone,
            shopName,
            shopAddress,    
            location,
            username,
            password: hashedPassword,
            documents,
        });

        await newAgent.save();
        return NextResponse.json({ message: "Agent registered successfully", agent: newAgent });
    } catch (error) {
        console.error("Error adding agent:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import Agent from "@/models/agent";
// import bcrypt from "bcryptjs";
// import upload from "@/utils/multer";
// import cloudinary from "@/utils/cloudinary";

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parser for file uploads
//   },
// };

// export async function POST(req) {
//   return new Promise((resolve, reject) => {
//     upload.fields([
//       { name: "documents[aadharCard]", maxCount: 1 },
//       { name: "documents[shopLicense]", maxCount: 1 },
//       { name: "documents[ownerPhoto]", maxCount: 1 },
//       { name: "documents[supportingDocument]", maxCount: 1 },
//     ])(req, {}, async (err) => {
//       if (err) {
//         return reject(
//           NextResponse.json({ error: "File upload failed" }, { status: 400 })
//         );
//       }

//       try {
//         await connectDB();

//         const {
//           fullName,
//           email,
//           address,
//           phone,
//           shopName,
//           shopAddress,
//           location,
//           username,
//           password,
//         } = req.body;

//         // Check if agent already exists
//         const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
//         if (existingAgent) {
//           return resolve(
//             NextResponse.json({ error: "Agent already exists" }, { status: 400 })
//           );
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Save Cloudinary URLs
//         const documents = {
//           aadharCard: req.files["documents[aadharCard]"]
//             ? req.files["documents[aadharCard]"][0].path
//             : "",
//           shopLicense: req.files["documents[shopLicense]"]
//             ? req.files["documents[shopLicense]"][0].path
//             : "",
//           ownerPhoto: req.files["documents[ownerPhoto]"]
//             ? req.files["documents[ownerPhoto]"][0].path
//             : "",
//           supportingDocument: req.files["documents[supportingDocument]"]
//             ? req.files["documents[supportingDocument]"][0].path
//             : "",
//         };

//         // Create new agent
//         const newAgent = new Agent({
//           fullName,
//           email,
//           address,
//           phone,
//           shopName,
//           shopAddress,
//           location,
//           username,
//           password: hashedPassword,
//           documents,
//         });

//         await newAgent.save();
//         return resolve(
//           NextResponse.json({
//             message: "Agent registered successfully",
//             agent: newAgent,
//           })
//         );
//       } catch (error) {
//         console.error("Error adding agent:", error);
//         return resolve(
//           NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//         );
//       }
//     });
//   });
// }
