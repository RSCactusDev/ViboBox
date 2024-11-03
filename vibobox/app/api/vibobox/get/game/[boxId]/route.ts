import { NextResponse } from 'next/server';
import { getViboBoxByBoxId } from '@/models/ViboBox';
import connectToDatabase from '@/lib/mongodb';


export async function GET(request: Request, { params }: { params: { boxId: string } }) {
  const { boxId } = params;


  try {
    await connectToDatabase();
    console.log(boxId)
    console.log('Database connection successful');
    const viboBox = await getViboBoxByBoxId(boxId);
    console.log(viboBox, 'ViboBox fetched');
    if (!viboBox) {
      return NextResponse.json({ message: 'ViboBox not found' }, { status: 404 });
    } 
    return NextResponse.json(viboBox, { status: 200});
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching ViboBox', error: error }, { status: 500 });
  }


}