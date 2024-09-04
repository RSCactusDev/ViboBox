import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getUserModel } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const User = await getUserModel();

    const user = new User({ name: 'Test User', email: 'test@example.com' });
    await user.save();
    console.log('User saved:', user);

    return NextResponse.json({ message: 'User saved successfully', user }, { status: 201 });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
