import { getViboBoxByBoxId } from '@/models/ViboBox';
import { NextResponse } from 'next/server';



export async function PUT(req: Request, { params }: { params: { boxId: string } }) {
  const { boxId } = params;
  const body = await req.json();
  const { confirmed } = body;
  console.log(confirmed, 'confirmed')

  try {
    const viboBox = await getViboBoxByBoxId(boxId);

    if (!viboBox) {
      return NextResponse.json({ error: 'ViboBox not found' }, { status: 404 });
    }

    if (!body || typeof body.confirmed !== 'string') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update the confirmed field with the gift description
    if (!viboBox.confirmed) {
      viboBox.confirmed = confirmed;
    } 
    viboBox.secondConfirmed = confirmed;
    await viboBox.save();

    return NextResponse.json({ message: 'Gift confirmed successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error confirming gift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
