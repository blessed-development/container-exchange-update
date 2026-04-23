import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { MapPin, ChevronDown, Locate, Search } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';

const SIZE_OPTIONS = [
  { value: '10', label: "10' Container" },
  { value: '20', label: "20' Container" },
  { value: '40', label: "40' Container" },
];

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New (One-Trip)' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
];

const GRADE_OPTIONS = [
  { value: 'WWT', label: 'Wind & Water Tight' },
  { value: 'CW', label: 'Cargo Worthy (CW)' },
  { value: 'IICL', label: 'IICL Certified' },
  { value: 'AS_IS', label: 'As-Is' },
];

const HEIGHT_OPTIONS = [
  { value: 'standard', label: "8'6\" Standard" },
  { value: 'high_cube', label: "9'6\" High Cube" },
];

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div>
      <h4 className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground mb-3 uppercase">{title}</h4>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={selected.includes(opt.value)}
              onCheckedChange={() => onToggle(opt.value)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function LocationFilter({ zipCode, onZipSubmit }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(zipCode || '');
  const [detecting, setDetecting] = useState(false);

  const locationInfo = zipCode ? getLocationFromZip(zipCode) : null;
  const displayLabel = locationInfo
    ? `${locationInfo.city}, ${locationInfo.state}`
    : zipCode || 'All Locations';

  const handleApply = () => {
    if (isValidZipCode(input)) {
      onZipSubmit(input);
      setOpen(false);
    }
  };

  const handleDetect = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        // fallback: use a default zip since we can't reverse-geocode without API
        setInput('90210');
        setDetecting(false);
      },
      () => setDetecting(false)
    );
  };

  return (
    <div>
      <h4 className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground mb-3 uppercase">
        Delivery Location
      </h4>

      {/* Collapsed trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl border-2 transition-all ${
          open
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/40'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className={`w-4 h-4 flex-shrink-0 ${zipCode ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`text-sm font-semibold truncate ${zipCode ? 'text-foreground' : 'text-muted-foreground'}`}>
            {displayLabel}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2.5 flex flex-col gap-2">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Enter your ZIP code to check container availability and delivery options near you.
              </p>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={input}
                    onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                    placeholder="ZIP code"
                    className="w-full pl-8 pr-3 h-9 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={handleApply}
                  className="h-9 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
              >
                <Locate className={`w-3.5 h-3.5 ${detecting ? 'animate-spin' : ''}`} />
                {detecting ? 'Detecting...' : 'Use my current location'}
              </button>
              {zipCode && (
                <button
                  onClick={() => { onZipSubmit(''); setInput(''); setOpen(false); }}
                  className="text-xs text-destructive hover:underline text-left"
                >
                  Clear location
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ filters, onFilterChange, zipCode, onZipSubmit }) {
  const toggle = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  return (
    <div className="space-y-6">
      <LocationFilter zipCode={zipCode} onZipSubmit={onZipSubmit} />
      <Separator />
      <FilterGroup title="Size / Length" options={SIZE_OPTIONS} selected={filters.size || []} onToggle={(v) => toggle('size', v)} />
      <Separator />
      <FilterGroup title="Condition" options={CONDITION_OPTIONS} selected={filters.condition || []} onToggle={(v) => toggle('condition', v)} />
      <Separator />
      <FilterGroup title="Grade" options={GRADE_OPTIONS} selected={filters.grade || []} onToggle={(v) => toggle('grade', v)} />
      <Separator />
      <FilterGroup title="Height" options={HEIGHT_OPTIONS} selected={filters.height || []} onToggle={(v) => toggle('height', v)} />
    </div>
  );
}