// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import ServiceGroup from "@/models/ServiceGroup";

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { name, image, services } = await req.json();

//         // Validate input
//         if (!name || !image || !Array.isArray(services)) {
//             return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
//         }

//         // Check if service group already exists
//         const existingGroup = await ServiceGroup.findOne({ name });
//         if (existingGroup) {
//             return NextResponse.json({ error: "Service group already exists" }, { status: 400 });
//         }

//         // Create a new service group
//         const newServiceGroup = new ServiceGroup({ name, image, services });
//         await newServiceGroup.save();

//         return NextResponse.json({ message: "Service group registered successfully", serviceGroup: newServiceGroup });
//     } catch (error) {
//         console.error("Error registering service group:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ServiceGroup from "@/models/ServiceGroup";

export async function POST(req) {
    try {
        await connectDB();
        const { name, image, services } = await req.json();

        // Validate input - only name and image are required
        if (!name || !image) {
            return NextResponse.json(
                { error: "Name and image are required fields" },
                { 
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }

        // Check if service group already exists
        const existingGroup = await ServiceGroup.findOne({ name });
        if (existingGroup) {
            return NextResponse.json(
                { error: "Service group already exists" },
                { 
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }

        // Create a new service group with services only if there are valid entries
        const serviceGroupData = { name, image };

        // if (services && Array.isArray(services)) {
        //     // Filter out empty or invalid service entries
        //     // const validServices = services.filter(service => 
        //     //     service.name && 
        //     //     service.name.trim() !== '' && 
        //     //     Array.isArray(service.documentNames) && 
        //     //     service.documentNames.some(doc => doc && doc.trim() !== '')
        //     // );

        //     const validServices = services.filter(service => 
        //         service.name && 
        //         service.name.trim() !== '' && 
        //         Array.isArray(service.documentNames) && 
        //         service.documentNames.some(doc => doc && doc.trim() !== '')
        //     );
            
        //     if (validServices.length > 0) {
        //         serviceGroupData.services = validServices;
        //     }
        // }

        const newServiceGroup = new ServiceGroup(serviceGroupData);
        await newServiceGroup.save();

        return NextResponse.json(
            { 
                message: "Service group registered successfully", 
                serviceGroup: newServiceGroup 
            },
            { 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
    } catch (error) {
        console.error("Error registering service group:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        { 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    );
}