import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";  
import nodemailer from "nodemailer";
import crypto from "crypto";
import  connectToDatabase  from "@/lib/mongodb";
import { getUserModel } from "@/models/User";




export async function POST(request: Request) {
  try {
    const { email }: { email:string } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required"}, { status:400})
    } 
    await connectToDatabase();
    const User = await getUserModel();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found"}, { status:404})
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send the reset email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'viboboxofficial@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.PUBLIC_URL}/auth/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: 'viboboxofficial@gmail.com',
      to: email,
      subject: 'ViboBox - Reset Password',
      html: `
        <p>Please click the following link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    return NextResponse.json({ message: "Reset email sent"}, { status:200});

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error"}, { status:500});
  }
}
