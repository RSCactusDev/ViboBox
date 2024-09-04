
import ParticlesBackground from '@/components/ParticlesBackground';


const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative h-full w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_left,_#161b22,_#29446e)]'>
      {/* Particles in the background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      
      {/* Content should appear in front */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}

export default ProtectedLayout