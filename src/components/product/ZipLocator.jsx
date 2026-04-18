import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ZipLocator({ zipCode, onZipChange }) {
  const [inputZip, setInputZip] = useState(zipCode || '');
  const [locating, setLocating] = useState(false);
  const [locationText, setLocationText] = useState(() => {
    if (zipCode && isValidZipCode(zipCode)) {
      const info = getLocationFromZip(zipCode);
      return info ? `${info.city} ${zipCode}, USA` : zipCode;
    }
    return '';
  });

  const handleZipSubmit = (zip) => {
    if (!isValidZipCode(zip)) return;
    const info = getLocationFromZip(zip);
    setLocationText(info ? `${info.city} ${zip}, USA` : `${zip}, USA`);
    onZipChange(zip);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleZipSubmit(inputZip);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // We can't do reverse geocoding without an API; use a placeholder
        setLocationText('Your current location');
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
      <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground text-xs font-bold font-mono px-2.5 py-0.5 rounded">Step 1:</span>
        <span className="font-bold text-sm text-foreground">Enter Zip/Postal Code</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            inputMode="numeric"
            value={locationText || inputZip}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 5);
              setInputZip(val);
              setLocationText('');
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => handleZipSubmit(inputZip)}
            placeholder="Enter ZIP code..."
            className="pl-10 h-11 font-mono bg-background border-border"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleGeolocate}
          disabled={locating}
          className="w-full h-10 border-primary/50 text-primary hover:bg-primary hover:text-white transition-all font-semibold gap-2"
        >
          {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          Use my current location
        </Button>
      </div>
    </div>
  );
}