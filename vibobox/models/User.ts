import mongoose, { Schema, Document, Model, model } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

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
});



async function getUserModel(): Promise<Model<IUser>> {
  await connectToDatabase();
  return mongoose.models.User || mongoose.model<IUser>('User', userSchema);
}

async function getUserById(id: string): Promise<IUser | null> {
  await connectToDatabase();
  return mongoose.models.User?.findById(id).exec();
}

export { getUserModel, getUserById };
