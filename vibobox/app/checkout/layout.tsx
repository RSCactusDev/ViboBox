
import ParticlesBackground from '@/components/ParticlesBackground';
import  NavBar from "@/components/NavBar"


const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex items-center justify-center relative h-full w-full flex flex-col items-center pt-4 bg-[radial-gradient(ellipse_at_left,_#161b22,_#29446e)]'>
      {/* Particles in the background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      <NavBar/>
      
      {/* Content should appear in front */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">    
        {children}
      </div>
      <div className='text-grey pb-2 text-sm'>Copyright © 2024 ViboBox</div>
    </div>
  )
}

export default CheckoutLayout