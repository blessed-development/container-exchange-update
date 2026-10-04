import React from 'react';
import { useParams } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import LocationLandingPage from '@/pages/LocationLandingPage';
import { getLocationBySlug } from '@/data/locations';

const locationPrefix = 'buy-shipping-containers-';

export default function LocationPageRoute() {
  const { locationPath } = useParams();
  const slug = locationPath?.startsWith(locationPrefix)
    ? locationPath.slice(locationPrefix.length)
    : '';
  const location = getLocationBySlug(slug);

  if (!location || !location.imageReady) return <PageNotFound />;

  return <LocationLandingPage location={location} />;
}
