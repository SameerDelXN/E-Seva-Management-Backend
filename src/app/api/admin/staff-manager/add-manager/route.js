import StaffManager from "@/models/staffManager";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { name, username,date , password,contactNo,city } = await req.json();
console.log(date)
        // Check if the username already exists
        const existingUser = await StaffManager.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Username already exists" },
                { status: 400 }
            );
        }
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new Staff Manager
        const newStaffManager = new StaffManager({
            name,
            username,
            contactNo,
            date:formatDate(new Date()),
            city,
            password,
        });
        console.log(newStaffManager);

        await newStaffManager.save();

        const response = NextResponse.json(
            { success: true, message: "Registered Successfully", data: newStaffManager },
            { status: 200 }
        );

        // Add CORS headers
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error) {
        // console.log("Internal Server Error", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
}
