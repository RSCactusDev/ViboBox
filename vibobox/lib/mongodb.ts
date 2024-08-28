import mongoose from 'mongoose'


const connectToDatabase = async ():Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export default connectToDatabase;

