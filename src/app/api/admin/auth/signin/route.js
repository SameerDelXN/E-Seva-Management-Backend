import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import connectDB from '@/utils/db'

export async function POST(request) {
  try {
    const { username, password, role } = await request.json()

    connectDB()

    // Find user by email or phone (as username) and role
    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
      role
    })

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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
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
