"use client";

import { useEffect, useState } from 'react';

import { getUserModel } from '@/models/User';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';





const DashboardPage = () => {
  const router = useRouter()
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }



  return (
      <div className=' bg-white p-10 rounded-xl' >
          <div>Dashboard</div>
          <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      
  )
}

export default DashboardPage