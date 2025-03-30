// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import Agent from "../../../../../models/agent";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//     try {
//         await connectDB();
        
//         const {
//             fullName,
//             email,
//             address,
//             phone,
//             shopName,
//             shopAddress,
//             location,
//             username,
//             password,
//             documents,
//         } = await req.json();

//         // Check if agent already exists
//         const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
//         if (existingAgent) {
//             return NextResponse.json({ error: "Agent already exists" }, { status: 400 });
//         }

//         // Hash the password before saving
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new agent
//         const newAgent = new Agent({
//             fullName,
//             email,
//             address,
//             phone,
//             shopName,
//             shopAddress,    
//             location,
//             username,
//             password: hashedPassword,
//             documents,
//         });

//         await newAgent.save();
//         return NextResponse.json({ message: "Agent registered successfully", agent: newAgent });
//     } catch (error) {
//         console.error("Error adding agent:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Agent from "../../../../../models/agent";
import bcrypt from "bcryptjs";

// Helper function to add CORS headers to responses
const addCorsHeaders = (response) => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

export async function POST(req) {
    try {
        await connectDB();
        
        // Validate request content type
        const contentType = req.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const response = NextResponse.json(
                { error: "Invalid content type. Expected application/json" },
                { status: 415 }
            );
            return addCorsHeaders(response);
        }

        const requestData = await req.json();

        // Validate required fields
        const requiredFields = ['fullName', 'email', 'phone', 'username', 'password'];
        const missingFields = requiredFields.filter(field => !requestData[field]);
        
        if (missingFields.length > 0) {
            const response = NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
            return addCorsHeaders(response);
        }

        const {
            fullName,
            email,
            address,
            phone,
            shopName,
            shopAddress,
            location,
            referralCode,
            username,
            password,
            documents,
        } = requestData;

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }, { username }] });
        if (existingAgent) {
            const response = NextResponse.json(
                { error: "Agent with this email, phone or username already exists" },
                { status: 400 }
            );
            return addCorsHeaders(response);
        }

        // Validate password strength
        if (password.length < 8) {
            const response = NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
            return addCorsHeaders(response);
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
            referralCode,
            username,
            password: hashedPassword,
            documents,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newAgent.save();
        
        // Remove password from response for security
        const agentResponse = newAgent.toObject();
        delete agentResponse.password;

        const successResponse = NextResponse.json(
            { 
                message: "Agent registered successfully", 
                agent: agentResponse 
            },
            { status: 201 }
        );
        return addCorsHeaders(successResponse);
    } catch (error) {
        console.error("Error adding agent:", error);
        const errorResponse = NextResponse.json(
            { 
                error: "Internal Server Error",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
        return addCorsHeaders(errorResponse);
    }
}

// Add OPTIONS method for CORS preflight
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response);
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
