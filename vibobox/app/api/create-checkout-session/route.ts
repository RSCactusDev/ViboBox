import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import connectToDatabase  from '@/lib/mongodb';
import Order from '@/models/Order'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});


export async function POST(request: Request) {

  try {
    const { 
      name, email, address, country, city, zip, cart, 
      total, omnivaPickUpPoint, sessionId, successUrl, cancelUrl, omniviaCity 
    } = await request.json();


    await connectToDatabase();

    
    const session = await stripe.checkout.sessions.create({
      line_items: cart.map((item: { price: number; quantity: number; variant: string }) => ({
        price_data: {
          currency: 'eur', // Replace with your currency
          product_data: {
            name: 'ViboBOX ' + item.variant,
          },
          unit_amount: item.price * 100, // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
    });

    const newOrder = new Order({
      sessionId,
      sessionIdStripe: session.id,
      items: cart,
      totalAmount: total,
      shippingAddress: { name, address, email, city, country, zip, omniviaCity, omnivaPickUpPoint },
      status: 'pending',
      paymentInfo: { paymentIntentId: "pending", status: 'awaiting_payment' },
    });
    await newOrder.save();


    return NextResponse.json({ url: session.url });


  } catch (error) {
    console.error('Error creating order: ', error);
    return NextResponse.json({error: 'An error occurred while processing the order.'}, {status: 500});
  }
}
