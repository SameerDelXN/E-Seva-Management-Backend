// app/api/services/prepare/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';
import Plan from '@/models/Plans';

export const GET = async () => {
  try {
    await dbConnect();
    
    // Fetch all locations
    const locations = await Location.find().select('subdistrict district');
    
    // Fetch all plans
    const plans = await Plan.find().select('name duration price');
    
    return new NextResponse(
      JSON.stringify({ 
        message: 'Data fetched successfully', 
        locations, 
        plans 
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
};