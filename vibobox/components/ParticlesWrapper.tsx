"use client";

import { usePathname } from 'next/navigation';
import ParticlesBackground from '@/components/ParticlesBackground';

const ParticlesWrapper = () => {
  const pathname = usePathname();
  const showParticles = pathname !== '/product/box';

  return showParticles ? <ParticlesBackground /> : null;
};

export default ParticlesWrapper;
