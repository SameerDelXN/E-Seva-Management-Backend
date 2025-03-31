import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '@/models/User'
import connectDB from '@/utils/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, phone, password, role } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'agent', 'staff_manager', 'staff', 'customer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid user role' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone number (basic validation)
    if (phone.length < 10 || !/^\d+$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be at least 10 digits' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

   connectDB()

    // Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    })

    if (existingUser) {
      let errorMessage = 'User already exists with '
      if (existingUser.email === email) errorMessage += 'this email'
      if (existingUser.phone === phone) {
        if (existingUser.email === email) errorMessage += ' and phone'
        else errorMessage += 'this phone'
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 409 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    })

    await newUser.save()

    // Return user data without password
    const { password: _, ...userData } = newUser.toObject()

    return NextResponse.json({
      success: true,
      user: userData
    }, { status: 201 })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}