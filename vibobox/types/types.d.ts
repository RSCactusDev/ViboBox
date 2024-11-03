declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    role?: string;
    verified?: boolean;
  }
  /**
   * id:
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
   
  interface Account {}
 
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      role: string,
    } & DefaultSession["user"]
  }

}
 
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt"
 
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
  }


} 

export interface CartItem {
  variant: string;
  color: string;
  quantity: number;
  // Add other properties as needed
}


declare module 'react-image-gallery' {
  const ImageGallery: any; // You can replace 'any' with a more specific type if needed
  export default ImageGallery;
}