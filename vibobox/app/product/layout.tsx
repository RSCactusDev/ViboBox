
  import ParticlesBackground from '@/components/ParticlesBackground';
  import '@/styles/product.css'; 
  import Link from 'next/link';
  import { BiShoppingBag } from "react-icons/bi";
  import { useCartStore } from '@/store/cartStore';
  import  NavBar from "@/components/NavBar"
  import Footer from "@/components/Footer";

  const ProductLayout = ({ children }: { children: React.ReactNode }) => {
    
    return ( 
      <div className='min-h-screen flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_left,_#161b22,_#29446e)]'>
        {/* Particles in the background */}
        
        <div className="absolute inset-0 z-0">
        
          <ParticlesBackground />
        </div> 
        <NavBar/> 
        {/* Content should appear in front */}
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center w-full">
        {children}
      </div>
      <Footer className='relative z-10 mt-3'/>
       {/*  <div className='relative z-10 text-grey py-2 text-sm text-center'>Copyright © 2024 ViboBox</div> */}
      </div>
    )
  }

  export default ProductLayout