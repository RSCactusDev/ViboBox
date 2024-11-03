'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import confetti from 'canvas-confetti';
import { MdOutlineVerified } from "react-icons/md";
import { Spinner } from "@/components/Spinner";


interface Gift {
  description: string;
  imageUrl?: string;
}

interface ViboBox {
  boxID: string;
  createdAt: Date;
  name?: string;
  theme: string;
  gifts?: Record<number, Gift>;
  confirmed: string;
  secondConfirmed: string;
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {AcceptGiftModal} from "@/components/AcceptGiftModal"

// Modal component
const Modal = ({ isVisible, onClose,onAccept, giftMessage, aiImageUrl, onDiscard, disableDiscard,  secondConfirmed}: any) => {
  if (!isVisible) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 relative w-[300px] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Your Gift</h2>
        <img src={aiImageUrl} alt="AI Generated Image" className="w-[256px] h-[256px] object-cover rounded-lg mb-4" />
       
        <div className="text-center">
          <div className="text-2xl">❤️</div>
          <div className="text-xl font-semibold tracking-tight">{giftMessage}</div>
        </div>
        <div className='flex justify-between'>
          <Button onClick={onAccept} disabled={secondConfirmed} className="mt-4 px-4 py-2 text-white rounded-md">
            Accept 
          </Button>
          <Button 
            onClick={secondConfirmed ? onClose : onDiscard}  
            disabled={disableDiscard}
            className="mt-4 px-4 py-2 text-white rounded-md">
            {secondConfirmed ? 'Close' : 'Discard'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const GamePage = () => {
  const { boxId } = useParams(); // Get the boxId from the URL
  const [viboBox, setViboBox] = useState<ViboBox | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<{ description: string; key: number } | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [aiImageUrl, setAiImageUrl] = useState<string>('');
  const [discardedGifts, setDiscardedGifts] = useState<Set<number>>(new Set()); // Track discarded gifts
  const [disableDiscard, setDisableDiscard] = useState<boolean>(false)
  const [isAcceptGiftModalVisible, setIsAcceptGiftModalVisible] = useState<boolean>(false);
  const [secondConfirmed, setSecondConfirmed] = useState<string>('');


  useEffect(() => {
    const fetchViboBox = async () => {
      try {
        const response = await axios.get<ViboBox>(`/api/vibobox/get/game/${boxId}`);
        setViboBox(response.data);
      } catch (error) {
        console.error('Error fetching ViboBox:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViboBox();
  }, [boxId]);

  const handleGiftClick = async (gift: Gift, giftKey: number) => {
    if (discardedGifts.has(giftKey) && !secondConfirmed ) return; // If gift is discarded, do not proceed
    
    setSelectedGift({ description: gift.description, key: giftKey });
    setModalVisible(true);
    setAiImageUrl(gift.imageUrl || '/images/No_image_found.webp');
    setDisableDiscard(false); 
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGift(null);
  };

  const handleDiscard = () => {
    if (selectedGift) {
      setDiscardedGifts(prev => new Set(Array.from(prev).concat(selectedGift.key))); // Add the discarded gift to the set
      closeModal(); // Close the modal after discarding
    }
  };
  const triggerFireworks = () => {
    setDisableDiscard(true);
    setIsAcceptGiftModalVisible(true);
    // Create a fullscreen canvas for fireworks
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, { resize: true });

    // Fireworks effect with canvas-confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        document.body.removeChild(canvas); // Remove the canvas after fireworks
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const closeAcceptGiftModal = async () => {
    setIsAcceptGiftModalVisible(false);
    
    closeModal();
    if (selectedGift) {
      try {
        setSecondConfirmed(selectedGift.description)
        
        await axios.put(`/api/vibobox/confirm/${boxId}`, {
          confirmed: selectedGift.description,
        })
        console.log('Gift confirmed and saved successfully!');
      } catch {
        
        console.error('Error saving confirmed gift:', error);
      }
    }
    
  };


  return (
    <div>
      <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[400px] border-none h-full">
          {/* <h1>Game Page</h1>
          <p>Box ID: {boxId}</p> */}
        <CardHeader className="flex justify-end pb-4">
          <div className="flex justify-between"></div>    
        </CardHeader>      
        <CardContent>

        {loading ? (
            <div className="flex justify-center items-center">
              <Spinner /> 
            </div>
          ) : viboBox && viboBox.gifts ? (
            <div className='grid grid-cols-3 gap-2'>
              {Object.entries(viboBox.gifts).map(([key, gift]) => {
                const giftKey = Number(key);
                const isDiscarded = discardedGifts.has(giftKey);
                const isConfirmed = secondConfirmed === gift.description; 
                return (
                  
                  <div
                    key={key}
                    className={`flex items-center justify-center bg-cover bg-center ml-2 mb-3 mr-3 border-none rounded-lg shadow-2xl ${
                      isDiscarded ? 'opacity-50 ' : 'cursor-pointer'
                    }`}
                    onClick={() =>  handleGiftClick(gift as Gift, giftKey)}
                    style={{
                      backgroundImage: `url(${viboBox.theme})`,
                      height: '6.5rem', // equivalent to 30 in Tailwind's spacing scale
                      width: '6.5rem',
                    }}
                  >
                    {isConfirmed && (
                      <div className="relative top-0 right-0" style={{ color: 'green', fontSize: '24px' }}>
                        <MdOutlineVerified />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No gifts available</p>
          )}
        </CardContent>
      </Card>

      <Modal
        isVisible={isModalVisible}
        onAccept={triggerFireworks}
        onClose={closeModal}
        giftMessage={selectedGift?.description}
        aiImageUrl={aiImageUrl}
        onDiscard={handleDiscard}
        disableDiscard={disableDiscard}
        secondConfirmed={secondConfirmed} 
      />
      <AcceptGiftModal 
        isVisible={isAcceptGiftModalVisible} 
        onClose={closeAcceptGiftModal} 
        giftMessage={selectedGift?.description}
      />
    </div>
  );
};

export default GamePage;
