import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Location from '@/models/location';


export const GET = async () => {
    try {
      await dbConnect();
      const locations = await Location.find();
  
      return new NextResponse(
        JSON.stringify({ message: 'Locations fetched successfully', locations }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error fetching locations:', error);
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