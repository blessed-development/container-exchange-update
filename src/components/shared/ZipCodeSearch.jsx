import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import {
  getSavedSelectedLocation,
  saveSelectedLocation,
} from '@/lib/locationEngine';

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

  const savedLocation = getSavedSelectedLocation?.();

  const [zip, setZip] = useState(() => getZipValue(savedLocation));
  const [selectedLocation, setSelectedLocation] = useState(() => savedLocation || null);
  const [inputValue, setInputValue] = useState(() =>
    savedLocation ? formatLocationDisplay(savedLocation) : ''
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  const buildLocationPayload = (value, detected = null) => {
    const finalLocation = {
      postalCode: value,
      zip: value,
      zipCode: value,
      city: detected?.city || '',
      state: detected?.state || detected?.stateCode || '',
      stateCode: detected?.stateCode || detected?.state || '',
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

      const length = el.value.length;
      el.focus();
      el.setSelectionRange(length, length);
    });
  };

  useEffect(() => {
    const syncSavedLocation = (event) => {
      const nextLocation = event?.detail || getSavedSelectedLocation?.();
      const nextZip = getZipValue(nextLocation);

      if (!nextZip) return;

      setZip(nextZip);
      setSelectedLocation(nextLocation);
      setInputValue(formatLocationDisplay(nextLocation, nextZip));
    };

    syncSavedLocation();

    window.addEventListener('ce-location-change', syncSavedLocation);
    window.addEventListener('storage', syncSavedLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncSavedLocation);
      window.removeEventListener('storage', syncSavedLocation);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const detectZip = (value) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsDetecting(true);
    setSelectedLocation(null);
    setInputValue('Loading...');

    timerRef.current = setTimeout(() => {
      const detected = getLocationFromZip(value);

      if (!detected) {
        setIsDetecting(false);
        setInputValue(value);
        setSelectedLocation(null);
        setError('Location not found. Please check ZIP code.');
        moveCursorToEnd();
        return;
      }

      const finalLocation = buildLocationPayload(value, detected);
      const displayAddress = formatLocationDisplay(finalLocation, value);

      setZip(value);
      setSelectedLocation(finalLocation);
      setInputValue(displayAddress);
      setIsDetecting(false);
      setError('');

      moveCursorToEnd();
    }, 1000);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, '').slice(0, 5);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setError('');
    setSelectedLocation(null);
    setZip(digits);
    setInputValue(digits);

    if (digits.length === 5) {
      detectZip(digits);
    } else {
      setIsDetecting(false);
    }
  };

  const handleKeyDown = (e) => {
    const addressShowing =
      selectedLocation &&
      inputValue === formatLocationDisplay(selectedLocation, zip);

    if (!addressShowing) return;

    if (/^\d$/.test(e.key)) {
      e.preventDefault();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setZip(e.key);
      setInputValue(e.key);
      setSelectedLocation(null);
      setIsDetecting(false);
      setError('');
    }
  };

  const handleFocus = () => {
    moveCursorToEnd();
  };

  const canSubmit =
    isValidZipCode(zip) &&
    selectedLocation &&
    !isDetecting;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    saveSelectedLocation(selectedLocation);

    window.dispatchEvent(
      new CustomEvent('ce-location-change', {
        detail: selectedLocation,
      })
    );

    if (onZipSubmit) {
      onZipSubmit(zip, selectedLocation);
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
          disabled={!canSubmit}
          className={`font-semibold tracking-wider rounded-sm ${
            isHero
              ? 'h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base disabled:opacity-50 disabled:cursor-not-allowed'
              : 'h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed'
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
