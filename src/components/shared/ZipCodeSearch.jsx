import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import {
  getSavedSelectedLocation,
  saveSelectedLocation,
} from '@/lib/locationEngine';
import { motion } from 'framer-motion';

const getZipValue = (location) => {
  return location?.postalCode || location?.zip || location?.zipCode || '';
};

const getStateValue = (location) => {
  return location?.stateCode || location?.state || '';
};

const formatLocationDisplay = (location, fallbackZip = '') => {
  const zip = getZipValue(location) || fallbackZip || '';
  const city = location?.city || '';
  const state = getStateValue(location);
  const country =
    location?.country === 'US' || location?.country === 'USA'
      ? 'USA'
      : location?.country || 'USA';

  if (city && state && zip) return `${city}, ${state} ${zip}, ${country}`;
  if (city && zip) return `${city} ${zip}, ${country}`;
  if (city && state) return `${city}, ${state}`;
  if (zip) return zip;
  return '';
};

export default function ZipCodeSearch({
  variant = 'hero',
  onZipSubmit,
  className = '',
}) {
  const navigate = useNavigate();
  const isHero = variant === 'hero';

  const [selectedLocation, setSelectedLocation] = useState(() => {
    return getSavedSelectedLocation?.() || null;
  });

  const [zip, setZip] = useState(() => {
    const saved = getSavedSelectedLocation?.();
    return getZipValue(saved);
  });

  const [error, setError] = useState('');

  const locationDisplay = useMemo(() => {
    return formatLocationDisplay(selectedLocation, zip);
  }, [selectedLocation, zip]);

  useEffect(() => {
    const syncSavedLocation = (event) => {
      const saved = event?.detail || getSavedSelectedLocation?.();
      const savedZip = getZipValue(saved);

      if (savedZip) {
        setZip(savedZip);
        setSelectedLocation(saved);
      }
    };

    syncSavedLocation();

    window.addEventListener('ce-location-change', syncSavedLocation);
    window.addEventListener('storage', syncSavedLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncSavedLocation);
      window.removeEventListener('storage', syncSavedLocation);
    };
  }, []);

  const buildLocationPayload = (value, detectedLocation = null) => {
    const finalLocation = {
      postalCode: value,
      zip: value,
      zipCode: value,
      city: detectedLocation?.city || selectedLocation?.city || '',
      state:
        detectedLocation?.state ||
        detectedLocation?.stateCode ||
        selectedLocation?.state ||
        selectedLocation?.stateCode ||
        '',
      stateCode:
        detectedLocation?.stateCode ||
        detectedLocation?.state ||
        selectedLocation?.stateCode ||
        selectedLocation?.state ||
        '',
      country: 'US',
    };

    finalLocation.formattedAddress = formatLocationDisplay(finalLocation, value);
    finalLocation.displayName = finalLocation.formattedAddress;

    return finalLocation;
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);

    setZip(value);
    setError('');

    if (value.length >= 3) {
      const detectedLocation = getLocationFromZip(value);

      if (detectedLocation) {
        setSelectedLocation(buildLocationPayload(value, detectedLocation));
      } else {
        setSelectedLocation(null);
      }
    } else {
      setSelectedLocation(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidZipCode(zip)) {
      setError('Enter a valid 5-digit ZIP code');
      return;
    }

    const detectedLocation = getLocationFromZip(zip);
    const finalLocation = buildLocationPayload(zip, detectedLocation);

    saveSelectedLocation(finalLocation);
    setZip(finalLocation.postalCode);
    setSelectedLocation(finalLocation);

    window.dispatchEvent(
      new CustomEvent('ce-location-change', {
        detail: finalLocation,
      })
    );

    if (onZipSubmit) {
      onZipSubmit(zip, finalLocation);
    } else {
      navigate(`/inventory?zip=${encodeURIComponent(zip)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div
        className={`flex flex-col sm:flex-row gap-3 ${
          isHero ? 'max-w-xl' : ''
        }`}
      >
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45 z-10 transition-colors duration-300 group-focus-within:text-white/70">
            <MapPin className="w-5 h-5" />
          </div>

          <Input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={handleZipChange}
            placeholder="Enter ZIP code"
            className={`pl-12 pr-5 border rounded-xl transition-all duration-300 ${
              locationDisplay && zip.length >= 3
                ? 'text-transparent caret-transparent'
                : 'text-white'
            } ${
              isHero
                ? 'h-14 text-[15px] bg-black/30 border-white/10 backdrop-blur-md placeholder:text-white/30 focus:bg-black/40 focus:border-white/20 focus:ring-0'
                : 'h-12 bg-secondary placeholder:text-muted-foreground'
            }`}
          />

          {locationDisplay && zip.length >= 3 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-12 right-5 top-1/2 -translate-y-1/2 text-[14px] font-medium text-white/90 tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none"
            >
              {locationDisplay}
            </motion.span>
          )}
        </div>

        <Button
          type="submit"
          className={`font-semibold rounded-xl transition-all duration-300 ${
            isHero
              ? 'h-14 px-8 bg-primary hover:bg-primary/95 hover:scale-[1.01] text-primary-foreground text-[15px] tracking-[0.01em] shadow-[0_12px_35px_rgba(255,72,0,0.22)]'
              : 'h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          <Search className="w-5 h-5 mr-2" />
          {isHero ? 'Locate Inventory' : 'Find Pricing'}
        </Button>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-medium mt-2">
          {error}
        </p>
      )}
    </form>
  );
}
