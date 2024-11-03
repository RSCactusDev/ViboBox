"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GrHomeRounded } from "react-icons/gr";
import { SlHome } from "react-icons/sl";
import { FcHome } from "react-icons/fc";
import { IoSettingsSharp } from "react-icons/io5";
import { UserButton } from "@/components/auth/user-button";



export const Navbar = () => {
  const pathname = usePathname()

  return (
      <nav className="bg-white bg-opacity-20  flex justify-between items-center p-4 mb-4 rounded-xl w-[400px] shadow-md">
          <div className="flex gap-x-2">
            <Button 
              asChild
            variant={pathname ==="/dashboard" ? "default" : "ghost"}
            >
              <Link href="/dashboard"><FcHome size={22}/></Link>
            </Button>
            <Button 
              asChild
            variant={pathname ==="/settings" ? "default" : "outline"}
            >
              <Link href="/settings"><IoSettingsSharp size={22}/></Link>
            </Button>
          </div>
          <UserButton />
      </nav>
  )
}

