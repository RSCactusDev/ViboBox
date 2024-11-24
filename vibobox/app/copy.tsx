import Image from "next/image";
import { Button } from "@/components/ui/button" 
import { Login} from "@/components/Login_first"
import { LogOut } from "@/components/LogoutButton"
import { auth } from "@/config/auth"
import ParticlesBackground from '@/components/ParticlesBackground';
import { Card } from "@/components/ui/card";
import  NavBar from "@/components/NavBar"
import Footer from "@/components/Footer";

export default async function Home() {

  const session = await auth()

  return (
    <main className="relative z-10">
      {/* {session ? <LogOut /> : <Login />}
      {session ? <p>Signed in as {session.user?.email}</p> : <p>Not signed in</p>} */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
       {/* Top black section */}
      {/*  <div
          className="absolute top-0 left-0 w-full h-[40%] bg-black"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)'
          }}a
        /> */}
      <Card className="absolute inset-0 h-screen w-full bg-gray-900/0 relative border-none ">
        {/* Top black section */}
        <div
          className="absolute top-0 left-0 w-full h-[70%] bg-black bg-opacity-20"
          style={{
           clipPath: 'polygon(0 0, 130% 0, 50% 100%, 0 30%)'
          }}
        />

        {/* Middle white section */}
        <div
          className="absolute top-[30%] left-0 w-full h-[80%] bg-opacity-20 mt-2"
          style={{
            clipPath: 'polygon(0 0, 100% 30%, 100% 100%, 0 70%)'
          }}
        />

        {/* Bottom black section with sharp diagonal */}
        <div
          className="absolute bottom-0 left-0 w-full h-[45%] bg-black bg-opacity-20"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 0 65%)'
          }}
        />

        {/* Content overlay */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold">Top Section</h2>
          </div>
          <div className="text-black text-center">
            <p>Middle Content</p>
          </div>
          <div className="text-white text-center">
            <p>Bottom Section</p>
          </div>
        </div>
      </Card>
      {/* <NavBar  /> */}
      <div className="flex-grow">
      </div>
      <Footer className="relative z-20" />
    </main>
  );
}
