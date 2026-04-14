import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import BuySection from '@/components/home/BuySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TrustSection from '@/components/home/TrustSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BuySection />
      <FeaturedProducts />
      <HowItWorks />
      <TrustSection />
      <TestimonialsSection />
    </div>
  );
}