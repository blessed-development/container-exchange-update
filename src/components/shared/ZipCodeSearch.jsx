import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  lookupPostalCode,
  saveSelectedLocation,
  cleanPostal,
  isUsZip,
  isCanadianPostal,
} from '@/lib/locationEngine';

export default function ZipCodeSearch({
  variant = 'hero',
  onZipSubmit,
  className = '',
}) {
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const navigate = useNavigate();

  const handleZipChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .slice(0, 8);

    setZip(value);
    setError('');

    if (value.length < 3) {
      setLocationName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clean = cleanPostal(zip);

    if (!isUsZip(clean) && !isCanadianPostal(clean)) {
      setError('Enter a valid ZIP / Postal Code');
      return;
    }

    setIsLookingUp(true);

    try {
      const resolved = await lookupPostalCode(zip);

      saveSelectedLocation(resolved);

      setZip(resolved.postalCode || zip);
      setLocationName(resolved.city || '');

      if (onZipSubmit) {
        onZipSubmit(resolved.postalCode || zip);
      } else {
        navigate(`/inventory?zip=${encodeURIComponent(resolved.postalCode || zip)}`);
      }
    } catch (err) {
      setError(err?.message || 'ZIP / Postal Code not found.');
    } finally {
      setIsLookingUp(false);
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
            inputMode="text"
            value={zip}
            onChange={handleZipChange}
            placeholder="ENTER ZIP CODE"
            className={`pl-12 font-mono tracking-wider border-0 rounded-sm ${
              isHero
                ? 'h-14 text-lg bg-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:ring-primary'
                : 'h-12 bg-secondary text-secondary-foreground placeholder:text-muted-foreground'
            }`}
          />

          {locationName && zip.length >= 3 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-primary"
            >
              {locationName}
            </motion.span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLookingUp}
          className={`font-semibold tracking-wider rounded-sm ${
            isHero
              ? 'h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base'
              : 'h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {isLookingUp ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Search className="w-5 h-5 mr-2" />
          )}

          {isHero ? 'LOCATE INVENTORY' : 'FIND PRICING'}
        </Button>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-mono mt-2">{error}</p>
      )}
    </form>
  );
}
