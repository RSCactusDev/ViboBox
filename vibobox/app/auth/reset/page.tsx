"use client"

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";


const ResetPageSend = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();



  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/reset', { email });
      if (response.status === 200){
        setStatus("Email sent successfully")
      }else{
        setStatus("Failed to send email")
      }
    }catch (error) {
      
    }
  };


  return (
    <div>
      <form onSubmit={handleSendEmail} >
        <h1>Reset Password</h1>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
         
        <Button type="submit">Send email</Button>
        {status && <p>{status}</p>}
      </form>
    </div>
  )
}

export default ResetPageSend;