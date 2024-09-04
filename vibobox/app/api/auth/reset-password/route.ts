import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { getUserModel } from "@/models/User";


interface ResetPasswordRequestBody {
    resetToken: string;
    password: string;
}

export async function POST(request: Request){
    const { resetToken, password }: ResetPasswordRequestBody = await request.json();

    if (!resetToken || !password){
      return NextResponse.json({ message: "Invalid token or password" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const userModel = await getUserModel();
      const user = await userModel.findOne({ 
        resetToken,
        resetTokenExpires: { $gt: new Date() }
      });

      if (!user) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
      return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error resetting password", error);
        return NextResponse.json({ message: "Failed to reset password" }, { status: 500 });
    }
  }

        




