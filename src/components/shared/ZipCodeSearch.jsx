import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import { getSavedSelectedLocation, saveSelectedLocation } from '@/lib/locationEngine';

const getZipValue = (location) =>
  location?.postalCode || location?.zip || location?.zipCode || '';

const getStateValue = (location) =>
  location?.stateCode || location?.state || '';

const formatLocationDisplay = (location, fallbackZip = '') => {
  const zip = getZipValue(location) || fallbackZip || '';
  const city = location?.city || '';
  const state = getStateValue(location);

  if (city && state && zip) return `${city}, ${state} ${zip}, USA`;
  if (city && zip) return `${city} ${zip}, USA`;
  if (zip) return zip;
  return '';
};

export default function ZipCodeSearch({
  variant = 'hero',
  onZipSubmit,
  className = '',
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const isHero = variant === 'hero';

  const saved = getSavedSelectedLocation?.();

  const [zip, setZip] = useState(() => getZipValue(saved));
  const [selectedLocation, setSelectedLocation] = useState(() => saved || null);
  const [inputValue, setInputValue] = useState(() =>
    saved ? formatLocationDisplay(saved) : ''
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

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

  const moveCursorToEnd = () => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  };

  useEffect(() => {
    const syncSavedLocation = (event) => {
      const next = event?.detail || getSavedSelectedLocation?.();
      const nextZip = getZipValue(next);

      if (nextZip) {
        setZip(nextZip);
        setSelectedLocation(next);
        setInputValue(formatLocationDisplay(next, nextZip));
      }
    };

    syncSavedLocation();

    window.addEventListener('ce-location-change', syncSavedLocation);
    window.addEventListener('storage', syncSavedLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncSavedLocation);
      window.removeEventListener('storage', syncSavedLocation);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const detectZip = (value) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsDetecting(true);
    setInputValue('Loading...');

    timerRef.current = setTimeout(() => {
      const loc = getLocationFromZip(value);

      if (!loc) {
        setIsDetecting(false);
        setSelectedLocation(null);
        setInputValue(value);
        setError('Location not found. Please check ZIP code.');
        return;
      }

      const finalLocation = buildLocationPayload(value, loc);
      const display = formatLocationDisplay(finalLocation, value);

      setSelectedLocation(finalLocation);
      setInputValue(display);
      setIsDetecting(false);
      setError('');
      moveCursorToEnd();
    }, 1000);
  };

  const handleChange = (e) => {
    const raw = e.target.value;

    setError('');

    const digits = raw.replace(/\D/g, '').slice(0, 5);

    setInputValue(digits);
    setZip(digits);
    setSelectedLocation(null);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (digits.length === 5) {
      detectZip(digits);
    } else {
      setIsDetecting(false);
    }
  };

  const handleKeyDown = (e) => {
    const isAddressShowing =
      selectedLocation && inputValue === formatLocationDisplay(selectedLocation, zip);

    if (!isAddressShowing) return;

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setZip(e.key);
      setInputValue(e.key);
      setSelectedLocation(null);
      setError('');
    }
  };

  const handleFocus = () => {
    moveCursorToEnd();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidZipCode(zip)) {
      setError('Enter a valid 5-digit ZIP code');
      return;
    }

    const loc = getLocationFromZip(zip);
    const finalLocation = selectedLocation || buildLocationPayload(zip, loc);

    saveSelectedLocation(finalLocation);

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
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="ENTER ZIP CODE"
            className={`pl-12 pr-4 border-0 rounded-sm ${
              isHero
                ? 'h-14 text-base bg-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:ring-primary'
                : 'h-12 bg-secondary placeholder:text-muted-foreground'
            }`}
          />
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
