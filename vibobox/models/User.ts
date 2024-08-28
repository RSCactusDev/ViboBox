import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  createdAt: Date;
  googleId?: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, unique: true, sparse: true },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;