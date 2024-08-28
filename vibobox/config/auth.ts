import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Google from "next-auth/providers/google"
import client from "@/lib/db"
import authConfig from "./auth.config"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: "ViboBOX", 
  }),
  session: { strategy: "jwt" },
  ...authConfig,
})

// Fix source https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility