'use client'

import React from 'react';
import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from './Spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  openLoginModal: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ isOpen, onClose, token, openLoginModal  }) => {
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showResetButton, setShowResetButton] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur(); // Ensure the input isn't focused on modal open
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }


    setLoading(true); // Show spinner
    setError('');
    setStatus('');

    try {
      const response = await axios.post('/api/auth/reset-password', { resetToken: token, password });
      if (response.status === 200) {
        setStatus('Password reset successfully. You can login.');
        setShowResetButton(false);  
       
      } else {
        setError('Failed to reset password');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Failed to reset password');
        
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your new password below. <p>Make sure it&apos;s at least 8 characters long.</p>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef} 
                id="new-password"
                type={showPassword ? "text" : "password"}
                className="pl-8 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2.5 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                className="pl-8 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm font-bold text-destructive text-red-600">{error}</p>}
          {status && <p className="text-sm font-bold text-success text-green-600">{status}</p>}

          
          {loading ? (
            <>
              <Spinner /><p className="flex justify-center">Please wait ...</p>
            </> 
            ): (
              showResetButton && (
                <Button type="submit" className="w-full" disabled={loading}>
                  Reset Password
                </Button>
              )
            )}  

          {/* Login Button for navigating to Login modal */}
          {status && (
            <Button variant="outline" className="w-full mt-2" onClick={() => {
              onClose();
              openLoginModal();
            }}>
              Go to Login
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPassword;