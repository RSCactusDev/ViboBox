import mongoose, { Schema, Document } from 'mongoose';


interface IOrderItem {
  variant: string;
  color: string;
  quantity: number;
  price: number; // Price of the item at the time of order
}


interface IOrder extends Document {
  sessionId?: string;
  sessionIdStripe?: string;
  userId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    address: string;
    email: string;
    city: string;
    country: string;
    zip: string;
    omniviaCity?: string;
    omnivaPickUpPoint?: string;
  };
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled';
  paymentInfo: {
    paymentIntentId?: string; // Stripe Payment Intent ID
    status: 'awaiting_payment' | 'paid' | 'failed' | 'refunded';
  };
  createdAt: Date;
  updatedAt: Date;
}



const OrderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    sessionId: { type: String, required: function () { return !this.userId; } },
    sessionIdStripe: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        variant: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      email: {type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      omniviaCity: { type: String, required: false },
      omnivaPickUpPoint: { type: String, required: false },
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'completed', 'canceled'],
      default: 'pending'  ,
    },
    paymentInfo: {
      paymentIntentId: { type: String, required: true }, // Stripe Payment Intent ID
      status: {
        type: String,
        enum: ['awaiting_payment', 'paid', 'failed', 'refunded'],
        default: 'awaiting_payment',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);