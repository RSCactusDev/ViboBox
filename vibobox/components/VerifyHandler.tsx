
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modalStore';
import {Spinner} from "@/components/Spinner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



export default function VerifyHandler () {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const setSuccessMessage = useModalStore((state) => state.setSuccessMessage);
  const setFailedMessage = useModalStore((state) => state.setFailedMessage);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const isVerified = searchParams.get('verified') === 'true';
    const token = searchParams.get('token');

    if (isVerified && token) {
      const verifyEmail = async () => {
        setLoading(true);
        const minDisplayTime = 3000; // 3 seconds
        const startTime = Date.now();
        try {
          const response = await fetch(`/api/auth/verify-email?token=${token}`);
          const data = await response.json();
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(minDisplayTime - elapsedTime, 0);

          setTimeout(() => {
            if (response.ok) {
              setSuccessMessage('Email verified successfully. You can now log in.');
              openLoginModal();

            } else {
              setFailedMessage(data.message || 'Verification failed');
            }
            setLoading(false);
          }, remainingTime);
        } catch (error) {
          setFailedMessage('An error occurred during verification.');
          setLoading(false);
        }
      };

      verifyEmail();
    }
  }, [searchParams, router, openLoginModal, setSuccessMessage]);

  if (loading) {
    return (
      <Dialog open={loading} onOpenChange={() => setLoading(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verifying Email</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <p className="mt-2">Please wait, verifying your email...</p>
        </div>
      </DialogContent>
    </Dialog>
    );
  }

  return null;
}