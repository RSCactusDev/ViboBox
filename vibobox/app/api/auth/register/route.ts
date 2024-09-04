import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { getUserModel } from "@/models/User";
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    await connectToDatabase();
    const User = await getUserModel();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if ('provider' in existingUser && existingUser.provider === 'Google') {
        return NextResponse.json({ message: "This email is already registered with Google. Please sign in with Google." }, { status: 400 });
      } else {
        return NextResponse.json({ message: "Email already in use. Please use a different email or sign in with Google and set up your ViboBOX password." }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      vertificationToken: verificationToken,
      verified: false
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
