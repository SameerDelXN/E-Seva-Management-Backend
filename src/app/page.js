import connectDB from '@/utils/db'
import React from 'react'

export default function page() {

  connectDB();
  return (
    <div>page</div>
  )
}
