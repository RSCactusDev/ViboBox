import { NextResponse } from "next/server";
import { getUserByEmailWithViboBoxes } from "@/models/User";
import { auth } from "@/config/auth";
import '@/models/ViboBox'; // Import ViboBox model

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmailWithViboBoxes(session.user.email);
    /* console.log(session.user.id, 'user'); */
    if (!user) {
      /* console.log('User not found wtf'); */
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ viboBoxes: user.viboBoxes });
  } catch (error) {
    console.error('Error fetching user ViboBoxes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
