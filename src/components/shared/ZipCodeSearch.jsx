import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import {
  getSavedSelectedLocation,
  saveSelectedLocation,
} from '@/lib/locationEngine';

const LOCATION_ERROR =
  "Couldn't locate your ZIP code in the US or Canada. Try entering it manually or select a nearby ZIP code.";

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
  placeholder = 'Enter your zipcode',
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  const savedLocation = getSavedSelectedLocation?.();

  const [zip, setZip] = useState(() => getZipValue(savedLocation));
  const [selectedLocation, setSelectedLocation] = useState(
    () => savedLocation || null
  );
  const [inputValue, setInputValue] = useState(() =>
    savedLocation ? formatLocationDisplay(savedLocation) : ''
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  const moveCursorToEnd = () => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  };

  const persistLocation = (location) => {
    saveSelectedLocation(location);

    window.dispatchEvent(
      new CustomEvent('ce-location-change', {
        detail: location,
      })
    );
  };

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

      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const detectZip = (value) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsDetecting(true);
    setSelectedLocation(null);
    setInputValue('Loading...');

    timerRef.current = setTimeout(() => {
      const detected = getLocationFromZip(value);

      if (!detected) {
        setIsDetecting(false);
        setInputValue(value);
        setSelectedLocation(null);
        setError(LOCATION_ERROR);
        moveCursorToEnd();
        return;
      }

      const finalLocation = buildLocationPayload(value, detected);

      setZip(value);
      setSelectedLocation(finalLocation);
      setInputValue(formatLocationDisplay(finalLocation, value));
      setIsDetecting(false);
      setError('');

      moveCursorToEnd();
    }, 1000);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const pureZip = rawValue.trim();

    if (timerRef.current) clearTimeout(timerRef.current);

    setError('');
    setInputValue(rawValue);

    const digits = rawValue.match(/\d/g)?.join('').slice(0, 5) || '';
    setZip(digits);

    if (selectedLocation) setSelectedLocation(null);

    setIsDetecting(false);

    if (/^\d{5}$/.test(pureZip)) {
      detectZip(pureZip);
    }
  };

  const handleKeyDown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (selectedLocation) {
      setSelectedLocation(null);
      setIsDetecting(false);
      setError('');
    }
  };

  const handleFocus = () => {
    moveCursorToEnd();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(LOCATION_ERROR);
      return;
    }

    setError('');
    setIsDetecting(true);
    setInputValue('Detecting location…');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          const data = await response.json();

          const detectedZip =
            data.postcode ||
            data.postalCode ||
            data.localityInfo?.administrative?.find((x) => x.order === 10)
              ?.name ||
            '';

          const city =
            data.city || data.locality || data.principalSubdivision || '';

          const state =
            data.principalSubdivisionCode?.replace('US-', '') ||
            data.principalSubdivision ||
            '';

          if (!detectedZip) {
            setIsDetecting(false);
            setInputValue('');
            setSelectedLocation(null);
            setError(LOCATION_ERROR);
            return;
          }

          const finalLocation = {
            postalCode: detectedZip,
            zip: detectedZip,
            zipCode: detectedZip,
            city,
            state,
            stateCode: state,
            country: 'US',
          };

          finalLocation.formattedAddress = formatLocationDisplay(
            finalLocation,
            detectedZip
          );
          finalLocation.displayName = finalLocation.formattedAddress;

          setZip(detectedZip);
          setSelectedLocation(finalLocation);
          setInputValue(finalLocation.formattedAddress);
          setIsDetecting(false);
          setError('');

          persistLocation(finalLocation);
          moveCursorToEnd();

          if (onZipSubmit) {
            onZipSubmit(detectedZip, finalLocation);
          }
        } catch {
          setIsDetecting(false);
          setInputValue('');
          setSelectedLocation(null);
          setError(LOCATION_ERROR);
        }
      },
      () => {
        setIsDetecting(false);
        setInputValue('');
        setSelectedLocation(null);
        setError(LOCATION_ERROR);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const canSubmit =
    isValidZipCode(zip) &&
    Boolean(selectedLocation) &&
    !isDetecting;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canSubmit) return;

    persistLocation(selectedLocation);

    if (onZipSubmit) {
      onZipSubmit(zip, selectedLocation);
    } else {
      navigate(`/inventory?zip=${encodeURIComponent(zip)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div
        className={
          isCompact
            ? 'flex flex-col gap-2.5 w-full'
            : `flex flex-col sm:flex-row gap-3 ${isHero ? 'max-w-xl' : ''}`
        }
      >
        <div className="relative w-full min-w-0">
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
              isCompact ? 'text-white/25' : 'text-white/30'
            }`}
          >
            <MapPin className={isCompact ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>

          <Input
            ref={inputRef}
            type="text"
            inputMode="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`w-full border transition-all duration-500 ${
              isCompact
                ? 'h-[52px] pl-12 pr-5 rounded-[16px] bg-white/[0.035] border-white/10 text-[13px] text-white placeholder:text-white/30 focus:bg-white/[0.07] focus:border-white/20 focus:ring-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]'
                : isHero
                  ? 'h-14 pl-12 pr-5 rounded-2xl text-[15px] font-medium bg-white/[0.07] border-white/10 backdrop-blur-xl text-white placeholder:text-white/25 focus:bg-white/[0.10] focus:border-white/20 focus:ring-0 shadow-[0_6px_30px_rgba(0,0,0,0.12)]'
                  : 'h-12 pl-12 pr-4 rounded-sm bg-secondary placeholder:text-muted-foreground'
            }`}
          />
        </div>

        {isCompact ? (
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="h-[44px] w-full px-4 rounded-[14px] bg-primary/95 hover:bg-primary text-primary-foreground text-[12px] font-medium tracking-[0.01em] whitespace-nowrap transition-all duration-300 shadow-[0_8px_20px_rgba(255,94,20,0.12)] hover:shadow-[0_12px_26px_rgba(255,94,20,0.16)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LocateFixed className="w-3.5 h-3.5 mr-2" />
            {isDetecting ? 'Detecting location…' : 'Use current location'}
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!canSubmit}
            className={`font-medium transition-all duration-500 ${
              isHero
                ? 'h-14 px-8 rounded-2xl bg-primary hover:scale-[1.015] hover:brightness-[1.03] text-primary-foreground text-[15px] shadow-[0_14px_35px_rgba(255,112,44,0.18)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                : 'h-12 px-6 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Search className="w-5 h-5 mr-2" />
            {isDetecting
              ? 'Loading...'
              : isHero
                ? 'Locate inventory'
                : 'Find pricing'}
          </Button>
        )}
      </div>

      {selectedLocation && !isDetecting && isHero && (
        <p className="mt-2 ml-1 text-[13px] text-white/45">
          Showing containers near {selectedLocation.city}
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-[14px] border border-red-400/15 bg-red-500/[0.08] px-3 py-2">
          <p className="text-[12px] leading-relaxed font-medium text-red-300">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}
