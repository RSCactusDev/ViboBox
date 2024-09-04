"use client"

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";


const ResetPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();



  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword){
      setStatus("Passwords do not match")
      return;
    }

    const resetToken = searchParams.get('token');
    try {
      const response = await axios.post('/api/auth/reset-password', { resetToken, password });
      if (response.status === 200){
        setStatus("Password reset successfully")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      }else{
        setStatus("Failed to reset password")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response ){
        setStatus(error.response.data.message || 'Failed to reset password');
      }else{
        setStatus('An error occurred. Please try again.');
      }
    }
  };


  return (
    <div>
      <form onSubmit={handleResetPassword} >
        <h1>Reset Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Reset Password</Button>
        {status && <p>{status}</p>}
      </form>
    </div>
  )
}

export default ResetPage;