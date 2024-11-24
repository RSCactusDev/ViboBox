/* 
import { signIn } from "@/config/auth"
import { Button } from "@/components/ui/button"
export function Login() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <Button type="submit">Signin with Google</Button>
    </form>
  )
}  */

  "use client";  // Ensures the component is client-side rendered

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
      router.push("/settings");
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