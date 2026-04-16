import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import RentRTOSection from '@/components/home/RentRTOSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <RentRTOSection />
      <FeaturedProducts />
      <HowItWorks />
      <TrustSection />
      <TestimonialsSection />
    </div>
  );
}