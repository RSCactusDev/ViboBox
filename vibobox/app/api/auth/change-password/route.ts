import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { getUserById } from "@/models/User";
import crypto from 'crypto';
import { auth } from "@/config/auth";

interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

export async function POST(request: Request) {

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access. Please log in.' }, { status: 401 });
    }

    await connectToDatabase();
    const { oldPassword, newPassword }: ChangePasswordRequestBody = await request.json();
 

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Old and new passwords are required' },
        { status: 400 }
      );
    }

    const user = await getUserById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ message: "User password not found" }, { status: 400 });
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });


  } catch (error) {
    console.error("Error changing password", error);
    return NextResponse.json({ message: "Failed to change password" }, { status: 500 });
  }
}