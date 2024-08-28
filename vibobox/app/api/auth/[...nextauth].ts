import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      await connectToDatabase();
      if (session.user) {
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser && dbUser._id) {
          session.user.id = dbUser._id.toString();
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      await connectToDatabase();
      if (account && user.email) {
        const dbUser = await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            email: user.email,
            googleId: account.providerAccountId,
          },
          { upsert: true, new: true }
        );
        if (dbUser && dbUser._id) {
          user.id = dbUser._id.toString();
        }

      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

export default NextAuth(authOptions);
