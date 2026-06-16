import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import { getSavedSelectedLocation, saveSelectedLocation } from '@/lib/locationEngine';
import { motion } from 'framer-motion';

const getZipValue = (location) =>
  location?.postalCode || location?.zip || location?.zipCode || '';

const getStateValue = (location) =>
  location?.stateCode || location?.state || '';

const formatLocationDisplay = (location, fallbackZip = '') => {
  const zip = getZipValue(location) || fallbackZip || '';
  const city = location?.city || '';
  const state = getStateValue(location);
  const country = 'USA';

  if (city && state && zip) return `${city}, ${state} ${zip}, ${country}`;
  if (city && zip) return `${city} ${zip}, ${country}`;
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
  const detectTimer = useRef(null);

  const [selectedLocation, setSelectedLocation] = useState(() => {
    return getSavedSelectedLocation?.() || null;
  });

  const [zip, setZip] = useState(() => {
    const saved = getSavedSelectedLocation?.();
    return getZipValue(saved);
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  const locationDisplay = useMemo(() => {
    if (isDetecting) return 'Loading...';
    return formatLocationDisplay(selectedLocation, zip);
  }, [isDetecting, selectedLocation, zip]);

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
      if (detectTimer.current) clearTimeout(detectTimer.current);
    };
  }, []);

  const buildLocationPayload = (value, loc = null) => {
    const finalLocation = {
      postalCode: value,
      zip: value,
      zipCode: value,
      city: loc?.city || '',
      state: loc?.state || loc?.stateCode || '',
      stateCode: loc?.stateCode || loc?.state || '',
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
    setSelectedLocation(null);

    if (detectTimer.current) clearTimeout(detectTimer.current);

    if (value.length !== 5) {
      setIsDetecting(false);
      return;
    }

    setIsDetecting(true);

    detectTimer.current = setTimeout(() => {
      const loc = getLocationFromZip(value);

      if (loc) {
        setSelectedLocation(buildLocationPayload(value, loc));
      }

      setIsDetecting(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidZipCode(zip)) {
      setError('Enter a valid 5-digit ZIP code');
      return;
    }

    const loc = getLocationFromZip(zip);
    const finalLocation = buildLocationPayload(zip, loc || selectedLocation);

    saveSelectedLocation(finalLocation);
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
      <div className={`flex flex-col sm:flex-row gap-3 ${isHero ? 'max-w-xl' : ''}`}>
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            <MapPin className="w-5 h-5" />
          </div>

          <Input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={handleZipChange}
            placeholder="ENTER ZIP CODE"
            className={`pl-12 pr-4 font-mono tracking-wider border-0 rounded-sm ${
              locationDisplay && zip.length === 5 ? 'text-transparent caret-white' : ''
            } ${
              isHero
                ? 'h-14 text-lg bg-white/10 placeholder:text-white/30 focus:bg-white/15 focus:ring-primary'
                : 'h-12 bg-secondary placeholder:text-muted-foreground'
            }`}
          />

          {locationDisplay && zip.length === 5 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`absolute left-12 right-4 top-1/2 -translate-y-1/2 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none ${
                isDetecting ? 'text-white/55' : 'text-primary'
              }`}
            >
              {locationDisplay}
            </motion.span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isDetecting}
          className={`font-semibold tracking-wider rounded-sm ${
            isHero
              ? 'h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base'
              : 'h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          <Search className="w-5 h-5 mr-2" />
          {isDetecting ? 'LOADING...' : isHero ? 'LOCATE INVENTORY' : 'FIND PRICING'}
        </Button>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-mono mt-2">
          {error}
        </p>
      )}
    </form>
  );
}
