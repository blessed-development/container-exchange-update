import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import { Filter } from 'lucide-react';

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
  { value: 'WWT', label: 'Wind & Water Tight (WWT)' },
  { value: 'CW', label: 'Cargo Worthy (CW)' },
  { value: 'IICL', label: 'IICL Certified' },
  { value: 'AS_IS', label: 'As-Is' },
];

const HEIGHT_OPTIONS = [
  { value: 'standard', label: '8\'6" Standard' },
  { value: 'high_cube', label: '9\'6" High Cube (HC)' },
];

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div>
      <h4 className="text-xs font-mono font-semibold tracking-widest text-muted-foreground mb-3">
        {title}
      </h4>

      <div className="space-y-2.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Checkbox
              checked={selected.includes(opt.value)}
              onCheckedChange={() => onToggle(opt.value)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />

            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  zipCode,
  onZipSubmit,
}) {
  const toggle = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFilterChange({ ...filters, [key]: updated });
  };

  return (
    <div className="space-y-6">
      {/* ZIP Code */}
      <div>
        {zipCode && (
          <p className="mb-2 text-[11px] font-mono tracking-widest text-primary uppercase">
            ZIP: {zipCode}
          </p>
        )}

        <ZipCodeSearch
          variant="compact"
          onZipSubmit={onZipSubmit}
          placeholder="Enter your zipcode / Postalcode"
        />
      </div>

      <Separator />

      <FilterGroup
        title="SIZE / LENGTH"
        options={SIZE_OPTIONS}
        selected={filters.size || []}
        onToggle={(val) => toggle('size', val)}
      />

      <Separator />

      <FilterGroup
        title="CONDITION"
        options={CONDITION_OPTIONS}
        selected={filters.condition || []}
        onToggle={(val) => toggle('condition', val)}
      />

      <Separator />

      <FilterGroup
        title="GRADE"
        options={GRADE_OPTIONS}
        selected={filters.grade || []}
        onToggle={(val) => toggle('grade', val)}
      />

      <Separator />

      <FilterGroup
        title="HEIGHT"
        options={HEIGHT_OPTIONS}
        selected={filters.height || []}
        onToggle={(val) => toggle('height', val)}
      />
    </div>
  );
}
