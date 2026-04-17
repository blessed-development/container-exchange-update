import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import RentRTOSection from '@/components/home/RentRTOSection';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import ReviewsSlider from '@/components/home/ReviewsSlider';
import ProductGrid from '@/components/home/ProductGrid';
import RecentlyDelivered from '@/components/home/RecentlyDelivered';
import LocationsGrid from '@/components/home/LocationsGrid';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <RentRTOSection />
      <HowItWorks />
      <TrustSection />
      <ReviewsSlider />
      <ProductGrid />
      <RecentlyDelivered />
      <LocationsGrid />
    </div>
  );
}