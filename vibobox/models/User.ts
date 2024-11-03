import mongoose, { Schema, Document, Model, model } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { IViboBox } from '@/models/ViboBox';
import '@/models/ViboBox';
import { getViboBoxModel } from '@/models/ViboBox';

/* 
interface ICartItem {
  variant: string;  // Box with QR, Digital, Bundle (5x, 10x)
  color: string;    // Only relevant for physical boxes (if applicable)
  quantity: number; // Number of items for that variant
} */


interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
  googleId?: string;
  password?: string;
  verified: boolean
  vertificationToken: String;
  role: string;
  image: string;
  emailVerified?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  viboBoxes: (mongoose.Types.ObjectId | IViboBox)[]; 
/*   cart: ICartItem[];  */
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  resetToken: { type: String, default: '' },
  resetTokenExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, unique: true, sparse: true },
  emailVerified: { type: Date },
  verified: { type: Boolean, default: false },
  vertificationToken: { type: String, default: '' },
  image: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  viboBoxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ViboBox' }],
  /* cart: [
    {
      variant: { type: String, required: true }, 
      color: { type: String, default: ''}, 
      quantity: { type:Number, default: 1},
    },
  ] */
});



async function getUserModel(): Promise<Model<IUser>> {
  await connectToDatabase();
  return mongoose.models.User || mongoose.model<IUser>('User', userSchema);
}

async function getUserById(id: string): Promise<IUser | null> {
  await connectToDatabase();
  return mongoose.models.User?.findById(id).exec();
}


/* async function getUserByIdWithViboBoxes(id: string): Promise<IUser | null> {
  await connectToDatabase();
  return mongoose.models.User?.findById(id).populate('viboBoxes').exec(); // Populate the viboBoxes field
}
 */

async function getUserByEmailWithViboBoxes(email: string): Promise<IUser | null> {
  await connectToDatabase();
  const User = await getUserModel();
  const ViboBox = await getViboBoxModel();
  /* console.log('Searching for user with email:', email); */
  const user = await User.findOne({ email }).populate('viboBoxes');
  /* console.log('User found:', user); */
  return user;
}

export { getUserModel, getUserById, getUserByEmailWithViboBoxes };


