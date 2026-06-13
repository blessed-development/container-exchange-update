import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { isValidZipCode, getLocationFromZip } from '@/lib/zipUtils';
import { motion } from 'framer-motion';

export default function ZipCodeSearch({
variant = 'hero',
onZipSubmit,
className = '',
}) {
const [zip, setZip] = useState('');
const [error, setError] = useState('');
const [locationName, setLocationName] = useState('');
const navigate = useNavigate();

const handleZipChange = (e) => {
const value = e.target.value.replace(/\D/g, '').slice(0, 5);

```
setZip(value);
setError('');

if (value.length >= 3) {
  const loc = getLocationFromZip(value);

  if (loc) {
    setLocationName(loc.city);
  }
} else {
  setLocationName('');
}
```

};

const handleSubmit = (e) => {
e.preventDefault();

```
if (!isValidZipCode(zip)) {
  setError('Enter a valid 5-digit ZIP code');
  return;
}

if (onZipSubmit) {
  onZipSubmit(zip);
} else {
  navigate(`/inventory?zip=${zip}`);
}
```

};

const isHero = variant === 'hero';

return ( <form onSubmit={handleSubmit} className={className}>
<div className={`flex flex-col sm:flex-row gap-3 ${isHero ? 'max-w-xl' : ''}`}> <div className="relative flex-1">

```
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
        <MapPin className="w-5 h-5" />
      </div>

      <Input
        type="text"
        inputMode="numeric"
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
      className={`font-semibold tracking-wider rounded-sm ${
        isHero
          ? 'h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base'
          : 'h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground'
      }`}
    >
      <Search className="w-5 h-5 mr-2" />
      {isHero ? 'LOCATE INVENTORY' : 'FIND PRICING'}
    </Button>
  </div>

  {error && (
    <p className="text-red-400 text-sm font-mono mt-2">
      {error}
    </p>
  )}
</form>
```

);
}
