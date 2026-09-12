import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import LogoWall from '@/components/home/LogoWall';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import ReviewsSlider from '@/components/home/ReviewsSlider';
import ProductGrid from '@/components/home/ProductGrid';
import RecentlyDelivered from '@/components/home/RecentlyDelivered';
import LocationsGrid from '@/components/home/LocationsGrid';
import SeoJsonLd from '@/components/seo/SeoJsonLd';
import { SITE_URL, toAbsoluteUrl } from '@/lib/seo';

export default function Home() {
  const title = 'Shipping Containers for Sale Nationwide | Containers Exchange';
  const description = 'Buy new and used shipping containers nationwide. Find local inventory and pricing by ZIP code, with delivery from 60+ depot locations.';
  const image = toAbsoluteUrl('/images/hero/depot-operations.png');

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <SeoJsonLd data={{ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', name: 'Containers Exchange', url: SITE_URL }, { '@type': 'WebSite', name: 'Containers Exchange', url: SITE_URL }] }} />
      <HeroSection />
      <TrustSection />
      <HowItWorks />
      <ProductGrid />
      <LocationsGrid />
      <LogoWall />
      <RecentlyDelivered />
      <ReviewsSlider />
    </div>
  );
}
