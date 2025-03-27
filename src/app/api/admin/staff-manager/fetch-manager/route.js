import connectDB from "@/utils/db";
import StaffManager from "@/models/staffManager";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // Fetch all managers
        const managers = await StaffManager.find();

        return NextResponse.json(
            { success: true, managers },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching managers:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
