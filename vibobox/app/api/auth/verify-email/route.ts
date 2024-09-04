import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import {getUserModel} from "@/models/User";

export async function GET(request: Request) { 
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  console.log("Received token:", token);  

  if (!token) {
    return NextResponse.json({ message: "Invalid tokenassa" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const User = await getUserModel();

    const user = await User.findOne({ vertificationToken: token });

    if (!user) {
      return NextResponse.json({ message: "Invalid token user" }, { status: 400 });
    }

    user.verified = true;
    user.vertificationToken = '';
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}