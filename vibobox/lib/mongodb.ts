import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || '';

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase() {
  console.log(mongoose.connection.readyState, 'Connecting to MongoDB...');
  if (mongoose.connection.readyState >= 1) return;

  try {
    
    await mongoose.connect(MONGO_URI, {

      serverSelectionTimeoutMS: 10000, // Increase to 10 seconds
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;

