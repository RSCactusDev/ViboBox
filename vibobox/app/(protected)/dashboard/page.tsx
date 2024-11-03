"use client";

import { useEffect, useState } from 'react';

import { getUserModel } from '@/models/User';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashBottom } from '@/components/DashBottom';





const DashboardPage = () => {
  const router = useRouter()
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
    {/* This container should take up the full height of the screen */}
    <div className="h-full w-full max-w-4xl flex justify-center items-center">
      <DashBottom />
    </div>
  </div>
      
  )
}

export default DashboardPage