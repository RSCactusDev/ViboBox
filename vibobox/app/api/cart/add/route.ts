import {  NextResponse } from "next/server";
import { getOrCreateSessionId } from '@/utils/getOrCreateSessionId';
import Cart from '@/models/Cart';
import connectToDatabase from '@/lib/mongodb';
import { auth } from "@/config/auth"



export async function POST( req:Request ) {
  await connectToDatabase();
  const session = await auth();

  const sessionId = getOrCreateSessionId();
  console.log(sessionId, 'sessions')

  /* if (!sessionId) {
    return NextResponse.json({ error: 'Not authenticated'}, { status: 401 });
  }
 */

  const { variant, color, quantity } = await req.json();
   // Find the cart associated with the session ID
   let cart = await Cart.findOne({ sessionId });

   // If no cart exists for this session, create a new one
   if (!cart) {
     cart = new Cart({ sessionId, items: [] });
   }
 
   // Check if the item is already in the cart
   const itemIndex = cart.items.findIndex(
     (item: { variant: string; color: string }) => item.variant === variant && item.color === color
   );
 
   if (itemIndex > -1) {
     // If the item already exists in the cart, update its quantity
     cart.items[itemIndex].quantity += quantity;
   } else {
     // If the item doesn't exist, add a new one
     cart.items.push({ variant, color, quantity });
   }
 
   // Save the cart with the new or updated item
   await cart.save();
 
   return NextResponse.json({ message: 'Cart updated', cart });
 }