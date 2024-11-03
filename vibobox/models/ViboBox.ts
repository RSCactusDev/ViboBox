  import mongoose, { Schema, Document, Model, model } from 'mongoose';
  import connectToDatabase from '@/lib/mongodb';

  export interface IGift {
    description?: string;
    imageUrl?: string;
  }

  export interface IViboBox extends Document {
    boxId: string; // Unique string
    createdAt: Date; // Optional createdAt field
    name?: string;
    theme: string;
    /* gifts?: Record<number, string>;  */
    gifts?: Record<number, IGift>;
    mode: string;
    confirmed: string,
    secondConfirmed: string,
  }

  const viboBoxSchema: Schema<IViboBox> = new mongoose.Schema({
    boxId: {
      type: String,
      required: true,
      unique: true, // Enforce uniqueness of the string
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    name: {type: String, default: ''},
    theme: {type: String, default: 'question'},
    gifts: { 
      type: Map, // Use a Mongoose Map to store key-value pairs
      of: new mongoose.Schema({
        description: { type: String },
        imageUrl: { type: String }
      }), // The values will be strings (gift descriptions)
      default: {} // Default value is an empty object
    },
    mode: { type: String, default: 'Sequential'},
    confirmed: { type: String},
    secondConfirmed:{ type: String},
  });

  // Function to get the ViboBox model
  async function getViboBoxModel(): Promise<Model<IViboBox>> {
    await connectToDatabase();
    return mongoose.models.ViboBox || mongoose.model<IViboBox>('ViboBox', viboBoxSchema);
  }

  // Function to find a ViboBox by ID
  async function getViboBoxById(id: string): Promise<IViboBox | null> {
    console.log('getting model')
    const ViboBox = await getViboBoxModel();
    console.log(ViboBox, 'got model')
    return ViboBox.findById(id).exec();
  }

  // Function to find a ViboBox by boxId (not _id)
async function getViboBoxByBoxId(boxId: string): Promise<IViboBox | null> {
  console.log('getting model');
  const ViboBox = await getViboBoxModel();
  console.log(ViboBox, 'got model');
  // Query using the `boxId` field, not `_id`
  return ViboBox.findOne({ boxId }).exec();
}

  function generateRandomBoxId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let boxId = '';
    for (let i = 0; i < 8; i++) {
      boxId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return boxId;
  }

  // Function to create a unique ViboBox in the database
  async function createUniqueViboBox(): Promise<IViboBox | null> {
    try {
      const ViboBox = await getViboBoxModel();

      let unique = false;
      let boxId = '';

      // Keep generating a new boxId until a unique one is found
      while (!unique) {
        boxId = generateRandomBoxId();
        const existingBox = await ViboBox.findOne({ boxId }).exec();

        if (!existingBox) {
          unique = true; // No matching boxId, so we can use it
        }
      }

      // Create and save the ViboBox with the unique boxId
      const newViboBox = new ViboBox({ boxId });
      await newViboBox.save();

      return newViboBox;
    } catch (error) {
      console.error('Error creating unique ViboBox:', error);
      return null;
    }
  }

  export { getViboBoxModel, getViboBoxById, createUniqueViboBox, getViboBoxByBoxId };