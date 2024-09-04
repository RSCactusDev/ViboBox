import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs";
import { getUserModel } from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import { AuthError } from "next-auth";

export default { 
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, 
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new AuthError("Missing email or password");
        }

        try {
          await connectToDatabase();
          const User = await getUserModel();
          
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password as string);

          if (isPasswordValid) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              verified: user.verified
            };
          } else {
            throw new Error("Invalid password");
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;