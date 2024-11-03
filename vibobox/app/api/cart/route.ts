import {  NextResponse } from 'next/server';
import Cart from '@/models/Cart'; 
import { getUserByEmailWithViboBoxes } from "@/models/User";
import { getOrCreateSessionId } from '@/utils/getOrCreateSessionId'; // Utility to get session ID from cookie

import connectToDatabase from '@/lib/mongodb';
/* import { productOptions } from '@/utils/productOptions'; */
import { auth } from "@/config/auth"


export async function GET(req: Request) {
  
  try {
    await connectToDatabase();
    const session = await auth();
    const sessionId = getOrCreateSessionId();
    console.log(sessionId, 'sessionID')
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated'}, { status: 401 });
    }
    const cart = await Cart.findOne({ sessionId });
    /* const cart = await Cart.findOne({ sessionId }).populate('items.productId');  */// Assuming you are using a productId reference in cart
    console.log(cart, 'caartttt')
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found', cart: [] }, { status: 404 });
    }

    return NextResponse.json({ cart }, { status: 200 });
    /* const user = await getUserByEmailWithViboBoxes(session.user.email);
    if (user) {
     
      return NextResponse.json({ cart: user.cart }, { status: 200 });
    } */
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
