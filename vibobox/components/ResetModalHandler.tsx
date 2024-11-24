'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResetPassword from './ResetPassword';
import { useModalStore } from '@/store/modalStore';

export default function ResetModalHandler() {
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const router = useRouter();
  const openLoginModal = useModalStore((state) => state.openLoginModal);



  // Detect reset token and reset query parameters to open modal
  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const reset = searchParams.get('reset');
    const token = searchParams.get('token');

    if (reset === 'true' && token) {
      setResetToken(token); // Store the token
      setResetModalOpen(true); // Open the modal
    }
  }, []);

  const handleResetClose = () => {
    setResetModalOpen(false);
    setResetToken(null);
    openLoginModal(); 
    router.replace('/');
  };

  return (
    isResetModalOpen && (
      <ResetPassword 
        isOpen={isResetModalOpen} 
        onClose={handleResetClose} 
        token={resetToken} 
        openLoginModal={openLoginModal}
      />
    )
  );
}
