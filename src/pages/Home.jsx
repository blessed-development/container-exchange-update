import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import BuySection from '@/components/home/BuySection';
import ShopBySize from '@/components/home/ShopBySize';
import WhyBuyFromUs from '@/components/home/WhyBuyFromUs';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BuySection />
      <ShopBySize />
      <WhyBuyFromUs />
      <HowItWorks />
      <TrustSection />
      <TestimonialsSection />
    </div>
  );
}