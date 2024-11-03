import { NextResponse } from "next/server";
import { getViboBoxModel } from "@/models/ViboBox";
import connectToDatabase from '@/lib/mongodb';
import { getUserModel, getUserById } from "@/models/User";
import { auth } from "@/config/auth";
import mongoose from "mongoose";





export async function POST(request: Request) {
    const session = await auth();
    console.log(session, "session");

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access. Please log in.' }, { status: 401 });
    }

    const { viboBoxCode } = await request.json();

    if (!viboBoxCode) {
        return NextResponse.json({ message: "ViboBox code is required" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const ViboBox = await getViboBoxModel();

      const exsistingViboBox = await ViboBox.findOne({ boxId: viboBoxCode });

      if (!exsistingViboBox) {
        return NextResponse.json({ message: 'ViboBox not found. Try again.' }, { status: 404 });
      }
      console.log(exsistingViboBox, "exsistingViboBox");
      const user = await getUserById(session.user.id);

      if (user) {
        if (user.viboBoxes.includes(exsistingViboBox._id as mongoose.Types.ObjectId)) {
          return NextResponse.json({ message: 'ViboBox already added to user' }, { status: 400 });
        }
        user.viboBoxes.push(exsistingViboBox._id as mongoose.Types.ObjectId);
        await user.save();
      }
      
      
      return NextResponse.json({ message: 'ViboBox found. Try again.', exsistingViboBox }, { status: 200 });
    } catch (error) {
      console.error('Error checking ViboBox:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }   
}

