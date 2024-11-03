import {  NextResponse } from "next/server";
import { getUserByEmailWithViboBoxes } from "@/models/User";
import connectToDatabase from '@/lib/mongodb';
/* import { productOptions } from '@/utils/productOptions'; */
import { auth } from "@/config/auth"



export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated'}, { status: 401 });
  }
  const { variant, color } = await req.json();


  try {
    await connectToDatabase();
    const user = await getUserByEmailWithViboBoxes(session.user.email);
    if (user) {
      user.cart = user.cart.filter((item) => !(item.variant === variant && item.color === color));
      await user.save();
      return NextResponse.json({ message: 'Item removed', cart: user.cart }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}
