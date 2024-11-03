import { Download } from "lucide-react";
import { NextResponse } from 'next/server';
import Replicate from "replicate";
import axios from "axios";
import fs from 'fs';
import path from 'path';


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});



export async function POST(req: Request, { params }: { params: { boxId: string }})  {

  const { boxId } = params;

  const body = await req.json();

  const { gifts } = body;


  try {
    const updatedGifts = await Promise.all(
      Object.entries(gifts).map(async ([key, gift]: [string, any]) => {
        const description = gift.description + ', cold color palette, muted colors, detailed, 8k'

        if (!description) {
          return { ...gift, imageUrl: ''};
        }

        const output: string[] = await replicate.run(
          "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24",
          {
            input: {
              width: 800,
              height: 800,
              prompt: description + ',cold color palette, muted colors, detailed, 8k',
              scheduler: "DPMSolver++",
              num_outputs: 1,
              guidance_scale: 3,
              apply_watermark: true,
              negative_prompt: "ugly, deformed, noisy, blurry, distorted",
              prompt_strength: 0.8,
              num_inference_steps: 25
            }
          }
        ) as string[]; 

        /* const output = [
          'https://replicate.delivery/yhqm/j0CKHNQTnB7dHVQ3ohT0u8Glu24RdfYb09lIdJwSFsGK44uJA/out-0.png'
        ]  */
        console.log('output is: ', output)

        const imageUrl = output[0];

        const imagePath = await downloadAndSaveImage(imageUrl, key, boxId);
        console.log(imagePath, 'imagePath is ')

        return {...gift, imageUrl: imagePath};
      })
    );
    /* return res.status(200).json({message: 'Images generated. ', gifts: updatedGifts}) */
    return new Response(
      JSON.stringify({ message: 'Images generated.', gifts: updatedGifts }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating images:', error);
    return new Response(JSON.stringify({error: 'Internal Server Error'}), 
    { status: 500, headers:{'Content-Type': 'application/json'}}
  
  )
  }
}




const downloadAndSaveImage = async (url: string, giftId: string, boxId: string) => {
  const response = await axios.get(url, {responseType: 'stream'})
  const filePath = path.join(process.cwd(), 'public', 'images', `${boxId+'_'+giftId}.png`)
  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(`/images/${boxId+'_'+giftId}.png`));
    writer.on('error', reject);
  });
};