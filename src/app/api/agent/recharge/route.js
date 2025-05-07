// app/api/agent/recharge/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Agent from "../../../../models/agent";
import connectDB from "@/utils/db";

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400", // Cache preflight request for 24 hours
      },
    }
  );
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { agentId, amount } = body;

    if (!agentId || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const rechargeAmount = parseFloat(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const currentBalance = agent.wallet || 0;
    const newBalance = currentBalance + rechargeAmount;

    await Agent.findByIdAndUpdate(
      agentId,
      {
        wallet: newBalance,
        lastRecharge: amount.toString(),
        dateOfPurchasePlan: new Date().toLocaleDateString(),
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Wallet recharged successfully",
        data: {
          previousBalance: currentBalance,
          rechargeAmount,
          newBalance,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error recharging wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to recharge wallet",
        error: error.message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json(
        { success: false, message: "Agent ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          agentId: agent._id,
          fullName: agent.fullName,
          wallet: agent.wallet,
          lastRecharge: agent.lastRecharge,
          paymentMethod: agent.paymentMethod,
          dateOfPurchasePlan: agent.dateOfPurchasePlan,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error checking wallet balance:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check wallet balance",
        error: error.message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}