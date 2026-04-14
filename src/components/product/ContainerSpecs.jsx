import React from 'react';
import { Separator } from '@/components/ui/separator';

const DEFAULT_SPECS = {
  '10': {
    external_length: "10' (3.05m)",
    external_width: "8' (2.44m)",
    external_height: "8'6\" (2.59m)",
    internal_length: "9'4\" (2.84m)",
    internal_width: "7'8\" (2.35m)",
    internal_height: "7'10\" (2.39m)",
    door_width: "7'8\" (2.34m)",
    door_height: "7'6\" (2.28m)",
    tare_weight: "2,860 lbs (1,300 kg)",
    max_payload: "22,050 lbs (10,000 kg)",
    cubic_capacity: "16 m³ (565 ft³)",
    floor_type: "Marine Grade Plywood",
  },
  '20': {
    external_length: "20' (6.06m)",
    external_width: "8' (2.44m)",
    external_height: "8'6\" (2.59m)",
    internal_length: "19'4\" (5.90m)",
    internal_width: "7'8\" (2.35m)",
    internal_height: "7'10\" (2.39m)",
    door_width: "7'8\" (2.34m)",
    door_height: "7'6\" (2.28m)",
    tare_weight: "5,070 lbs (2,300 kg)",
    max_payload: "47,840 lbs (21,700 kg)",
    cubic_capacity: "33 m³ (1,165 ft³)",
    floor_type: "Marine Grade Plywood",
  },
  '40': {
    external_length: "40' (12.19m)",
    external_width: "8' (2.44m)",
    external_height: "8'6\" (2.59m)",
    internal_length: "39'5\" (12.03m)",
    internal_width: "7'8\" (2.35m)",
    internal_height: "7'10\" (2.39m)",
    door_width: "7'8\" (2.34m)",
    door_height: "7'6\" (2.28m)",
    tare_weight: "8,265 lbs (3,750 kg)",
    max_payload: "58,935 lbs (26,730 kg)",
    cubic_capacity: "67 m³ (2,365 ft³)",
    floor_type: "Marine Grade Plywood",
  },
};

const HC_OVERRIDE = {
  external_height: "9'6\" (2.89m)",
  internal_height: "8'10\" (2.69m)",
  door_height: "8'6\" (2.58m)",
};

export default function ContainerSpecs({ container }) {
  const baseSpecs = DEFAULT_SPECS[container?.size] || DEFAULT_SPECS['20'];
  const specs = container?.height === 'high_cube'
    ? { ...baseSpecs, ...HC_OVERRIDE }
    : baseSpecs;
  
  const customSpecs = container?.specs || {};
  const finalSpecs = { ...specs, ...customSpecs };

  const specRows = [
    { label: 'External Length', value: finalSpecs.external_length },
    { label: 'External Width', value: finalSpecs.external_width },
    { label: 'External Height', value: finalSpecs.external_height },
    { label: 'Internal Length', value: finalSpecs.internal_length },
    { label: 'Internal Width', value: finalSpecs.internal_width },
    { label: 'Internal Height', value: finalSpecs.internal_height },
    { label: 'Door Width', value: finalSpecs.door_width },
    { label: 'Door Height', value: finalSpecs.door_height },
    { label: 'Tare Weight', value: finalSpecs.tare_weight },
    { label: 'Max Payload', value: finalSpecs.max_payload },
    { label: 'Cubic Capacity', value: finalSpecs.cubic_capacity },
    { label: 'Floor Type', value: finalSpecs.floor_type },
  ];

  return (
    <div className="border border-border rounded-sm">
      <div className="p-4 bg-muted/30 border-b border-border">
        <h3 className="text-xs font-mono font-semibold tracking-widest text-muted-foreground">
          TECHNICAL SPECIFICATIONS
        </h3>
      </div>
      <div className="divide-y divide-border">
        {specRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-mono font-medium">{row.value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}