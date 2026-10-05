import React, { useEffect, useId, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import {
  saveSelectedLocation,
  cleanPostal,
  searchPostalLocations,
} from '../../lib/locationEngine';

export default function ZipRequiredModal({ open, onClose, onSuccess }) {
  const [postalInput, setPostalInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchTimerRef = useRef(null);
  const searchRequestRef = useRef(0);
  const pickerId = useId().replace(/:/g, '');
  const inputId = `product-postal-required-${pickerId}`;
  const suggestionsId = `product-postal-required-suggestions-${pickerId}`;

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!open) {
      setSuggestions([]);
      setChecking(false);
      setActiveSuggestion(-1);
      return;
    }

    const raw = postalInput.trim().toUpperCase();
    const clean = cleanPostal(raw);

    if (!clean) {
      setError('');
      setSuggestions([]);
      setChecking(false);
      setActiveSuggestion(-1);
      return;
    }

    const requestId = ++searchRequestRef.current;
    searchTimerRef.current = setTimeout(async () => {
      setChecking(true);
      setError('');

      try {
        const matches = await searchPostalLocations(clean);
        if (requestId !== searchRequestRef.current) return;
        setSuggestions(matches);
      } catch {
        if (requestId !== searchRequestRef.current) return;
        setSuggestions([]);
      } finally {
        if (requestId === searchRequestRef.current) setChecking(false);
      }
    }, 180);

    return () => clearTimeout(searchTimerRef.current);
  }, [postalInput, open, onSuccess]);

  const selectSuggestion = (location) => {
    saveSelectedLocation(location);
    setPostalInput('');
    setSuggestions([]);
    setActiveSuggestion(-1);
    onSuccess(location);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[26px] bg-[#080b10] border border-white/10 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
          <MapPin className="text-green-500" size={22} />
        </div>

        <h2 className="text-white text-2xl font-black tracking-tight mb-2">
          Enter ZIP / Postal Code
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          Enter your ZIP or postal code to view accurate local container prices.
        </p>

        <input
          autoFocus
          id={inputId}
          name={`container-exchange-product-postal-${pickerId}`}
          autoComplete="off"
          data-1p-ignore="true"
          data-bwignore="true"
          data-lpignore="true"
          data-protonpass-ignore="true"
          data-form-type="other"
          data-keeper-ignore="true"
          data-np-autofill-ignore="true"
          className="w-full h-14 rounded-2xl bg-black border border-white/10 px-4 text-white text-base outline-none focus:border-green-500"
          placeholder="Enter ZIP / Postal Code"
          value={postalInput}
          aria-autocomplete="list"
          aria-controls={suggestionsId}
          aria-expanded={checking || suggestions.length > 0}
          onChange={(e) => {
            setPostalInput(e.target.value);
            setActiveSuggestion(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestions.length) {
              event.preventDefault();
              setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
              return;
            }

            if (event.key === 'ArrowUp' && suggestions.length) {
              event.preventDefault();
              setActiveSuggestion((current) => Math.max(current - 1, 0));
              return;
            }

            if (event.key === 'Enter' && suggestions.length) {
              event.preventDefault();
              selectSuggestion(suggestions[activeSuggestion >= 0 ? activeSuggestion : 0]);
            }
          }}
        />

        {!checking && suggestions.length > 0 && (
          <div id={suggestionsId} role="listbox" aria-label="Matching ZIP and postal-code locations" className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            {suggestions.map((suggestion, index) => {
              const isActive = index === activeSuggestion;
              const country = suggestion.country === 'CA' ? 'Canada' : 'United States';

              return (
                <button
                  key={`${suggestion.country}-${suggestion.postalCode}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/[0.06]'}`}
                >
                  <MapPin size={16} className="shrink-0 text-sky-300" aria-hidden="true" />
                  <span className="min-w-0">
                    <strong className="block truncate text-sm text-white">{suggestion.city}, {suggestion.state} {suggestion.postalCode}</strong>
                    <small className="block truncate text-xs text-white/55">{country}</small>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-xs font-bold mt-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
