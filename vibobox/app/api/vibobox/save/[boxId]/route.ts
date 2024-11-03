// /app/api/vibobox/[boxId]/route.ts
import mongoose from 'mongoose';

import { NextResponse } from 'next/server';
import { getViboBoxModel } from '@/models/ViboBox';
import { getUserModel } from '@/models/User'; // Assuming you have a User model
import connectToDatabase  from '@/lib/mongodb'; // Ensure your database connection file is correctly imported
import { getToken } from 'next-auth/jwt'; // For NextAuth JWT token validation
import { auth } from '@/config/auth';

export async function PUT(req: Request, { params }: { params: { boxId: string } }) {
  const { boxId } = params;
  console.log("Box ID in API Route: ", boxId); // Check if boxId is received correctly in the route


  // Get the JWT token (using NextAuth for example)
  const token = await auth();
  console.log(token, 'token');
  const session = await auth();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse the incoming request body (updated data)
  const body = await req.json();
  const { name, gifts, theme } = body;
  console.log('giftsssssssssssssssssssssssssssssssssssssssssss', gifts )
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the User model
    const User = await getUserModel();

    // Find the user by their ID (assuming the token contains user ID)
    const user = await User.findById(token.user.id).populate('viboBoxes');// `sub` is typically the user's ID in JWT
    console.log(user, 'user_ populated ');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log(typeof boxId, boxId); // Check if it's a string
    // Check if the user has the boxId in their list of boxes
    /* const userHasAccess = user.viboBoxes.some((box) => box.boxId === boxId); */
    const userHasAccess = user.viboBoxes.some((box) => {
      if (typeof box !== 'string' && 'boxId' in box) {  // Ensure box is populated before accessing boxId
        return box.boxId === boxId;
      }
      return false;
    });
    console.log(userHasAccess, 'userHasAccess');
    if (!userHasAccess) {
      return NextResponse.json({ error: 'Forbidden: You do not have access to this ViboBox' }, { status: 403 });
    }


    // Get the ViboBox model
    const ViboBox = await getViboBoxModel();

    // Find the ViboBox by its ID and update it
   /*  const updatedBox = await ViboBox.findByIdAndUpdate(
      boxId,
      { name, gifts, theme }, // Fields to update
      { new: true } // Return the updated document
    ); */
    const updatedBox = await ViboBox.findOneAndUpdate(
      { boxId },  // Query by boxId field instead of _id
      { name, gifts, theme },  // Fields to update
      { new: true }  // Return the updated document
    );


    if (!updatedBox) {
      return NextResponse.json({ error: 'ViboBox not found' }, { status: 404 });
    }

    // Return the updated document in the response
    return NextResponse.json(updatedBox, { status: 200 });
  } catch (error) {
    console.error('Error updating ViboBox:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
