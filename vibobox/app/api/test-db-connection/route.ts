import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'Connected to MongoDB successfully' }, { status: 200 });
  } catch (error) {
  console.error('Failed to connect to MongoDB:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ status: 'Failed to connect to MongoDB', error: errorMessage }, { status: 500 });
}
}