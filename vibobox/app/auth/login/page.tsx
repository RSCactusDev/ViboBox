"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(""); 

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    
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
      console.error("Signin failed:", result.error);
    } else if (result?.ok) {
      router.push("/settings");
    }
  };

  return (
    <div>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Add this line */}
      <h1>Sign In</h1>
      <form onSubmit={handleSignin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          size="sm" 
          variant="link" 
          asChild 
          className="px-0 font-normal"
          >
            <Link href="/auth/reset">Forgot Pasword?</Link>
        </Button>
        <Button type="submit">Login </Button>
      </form>
    </div>
  );
};

export default Login;
