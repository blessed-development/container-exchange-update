import React, { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, LocateFixed, MapPin, Search } from 'lucide-react';
import {
  getSavedSelectedLocation,
  saveSelectedLocation,
  lookupPostalCode,
  searchPostalLocations,
  isUsZip,
  isCanadianPostal,
  getCountryLabel,
} from '@/lib/locationEngine';

const LOCATION_ERROR =
  "Couldn't locate your ZIP code in the US or Canada. Try entering it manually or select a nearby ZIP code.";

const getZipValue = (location) =>
  location?.postalCode || location?.zip || location?.zipCode || '';

const getStateValue = (location) =>
  location?.stateCode || location?.state || '';

const isValidPostal = (value) => {
  return isUsZip(value) || isCanadianPostal(value);
};

const normalizePostalInput = (value) => {
  const raw = String(value || '').toUpperCase();

  // US ZIP: keep max 5 digits
  if (/^\d/.test(raw)) {
    return raw.replace(/\D/g, '').slice(0, 5);
  }

  // Canada postal: keep max 6 alphanumeric chars
  return raw.replace(/[^A-Z0-9]/g, '').slice(0, 6);
};

const formatLocationDisplay = (location, fallbackZip = '') => {
  const zip = getZipValue(location) || fallbackZip || '';
  const city = location?.city || '';
  const state = getStateValue(location);
  const country = getCountryLabel(location?.country) || 'USA';

  if (city && state && zip) return `${city}, ${state} ${zip}, ${country}`;
  if (city && zip) return `${city} ${zip}, ${country}`;
  if (zip) return zip;

  return '';
};

const getPickerCountryLabel = (country) =>
  country === 'CA' ? 'Canada' : 'United States';

const buildResolvedLocation = (detected) => {
  const postalCode = detected?.postalCode || '';

  const finalLocation = {
    ...detected,
    postalCode,
    zip: postalCode,
    zipCode: postalCode,
    stateCode: detected?.state || detected?.stateCode || '',
    country: detected?.country || 'US',
  };

  finalLocation.formattedAddress = formatLocationDisplay(
    finalLocation,
    postalCode
  );
  finalLocation.displayName = finalLocation.formattedAddress;

  return finalLocation;
};

export default function ZipCodeSearch({
  variant = 'hero',
  appearance = variant,
  showAction = true,
  onZipSubmit,
  className = '',
  placeholder = 'Enter your zipcode',
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const pickerRef = useRef(null);
  const searchRequestRef = useRef(0);
  const locationFieldId = useId().replace(/:/g, '');
  const inputId = `container-exchange-location-search-${locationFieldId}`;
  const suggestionsId = `container-exchange-location-suggestions-${locationFieldId}`;

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';
  const usesSoftAppearance = appearance === 'compact';
  const usesCalculatorAppearance = appearance === 'calculator';
  const usesDarkPicker = (isHero || isCompact) && !usesCalculatorAppearance;

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
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

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

  const completeLocation = (location) => {
    const finalLocation = buildResolvedLocation(location);
    const finalZip = getZipValue(finalLocation);

    setZip(finalZip);
    setSelectedLocation(finalLocation);
    setInputValue(formatLocationDisplay(finalLocation, finalZip));
    setIsDetecting(false);
    setError('');

    persistLocation(finalLocation);

    if (onZipSubmit) {
      onZipSubmit(finalZip, finalLocation);
    }

    moveCursorToEnd();

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

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const closeOnOutsidePress = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setIsSuggestionsOpen(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);

    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, []);

  const searchPostalSuggestions = (value) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const requestId = ++searchRequestRef.current;
    setIsSearching(true);
    setIsSuggestionsOpen(true);
    setActiveSuggestion(-1);

    timerRef.current = setTimeout(async () => {
      try {
        const matches = await searchPostalLocations(value);

        if (requestId !== searchRequestRef.current) return;

        setSuggestions(matches);
        setIsSearching(false);
        setIsSuggestionsOpen(true);
      } catch {
        if (requestId !== searchRequestRef.current) return;

        setSuggestions([]);
        setIsSearching(false);
      }
    }, 180);
  };

  const selectSuggestion = (location) => {
    completeLocation(location);
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    setActiveSuggestion(-1);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const normalized = normalizePostalInput(rawValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setError('');
    setInputValue(rawValue);

    const zipCandidate = normalized;
    setZip(zipCandidate);

    if (selectedLocation) {
      setSelectedLocation(null);
    }

    setIsDetecting(false);

    if (zipCandidate) {
      searchPostalSuggestions(zipCandidate);
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      setIsSearching(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setIsSuggestionsOpen(true);
      setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
      return;
    }

    if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setActiveSuggestion((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Escape') {
      setIsSuggestionsOpen(false);
      setActiveSuggestion(-1);
      return;
    }

    if (event.key === 'Enter' && suggestions.length) {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestion >= 0 ? activeSuggestion : 0]);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (selectedLocation) {
      setSelectedLocation(null);
      setIsDetecting(false);
      setError('');
    }
  };

  const handleFocus = () => {
    moveCursorToEnd();

    if (zip && !selectedLocation) {
      searchPostalSuggestions(zip);
    }
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

          if (!detectedZip) {
            setIsDetecting(false);
            setInputValue('');
            setSelectedLocation(null);
            setError(LOCATION_ERROR);
            return;
          }

          const detected = await lookupPostalCode(detectedZip);
          completeLocation(detected);
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
    isValidPostal(zip) &&
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
    <form onSubmit={handleSubmit} autoComplete="off" className={`w-full ${className}`}>
      <div
        className={
          isCompact
            ? 'flex flex-col gap-2.5 w-full'
            : `flex flex-col sm:flex-row gap-3 ${isHero ? 'max-w-[720px]' : ''}`
        }
      >
        <div ref={pickerRef} className="relative w-full min-w-0">
          <div
            className={`absolute ${isHero && !usesSoftAppearance && !usesCalculatorAppearance ? 'left-5' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none ${
              usesCalculatorAppearance ? 'text-[#746f68]' : isCompact || usesSoftAppearance ? 'text-white/25' : 'text-white/30'
            }`}
          >
            <MapPin className={isCompact || usesSoftAppearance || usesCalculatorAppearance ? 'w-4 h-4' : isHero ? 'w-6 h-6' : 'w-5 h-5'} />
          </div>

          <Input
            ref={inputRef}
            id={inputId}
            name={`container-exchange-location-search-${locationFieldId}`}
            type="text"
            inputMode="text"
            autoComplete="off"
            data-1p-ignore="true"
            data-bwignore="true"
            data-lpignore="true"
            data-protonpass-ignore="true"
            data-form-type="other"
            data-keeper-ignore="true"
            data-np-autofill-ignore="true"
            aria-autocomplete="list"
            aria-controls={suggestionsId}
            aria-expanded={isSuggestionsOpen}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`w-full border transition-all duration-500 ${
              usesCalculatorAppearance
                ? 'h-[52px] pl-12 pr-5 rounded-[16px] bg-white border-[#d9d9df] text-[13px] text-[#2f2c28] placeholder:text-[#746f68] focus:bg-white focus:border-[#226fa1]/60 focus:ring-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]'
                : isCompact || usesSoftAppearance
                ? 'h-[52px] pl-12 pr-5 rounded-[16px] bg-white/[0.035] border-white/10 text-[13px] text-white placeholder:text-white/30 focus:bg-white/[0.07] focus:border-white/20 focus:ring-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]'
                : isHero
                  ? 'h-[68px] pl-14 pr-6 rounded-2xl text-[18px] font-medium bg-white/[0.07] border-white/10 backdrop-blur-xl text-white placeholder:text-white/25 focus:bg-white/[0.10] focus:border-white/20 focus:ring-0 shadow-[0_6px_30px_rgba(0,0,0,0.12)]'
                  : 'h-12 pl-12 pr-4 rounded-sm bg-secondary placeholder:text-muted-foreground'
            }`}
          />

          {isSuggestionsOpen && suggestions.length > 0 && (
            <div
              id={suggestionsId}
              role="listbox"
              aria-label="Matching ZIP and postal-code locations"
              className={`absolute z-50 left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border backdrop-blur-xl shadow-[0_20px_48px_rgba(4,18,33,0.26)] ${
                usesDarkPicker
                  ? 'border-white/12 bg-[#0b1c2d]/[0.96]'
                  : 'border-border bg-popover'
              }`}
            >
              {suggestions.map((suggestion, index) => {
                    const isActive = index === activeSuggestion;
                    const isSaved = getZipValue(selectedLocation) === getZipValue(suggestion);

                    return (
                      <button
                        key={`${suggestion.country}-${getZipValue(suggestion)}`}
                        type="button"
                        role="option"
                        aria-selected={isActive || isSaved}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectSuggestion(suggestion)}
                        onMouseEnter={() => setActiveSuggestion(index)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isActive
                            ? usesDarkPicker ? 'bg-white/10' : 'bg-muted'
                            : usesDarkPicker ? 'hover:bg-white/[0.06]' : 'hover:bg-muted/70'
                        }`}
                      >
                        <MapPin className={`h-4 w-4 shrink-0 ${usesDarkPicker ? 'text-sky-300' : 'text-primary'}`} />
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm font-semibold ${usesDarkPicker ? 'text-white' : 'text-foreground'}`}>
                            {formatLocationDisplay(suggestion, getZipValue(suggestion))}
                          </span>
                          <span className={`block truncate text-xs ${usesDarkPicker ? 'text-white/55' : 'text-muted-foreground'}`}>
                            {getPickerCountryLabel(suggestion.country)}
                          </span>
                        </span>
                        {isSaved && <Check className="h-4 w-4 shrink-0 text-sky-300" />}
                      </button>
                    );
                  })}
            </div>
          )}
        </div>

        {showAction && isCompact ? (
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="h-[44px] w-full px-4 rounded-[14px] bg-primary/95 hover:bg-primary text-primary-foreground text-[12px] font-medium tracking-[0.01em] whitespace-nowrap transition-all duration-300 shadow-[0_8px_20px_rgba(255,94,20,0.12)] hover:shadow-[0_12px_26px_rgba(255,94,20,0.16)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LocateFixed className="w-3.5 h-3.5 mr-2" />
            {isDetecting ? 'Detecting location…' : 'Use current location'}
          </Button>
        ) : showAction ? (
          <Button
            type="submit"
            disabled={!canSubmit}
            className={`font-medium transition-all duration-500 ${
              isHero && !usesSoftAppearance && !usesCalculatorAppearance
                ? 'h-[68px] px-10 rounded-2xl bg-primary hover:scale-[1.015] hover:brightness-[1.03] text-primary-foreground text-[18px] shadow-[0_14px_35px_rgba(255,112,44,0.18)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                : 'h-[52px] px-6 rounded-[16px] bg-primary hover:bg-primary/90 text-primary-foreground text-[14px] disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
            <Search className={isHero && !usesSoftAppearance ? 'w-6 h-6 mr-2.5' : 'w-5 h-5 mr-2'} />
            {isDetecting
              ? 'Loading...'
              : isHero
                ? 'Locate inventory'
                : 'Find pricing'}
          </Button>
        ) : null}
      </div>

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
