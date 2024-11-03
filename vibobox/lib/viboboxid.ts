import mongoose, { Schema, Document, Model } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { createUniqueViboBox } from '@/models/ViboBox';

export async function addViboBoxCodeNew() {
  const newViboBox = await createUniqueViboBox();
  
  if (newViboBox) {
    console.log('Successfully created ViboBox:', newViboBox);
  } else {
    console.log('Failed to create ViboBox.');
  }
}
