import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import connectDB from '@/utils/db'
import Agent from '@/models/agent'
import Staff from '@/models/staff'
import StaffManager from "@/models/staffManager"

export async function POST(request) {
  try {
    const { username, password, role } = await request.json()
    console.log(role);
    await connectDB()
    
    // Variable to store the found user
    let user;
    let isPasswordValid = false;
    
    // Check the role and query the appropriate model
    if (role === "agent") {
      // For agents, check by email, phone, or username as these are all unique identifiers in your schema
      user = await Agent.findOne({
        $or: [{ email: username }, { phone: username }, { username: username }],
      });
      
      // For agents, compare plain text passwords
      if (user) {
        isPasswordValid = (password === user.password);
      }
    }
    else if(role==="staff_manager"){
      console.log("seraching in staffmanager");
      user = await StaffManager.findOne({
        $or: [{username:username}],
       
      });
      if(user){
        if(password==user.password){
          isPasswordValid=true
        }
        else{
          isPasswordValid=false
        }
      }
    }
   
    else if(role === "staff"){
      console.log("seraching in staff");
      user = await Staff.findOne({
        $or: [{username:username}],
       
      });
      if (user) {
        if(password==user.password){
          isPasswordValid=true
        }
        else{
          isPasswordValid=false
        }
      }
      console.log(user);

    } 
    else {
      console.log(role)
      console.log("seraching in user");
      user = await User.findOne({
        $or: [{ email: username }, { phone: username } ,{username:username}],
        role
      });
      
      // For users, verify password using bcrypt
      if (user) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
    }
    
    // Return error if user not found
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid credentials or role' }),
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }
    console.log("sdf",isPasswordValid);
    
    // Check if password is valid based on earlier validation
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }
   
    
    // Return user data without password
    const { password: _, ...userData } = user.toObject()
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        user: userData
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  } catch (error) {
    console.error('SignIn error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

// Handle CORS Preflight (OPTIONS request)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}