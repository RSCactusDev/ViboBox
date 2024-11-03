'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"
import axios from "axios";
import { auth } from "@/config/auth"
import { LogOut } from "@/components/LogoutButton"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


const Settings =  () => {
  /* const session = await auth() */
  const { data: session } = useSession();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword !== confirmPassword) {
      setStatusMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/change-password", {
        oldPassword,
        newPassword
      });

      if (response.status === 200) {
        setStatusMessage("Password changed successfully.")
      } else {
        setStatusMessage(response.data.message || "Password change failed.");
      }
    } catch (error) {
      setStatusMessage("An error occurred. Please try again.")
    }
  }


  return (
    
    <Card className="bg-white bg-opacity-20 rounded-xl shadow-md w-[400px] max-w-4xl h-[80vh] border-none">
    
      {/* <div>{JSON.stringify(session)}</div>
      <div><LogOut /></div> */}
      <CardHeader className="flex justify-end pb-4">
      <div>
          <h4 className="text-xl font-bold">Settings</h4>
        </div>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              type="password" 
              id="new-password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              type="password" 
              id="confirm-password" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="password">Old Password</Label>
            <Input 
              type="password" 
              id="old-password" 
              placeholder="Old Password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          {statusMessage && <p className="text-red-600">{statusMessage}</p>}
          <Button  type="submit" className="mt-4">Change Password</Button>
        </form>
      </CardContent>
    </Card>
    
  )
}

export default Settings