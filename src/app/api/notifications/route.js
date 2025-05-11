// src/app/api/notifications/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import connectDB from '@/utils/db';

// Define notification schema if not already defined elsewhere
const NotificationSchema = new mongoose.Schema({
  recipient: { 
    type: String, 
    required: true,  // Can be 'staff-manager', 'staff-{id}', or 'agent-{id}'
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['application_created', 'staff_assigned', 'status_updated', 'info'],
    required: true
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Initialize model (or use existing one)
let Notification;
try {
  Notification = mongoose.model('Notification');
} catch {
  Notification = mongoose.model('Notification', NotificationSchema);
}

// CORS headers to use in all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests (for CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Create a new notification
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();
    
    // Validate required fields
    if (!data.recipient || !data.message || !data.type || !data.relatedTo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    const notification = new Notification(data);
    const savedNotification = await notification.save();

    return NextResponse.json(savedNotification, { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Get notifications for a specific recipient
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get('recipient');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    console.log(recipientId)
    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient parameter is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const query = { recipientId };
    if (unreadOnly) {
      query.read = false;
    }
    if(recipientId==="admin"){
      const notifications = await Notification.find({recipientRole : recipientId}).sort({ createdAt: -1 })
      .limit(20);
      return NextResponse.json({ notifications }, { headers: corsHeaders });
    }
    if(recipientId.includes("staff-manager")){
       const notifications = await Notification.find({recipientRole : recipientId}).sort({ createdAt: -1 })
      .limit(20);
      return NextResponse.json({ notifications }, { headers: corsHeaders });
    }
    const notifications = await Notification.find({recipientId})
      .sort({ createdAt: -1 })
      .limit(20);
    // Fixed the structure of the response
    return NextResponse.json({ notifications }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Mark notifications as read
export async function PATCH(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { ids } = data;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Valid notification IDs are required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { read: true } }
    );
    
    return NextResponse.json({ 
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500, headers: corsHeaders }
    );
  }
}