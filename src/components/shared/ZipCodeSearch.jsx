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
  placeholder = 'Enter ZIP code',
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

    finalLocation.formattedAddress = formatLocationDisplay(
      finalLocation,
      value
    );
    finalLocation.displayName = finalLocation.formattedAddress;

    return finalLocation;
  };

  const persistLocation = (location) => {
    saveSelectedLocation(location);

    window.dispatchEvent(
      new CustomEvent('ce-location-change', {
        detail: location,
      })
    );
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
        setError('Location not found. Please check ZIP code.');
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
      setError('Location is not supported by this browser.');
      return;
    }

    setError('');
    setIsDetecting(true);
    setInputValue('Detecting current location...');

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
            data.city ||
            data.locality ||
            data.principalSubdivision ||
            '';

          const state =
            data.principalSubdivisionCode?.replace('US-', '') ||
            data.principalSubdivision ||
            '';

          if (!detectedZip) {
            setIsDetecting(false);
            setInputValue('');
            setError('Could not detect ZIP code. Please enter it manually.');
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
          setError('Could not detect your location. Please enter ZIP manually.');
        }
      },
      () => {
        setIsDetecting(false);
        setInputValue('');
        setError('Location permission was denied.');
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
            ? 'flex flex-col gap-3 w-full'
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
                ? 'h-[58px] pl-12 pr-5 rounded-[18px] bg-white/[0.04] border-white/10 text-[13px] text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-white/20 focus:ring-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
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
            className="h-[54px] w-full px-5 rounded-[18px] bg-primary hover:bg-primary/95 text-primary-foreground text-[13px] font-medium whitespace-nowrap transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LocateFixed className="w-4 h-4 mr-2" />
            {isDetecting ? 'Detecting...' : 'Use my current location'}
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
        <p className="text-red-400 text-sm font-medium mt-2">{error}</p>
      )}
    </form>
  );
}
