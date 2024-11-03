import mongoose, { Schema, Document } from 'mongoose';


interface ICartItem {
  variant: string;
  color: string;
  quantity: number;
  customLink?: string;

}

interface ICart extends Document {
  sessionId: string;
  items: ICartItem[];
}

const CartSchema: Schema<ICart> = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [
    {
      variant: { type: String, required: true },
      color: { type: String, required: true },
      quantity: { type: Number, required: true },
      customLink: { type: String, required: false},
    },
  ],
  
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);