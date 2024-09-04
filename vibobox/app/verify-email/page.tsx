"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('Invalid token');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('Email verified successfully. Redirecting to login...');
          setTimeout(() => router.push('/auth/signin'), 3000);
        } else {
          setStatus(data.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return <div>{status}</div>;
}