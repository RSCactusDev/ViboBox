"use client";  

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Login() {
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    // Trigger the Google sign-in process
    const result = await signIn("google", { redirect: false });

    if (!result?.error) {
      // If there's no error, redirect to /settings
      /* router.push("/dashboard"); */
    } else {
      // Handle the error (optional)
      console.error("Sign-in failed:", result.error);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleGoogleSignIn(); }}>
      <Button type="submit">Sign in with Google</Button>
    </form>
  );
}