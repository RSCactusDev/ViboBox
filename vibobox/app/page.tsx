import Image from "next/image";
import { Button } from "@/components/ui/button" 
import { Login} from "@/components/Login"
import { LogOut } from "@/components/LogoutButton"
import { auth } from "@/config/auth"

export default async function Home() {

  const session = await auth()

  return (
    <main className="">
      {session ? <LogOut /> : <Login />}
      {session ? <p>Signed in as {session.user?.email}</p> : <p>Not signed in</p>}
    </main>
  );
}
