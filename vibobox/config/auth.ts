import NextAuth, { type DefaultSession } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Google from "next-auth/providers/google"
import client from "@/lib/db"
import authConfig from "./auth.config"
import { getUserById, getUserModel } from "@/models/User"
import connectToDatabase  from "@/lib/mongodb"
import mongoose from "mongoose"




 
export const { handlers, signIn, signOut, auth } = NextAuth({
  events: {
    async linkAccount({ user, account }) {
      await connectToDatabase();
      const User = await getUserModel();

      // Check if the account already exists in the Accounts collection
      const existingAccount = await mongoose.models.Accounts.findOne({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (!existingAccount) {
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
          existingUser.googleId = account.providerAccountId;
          existingUser.emailVerified = new Date();
          await existingUser.save();
        }
      }
    },
  },


  callbacks: {
    async signIn({ user, account }) {
      // Simplified: Only handle special cases; basic linking is done automatically
      await connectToDatabase();
      const User = await getUserModel();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          existingUser.googleId = account?.providerAccountId;
          existingUser.emailVerified = existingUser.emailVerified || new Date();
          await existingUser.save();
        }
        return true;
      }

      // For credentials, ensure the account is verified
      if (!user.verified ) {
        return "/auth/login?error=AccountNotVerified";
      }
      
      return true;
    },
 
    async session({ session, token, user }) {
      if (token.role && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const User = await getUserModel();
    
        let existingUser = await User.findOne({ email: token.email });
    
        if (!existingUser) {
          console.log("Creating a new user with role 'user'");
          existingUser = await User.create({
            name: profile?.name,
            email: profile?.email,
            googleId: account.providerAccountId,
            image: profile?.picture,
            role: 'user', // Assign default role
            verified: false,
            emailVerified: null,
          });
        } else {
          console.log("User exists. Ensuring role and verified fields are set.");
          if (!existingUser.verified || !existingUser.role) {
            existingUser.verified = false;
            existingUser.role = existingUser.role || 'user';
            existingUser.image = profile?.picture || existingUser.image;
            await existingUser.save();
          }
        }
    
        console.log("User created/updated with role:", existingUser.role);
    
        token.id = existingUser._id.toString();
        token.role = existingUser.role;
      }

      // Adds role to the token by login with crediantals
      if (!token.sub) return token;

      

      const existingUser = await getUserById(token.sub);
      
      if (!existingUser) {
        return token;
      }
      
      token.role = existingUser.role;
      token.id = token.sub;    
    
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },
  adapter: MongoDBAdapter(client, {
    databaseName: "ViboBOX", 
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  ...authConfig,
})

// Fix source https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility