  'use client'

  import { useState } from 'react';
  import { useEffect, useRef } from 'react';
  import { useRouter, usePathname  } from "next/navigation"; 
  import { signIn } from "next-auth/react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Spinner } from './Spinner';
  import axios from 'axios';
  import { useModalStore } from '@/store/modalStore'

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  import { Mail, Lock, User, ArrowLeft } from 'lucide-react'

  export default function AuthModals() {
    const isLoginOpen = useModalStore((state) => state.isLoginOpen);
    const openLoginModal = useModalStore((state) => state.openLoginModal);
    const closeLoginModal = useModalStore((state) => state.closeLoginModal);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const successMessage = useModalStore((state) => state.successMessage);
    const setSuccessMessage = useModalStore((state) => state.setSuccessMessage);
    const failedMessage = useModalStore((state) => state.failedMessage);
    const setFailedMessage = useModalStore((state) => state.setFailedMessage);

    const pathname = usePathname();

    const resetStates = () => {
      setRegistrationSuccess(false);
      setIsSuccess(false);
      setStatus('');
      setLoading(false);
      setEmail('');
      setPassword('');
      setError('');
      setName('');
      setShowForgotPassword(false);
    };

    useEffect(() => {
      if (!isLoginOpen) resetStates(); 
      setSuccessMessage(null);
      setFailedMessage(null)
    }, [isLoginOpen]);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isLoginOpen) {
        const timer = setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.blur(); // Ensure the input isn't focused on modal open
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }, [isLoginOpen]);


    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Invalid credentials');
            break;
          case 'AccountNotVerified':
            setError('Your account is not verified.');
            break;
          case 'OAuthAccountNotLinked':
            setError('This email is already in use.');
            break;
          default:
            setError('Something went wrong!');
        }
        console.error('Signin failed:', result.error);
      } else if (result?.ok) {
        /* router.push('/dashboard'); */
        closeLoginModal();
      }
    };


    const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      try {
        await axios.post("/api/auth/register", { name, email, password }); 
        setRegistrationSuccess(true);
        setStatus('<p><strong>Registration successful!</strong></p><p>Please confirm your account via the email we sent you.</p>');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
        console.error("Signup failed:", error);
      } finally {
        setLoading(false);
      }
    };
    

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setStatus('');
      try {
        const response = await axios.post('/api/auth/reset', { email });
        if (response.status === 200) {
          setIsSuccess(true);
          setStatus(
            '<p><strong>Email Sent Successfully!</strong></p> <p>Please check your inbox for a message from us. Follow the instructions in the email to reset your password. If you don’t see it within a few minutes, remember to check your spam or junk folder.</p>'
          );
        } else {
          setIsSuccess(false);
          setStatus('<p><strong>Failed to send email.</strong></p> <p>PLease try again in 5 minutes</p>');
        }
      } catch (error) {
        setIsSuccess(false);
        setStatus('Failed to send email. Please try again in 5 minutes.');

      } finally {
        setLoading(false);
      }
    };
  

    const handleGoogleAuth = async  (action: 'login' | 'register') => {
      setLoading(true);
      const result = await signIn("google", { 
        redirect: false,
        callbackUrl: pathname || '/',
       });
      setLoading(false);
      if (result && !result.error) {
        router.push(result.url || pathname || '/'); 
      } else {
        console.error("Google Sign-in failed:", result?.error);
      }
    };


    const GoogleButton = ({ action }: { action: 'login' | 'register' }) => (
      <>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={() => handleGoogleAuth(action)} className="w-full">
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          {action === 'login' ? 'Login' : 'Register'} with Google
        </Button>
      </>
    )

    return (
      <div className="flex space-x-6 items-center">
        <Dialog   
          open={isLoginOpen} 
          onOpenChange={(open) => (open ? openLoginModal() : closeLoginModal())}
        >
          <DialogTrigger asChild>
            <span className="text-black font-semibold hover:underline cursor-pointer">Login</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{showForgotPassword ? 'Forgot Password' : 'Login'}</DialogTitle>
              <DialogDescription>
                {showForgotPassword 
                  ? 'Enter your email to receive a password reset link.' 
                  : 'Enter your credentials to access your account.'}
              </DialogDescription>
            </DialogHeader>
            {successMessage ? (
                <div className="text-green-600 font-bold mb-4">
                  {successMessage}
                </div>
              ): (
                <div className="text-red-600 font-bold mb-4">
                  {failedMessage}
                </div>
              )}
            {showForgotPassword ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-password-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-8"
                    required
                  />
                  </div>
                  
                </div>
              

                {status && (
                    <p
                      className={`text-sm ${isSuccess ? 'text-green-600' :'text-red-600'}`}
                      dangerouslySetInnerHTML={{ __html: status }}
                    />
                )}

                
                
                  
                {loading ? (
                    <div className="flex flex-col items-center">
                    <Spinner /> 
                    <p className="mb-2">Please wait...</p> 
                    
                    </div>
                ) : (
                  <div className="flex justify-between">
                  <Button type="button" variant="ghost" onClick={() => {
                    setShowForgotPassword(false)
                    resetStates()
                  }} className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                  <Button type="submit" className="w-full" disabled={isSuccess}>
                    Send Reset Link
                  </Button>
                  </div>
                  
                )}
                
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={inputRef} 
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                
                {loading ? <Spinner /> : <><Button type="submit" className="w-full flex justify-center items-center"  disabled={loading}>
                  Login
                </Button> 
                <GoogleButton action="login" /></>}
                
                <Button type="button" variant="link" onClick={() => setShowForgotPassword(true)} className="w-full">
                  Forgot Password?
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog 
          open={isRegisterOpen} 
          onOpenChange={(open) => {
            setIsRegisterOpen(open);
            if (!open) resetStates();
          }}
        >
          <DialogTrigger asChild>
            <span className="text-black font-semibold hover:underline cursor-pointer">Register</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            {registrationSuccess ? ( <></> ) :(<><DialogTitle>Register</DialogTitle>
              <DialogDescription>
                Create a new account to get started.
              </DialogDescription></>)}
              
            </DialogHeader>
            {registrationSuccess ? (
              <div className="text-green-600" dangerouslySetInnerHTML={{ __html: status }} />
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="register-name" 
                      name="name" 
                      placeholder="John Doe" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="pl-8" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="register-email" 
                      name="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="register-password" 
                      name="password" 
                      type="password" 
                      placeholder="Your password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-8" 
                      required 
                    />
                  </div>
                </div>
                
                {loading ? (
                  <>
                    <Spinner /><p className="flex justify-center">Please wait ...</p>
                  </>
                ) : (
                  <>
                  <Button type="submit" className="w-full">Register</Button>
                  <GoogleButton action="register" />
                  </>
                )}
              </form>
            )}
            
        
          </DialogContent>
        </Dialog>
      </div>
    )
  }