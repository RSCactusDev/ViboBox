import {  NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Stripe from 'stripe';
import Order from '@/models/Order';
import { sendEmail } from '@/utils/sendEmail';
import { getViboBoxModel,createUniqueViboBox } from '@/models/ViboBox';
import { getUserById } from '@/models/User';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  try {
    const body = await req.text(); 
    const event = stripe.webhooks.constructEvent(
      body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      await connectToDatabase();

      
      const order = await Order.findOne({ sessionId: session.id });

      if (order) {
      
        order.status = 'paid';
        order.paymentInfo.paymentIntentId = session.payment_intent as string;
        order.paymentInfo.status = 'paid';
        await order.save();
  
        console.log('Order updated to paid:', order);

        let viboBoxCodes: string[] = [];

        for (const item of order.item) {
          for (let i = 0; i < item.quantity; i++) {
            const newViboBox = await createUniqueViboBox();
            if (newViboBox) {
              viboBoxCodes.push(newViboBox.boxId);
              console.log('Created new ViboBox: ', newViboBox.boxId)
            
              if (order.userId) {
                const user =  await getUserById(order.userId.toString());
                if (user && !user.viboBoxes.includes(newViboBox._id as mongoose.Types.ObjectId)) {
                  user.viboBoxes.push(newViboBox._id as mongoose.Types.ObjectId); 
                  await user.save();
                  console.log('ViboBox associated with user ', user); 
                }
              } else {
                console.error('Failed to create a new ViboBox')
              }

            } else {
              console.error('Failed to create a new ViboBox')
            }
          }
        }

       
         if (!order.userId) {
          try {
            await sendEmail(
              order.shippingAddress.email,
              'Your ViboBox Codes - Order Confirmation',
              `Thank you for your order! Here are your ViboBox codes:\n\n${viboBoxCodes.join('\n')}\n\nEnjoy your purchase!`
            );
            console.log('Email sent successfully');
          } catch (error) {
            console.error('Error sending email:', error);
          }
        }
      } else {
        console.warn('Order not found for session ID:', session.id);
      }
    }




    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }
}