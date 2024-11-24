import Image from "next/image";
import Link from 'next/link';
import '@/styles/product.css';
import { ChevronRight, QrCode, Gift, Palette, Share2, Mail, Gamepad, Film } from "lucide-react"
import { Button } from "@/components/ui/button" 
import { Login} from "@/components/Login_first"
import { LogOut } from "@/components/LogoutButton"
import { auth } from "@/config/auth"
import ParticlesBackground from '@/components/ParticlesBackground';
import { Card, CardContent  } from "@/components/ui/card";
import  NavBar from "@/components/NavBar"
import Footer from "@/components/Footer";
import ResetModalHandler from "@/components/ResetModalHandler";
import VerifyHandler from "@/components/VerifyHandler";

export default async function Home() {

  const session = await auth()


  return (
    <main className="relative z-20">
      {/* {session ? <LogOut /> : <Login />}
      {session ? <p>Signed in as {session.user?.email}</p> : <p>Not signed in</p>} */}
      <div className="absolute inset-0 z-10" >
        <ParticlesBackground />
      </div>
      <NavBar className="relative z-30 "  />
      <VerifyHandler />
      <ResetModalHandler />
      <Card className="absolute inset-0  w-full bg-gray-900/0 relative border-none ">
        {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b ">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-blue-100 tracking-tighter sm:text-5xl xl:text-6xl/none">
                VIboBox: Where Tradition Meets Technology
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Experience gift-giving reimagined with our premium presentation boxes featuring unique QR technology and
                timeless design.
              </p>
              <div className="space-x-4">
                <Link href="/product/box" passHref>
                  <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                    Shop Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
               <Link href="/product/box" passHref>
                <Button variant="outline" size="lg">
                    Learn More
                  </Button>
               </Link>
                
              </div>
            </div>
            <div className="relative flex items-center justify-center max-w-[600px] max-h-[400px]  bg-white bg-opacity-20 rounded-lg">
              <Image
                src="/images/imagesBox_test1.svg"
                alt="VIboBox Open Display"
                width={600}
                height={400}
                className="relative rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

       {/* Features Section */}
       <section className="w-full py-12 md:py-24 lg:py-32  bg-blue-950 bg-opacity-25">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl text-blue-100 font-bold tracking-tighter text-center mb-12">Features that Delight</h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card className="bg-white bg-opacity-20 border-none shadow-md" >
              <CardContent className="p-6 space-y-2 ">
                <QrCode className="h-12 w-12 text-pink-700" />
                <h3 className="text-2xl font-bold ">Smart QR Integration</h3>
                <p className="text-black dark:text-gray-400">
                  Embed personalized messages, photos, or videos through our unique QR technology.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20 border-none shadow-md">
              <CardContent className="p-6 space-y-2">
                <Gift className="h-12 w-12 text-pink-700" />
                <h3 className="text-2xl font-bold">Premium Design</h3>
                <p className="text-black dark:text-gray-400">
                  Crafted with high-quality materials and featuring  diamond texture pattern.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20 border-none shadow-md">
              <CardContent className="p-6 space-y-2">
                <Share2 className="h-12 w-12 text-pink-700" />
                <h3 className="text-2xl font-bold">Shareable Moments</h3>
                <p className="text-black dark:text-gray-400">
                  Create lasting memories that can be shared and revisited through our digital integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

        {/* Use Cases Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12  text-blue-100">Endless Possibilities with VIboBox</h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card className="bg-white bg-opacity-20 border-none shadow-md">
              <CardContent className="p-6 space-y-2">
                <Mail className="h-12 w-12 text-pink-600" />
                <h3 className="text-2xl font-bold ">Invitations with a Personal Touch</h3>
                <p className="text-black dark:text-gray-400">
                  Send digital wedding or party invitations with photos, videos, and personal messages for unforgettable celebrations.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20 border-none shadow-md">
              <CardContent className="p-6 space-y-2">
                <Gamepad className="h-12 w-12 text-pink-600" />
                <h3 className="text-2xl font-bold">A Game of Surprises</h3>
                <p className="text-black dark:text-gray-400">
                  Create an interactive experience where recipients play a game to reveal various gifts, adding an element of fun and surprise.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20 border-none shadow-md">
              <CardContent className="p-6 space-y-2">
                <Film className="h-12 w-12 text-pink-600" />
                <h3 className="text-2xl font-bold">Memory Vault</h3>
                <p className="text-black dark:text-gray-400">
                  Unlock a treasure trove of memories—pictures, videos, and heartfelt messages from special occasions worth revisiting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

           {/* Interactive Game Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 bg-opacity-50 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">A Game of Surprises - Interactive Gift Selection</h2>
              <p className="text-gray-400">
                Scan the QR code to unlock a unique gift selection experience. Choose from various exciting options and surprise
                your loved ones with memorable experiences.
              </p>
              <div className="space-y-2">
              <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">1</div>
                  <p>Create a 9 gifts </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">2</div>
                  <p>Scan the unique QR code in your VIboBox</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">3</div>
                  <p>Browse through exciting gift options</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">4</div>
                  <p>Select and reveal your special experience</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="QR Code Scan"
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Gift Selection Grid"
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Experience Preview"
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Congratulations Screen"
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>


          {/* Color Variants Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Available Colors</h2>
            <p className="text-gray-500 dark:text-gray-400">Choose the perfect VIboBox that matches your style</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 items-center justify-center max-w-3xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="relative aspect-square overflow-hidden rounded-lg">
              <div className="bg-white bg-opacity-20 max-w-[400px] max-h-[340px] rounded-lg">
                <h3 className="font-bold text-xl pt-3">Classic Brown</h3>
                  <Image
                    src="/images/variants/clasic_brown.svg"
                    alt="Brown VIboBox"
                    width={400}
                    height={320}
                    className="object-cover shadow-xl"
                  />
              </div>
              
              </div>
            </div>
            <div className="space-y-4 text-center">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <div className=" bg-white bg-opacity-20 max-w-[400px] max-h-[340px] rounded-lg">
                <h3 className="font-bold text-xl pt-3">Modern Pink & Black</h3>
                <Image
                    src="/images/variants/modern_pink_black.svg"
                    alt="Pink and Black VIboBox"
                    width={400}
                    height={320}
                    className="object-cover shadow-xl"
                  />
                </div> 
              </div>
            </div>
            <div className="space-y-4 text-center">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <div className=" bg-white bg-opacity-20 max-w-[400px] max-h-[340px] rounded-lg">
                <h3 className="font-bold text-xl pt-3">Khaki</h3>
                <Image
                    src="/images/variants/khaki.svg"
                    alt="Pink and Black VIboBox"
                    width={400}
                    height={320}
                    className="object-cover shadow-xl"
                  />
                </div> 
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <div className=" bg-white bg-opacity-20 max-w-[400px] max-h-[340px] rounded-lg">
                <h3 className="font-bold text-xl pt-3">Blue&Gold</h3>
                <Image
                    src="/images/variants/blue_gold.svg"
                    alt="Pink and Black VIboBox"
                    width={400}
                    height={320}
                    className="object-cover shadow-xl"
                  />
                </div> 
              </div>
            </div>
          </div>
        </div>
               
    <div className="mt-6 flex justify-center space-y-4 text-center ">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <div className=" bg-white bg-opacity-20 max-w-[400px] max-h-[360px] rounded-lg">
                <h3 className="font-bold text-xl pt-3">Ruby Glow</h3>
                <Image
                    src="/images/variants/red_box.svg"
                    alt="Pink and Black VIboBox"
                    width={400}
                    height={320}
                    className="object-cover shadow-xl"
                  />
                </div> 
              </div>
    </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-950 dark:bg-pink-900 bg-opacity-20">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter text-blue-100">Ready to Elevate Your Gift-Giving?</h2>
            <p className="text-blue-100">
              Join thousands of satisfied customers who have transformed their special moments with VIboBox.
            </p>
            <Link href="/product/box" passHref>
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                Order Your VIboBox Now
              </Button>
            </Link> 
            
          </div>
        </div>
      </section>
      </Card>
    
      <div className="flex-grow">
      </div>
      <Footer className="relative z-20" />
    </main>
  );
}
