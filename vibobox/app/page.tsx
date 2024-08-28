import Image from "next/image";
import { Button } from "@/components/ui/button" 
import { SignIn} from "@/components/sign-in"
import { SignOut } from "@/components/signout-button"
import { auth } from "@/config/auth"

export default async function Home() {

  const session = await auth()
 


  return (
    <main className="">
      {session ? <SignOut /> : <SignIn />}
      {session ? <p>Signed in as {session.user?.email}</p> : <p>Not signed in</p>}
    </main>
  );
}
