import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import { getSavedSelectedLocation, saveSelectedLocation } from '@/lib/locationEngine';
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
  const country = location?.country === 'US' || location?.country === 'USA'
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
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return getSavedSelectedLocation?.() || null;
  });

  const [zip, setZip] = useState(() => {
    const saved = getSavedSelectedLocation?.();
    return getZipValue(saved);
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);

    setZip(value);
    setError('');

    if (value.length >= 3) {
      const loc = getLocationFromZip(value);

      if (loc) {
        setSelectedLocation({
          postalCode: value,
          zip: value,
          zipCode: value,
          city: loc.city || '',
          state: loc.state || loc.stateCode || '',
          stateCode: loc.stateCode || loc.state || '',
          country: 'US',
          formattedAddress: formatLocationDisplay(
            {
              postalCode: value,
              city: loc.city || '',
              state: loc.state || loc.stateCode || '',
              stateCode: loc.stateCode || loc.state || '',
              country: 'US',
            },
            value
          ),
        });
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

    const loc = getLocationFromZip(zip);

    const finalLocation = {
      postalCode: zip,
      zip,
      zipCode: zip,
      city: loc?.city || selectedLocation?.city || '',
      state: loc?.state || loc?.stateCode || selectedLocation?.state || selectedLocation?.stateCode || '',
      stateCode: loc?.stateCode || loc?.state || selectedLocation?.stateCode || selectedLocation?.state || '',
      country: 'US',
    };

    finalLocation.formattedAddress = formatLocationDisplay(finalLocation, zip);
    finalLocation.displayName = finalLocation.formattedAddress;

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

  const isHero = variant === 'hero';

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
            className={`pl-12 pr-56 font-mono tracking-wider border-0 rounded-sm ${
              isHero
                ? 'h-14 text-lg bg-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:ring-primary'
                : 'h-12 bg-secondary text-secondary-foreground placeholder:text-muted-foreground'
            }`}
          />

          {locationDisplay && zip.length >= 3 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-primary whitespace-nowrap pointer-events-none"
            >
              {locationDisplay}
            </motion.span>
          )}

        </div>

        <Button
          type="submit"
          className={`font-semibold tracking-wider rounded-sm ${
            isHero
              ? 'h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base'
              : 'h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          <Search className="w-5 h-5 mr-2" />
          {isHero ? 'LOCATE INVENTORY' : 'FIND PRICING'}
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
