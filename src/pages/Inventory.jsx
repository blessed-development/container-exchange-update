import React, { useState, useMemo } from 'react';
import InventoryListCard from '@/components/inventory/InventoryListCard';
import FilterSidebar from '@/components/inventory/FilterSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getLocationFromZip } from '@/lib/zipUtils';

const inventoryProducts = [
  {
    id: 'used-20-wwt',
    name: 'Used 20 ft Shipping Container Standard 8 ft 6 in High | Wind & Water Tight',
    condition: 'Used',
    size: 20,
    height: 'standard',
    grade: 'WWT',
    base_price: 1350,
    rating: 4.9,
    review_count: 207,
    image_url: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1200&q=80',
    short_description: 'Affordable wind and water tight storage container ready for fast delivery.',
    is_available: true,
    is_bestseller: true,
  },
  {
    id: 'used-40-wwt',
    name: 'Used 40 ft Shipping Container Standard Height | Wind & Water Tight',
    condition: 'Used',
    size: 40,
    height: 'standard',
    grade: 'WWT',
    base_price: 1800,
    rating: 4.9,
    review_count: 217,
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    short_description: 'Heavy-duty 40 ft storage container ideal for commercial use.',
    is_available: true,
    is_bestseller: true,
  },
  {
    id: 'used-40hc-wwt',
    name: 'Used 40 ft High Cube Shipping Container 9 ft 6 in High | WWT',
    condition: 'Used',
    size: 40,
    height: 'high_cube',
    grade: 'WWT',
    base_price: 2050,
    rating: 4.8,
    review_count: 198,
    image_url: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&q=80',
    short_description: 'Extra height high cube container with wind and water tight protection.',
    is_available: true,
    is_bestseller: true,
  },
  {
    id: 'new-20-iicl',
    name: 'New 20 ft One-Trip Shipping Container Standard Height | IICL',
    condition: 'New',
    size: 20,
    height: 'standard',
    grade: 'IICL',
    base_price: 2900,
    rating: 5,
    review_count: 184,
    image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
    short_description: 'Premium one-trip container with minimal wear and clean interior.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'used-20-cw',
    name: 'Used 20 ft Cargo Worthy Shipping Container Standard Height',
    condition: 'Used',
    size: 20,
    height: 'standard',
    grade: 'CW',
    base_price: 1650,
    rating: 4.8,
    review_count: 142,
    image_url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80',
    short_description: 'Cargo worthy certified container suitable for shipping and export.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'used-40-cw',
    name: 'Used 40 ft Cargo Worthy Shipping Container Standard Height',
    condition: 'Used',
    size: 40,
    height: 'standard',
    grade: 'CW',
    base_price: 2450,
    rating: 4.7,
    review_count: 161,
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    short_description: 'Durable steel container certified cargo worthy for export use.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'new-40hc-iicl',
    name: 'New 40 ft High Cube One-Trip Shipping Container | IICL',
    condition: 'New',
    size: 40,
    height: 'high_cube',
    grade: 'IICL',
    base_price: 5400,
    rating: 5,
    review_count: 124,
    image_url: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1200&q=80',
    short_description: 'Premium one-trip high cube container with extra storage capacity.',
    is_available: true,
    is_bestseller: true,
  },
  {
    id: 'used-10-wwt',
    name: 'Used 10 ft Shipping Container Standard Height | WWT',
    condition: 'Used',
    size: 10,
    height: 'standard',
    grade: 'WWT',
    base_price: 2250,
    rating: 4.8,
    review_count: 91,
    image_url: 'https://images.unsplash.com/photo-1524522173746-f628baad3644?w=1200&q=80',
    short_description: 'Compact storage solution perfect for residential or business use.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'refurbished-20',
    name: 'Refurbished 20 ft Shipping Container Standard Height',
    condition: 'Refurbished',
    size: 20,
    height: 'standard',
    grade: 'WWT',
    base_price: 2350,
    rating: 4.9,
    review_count: 76,
    image_url: 'https://images.unsplash.com/photo-1571823251730-2a3d1ef5958d?w=1200&q=80',
    short_description: 'Professionally refurbished container with improved appearance.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'used-40-asis',
    name: 'Used 40 ft Shipping Container Standard Height | AS IS',
    condition: 'Used',
    size: 40,
    height: 'standard',
    grade: 'AS_IS',
    base_price: 1450,
    rating: 4.5,
    review_count: 63,
    image_url: 'https://images.unsplash.com/photo-1578243317822-8088b1c20538?w=1200&q=80',
    short_description: 'Budget-friendly AS IS container suitable for static storage.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'new-20-double-door',
    name: 'New 20 ft Double Door Shipping Container | IICL',
    condition: 'New',
    size: 20,
    height: 'standard',
    grade: 'IICL',
    base_price: 3350,
    rating: 5,
    review_count: 88,
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
    short_description: 'One-trip double door container for improved loading access.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'used-40hc-cw',
    name: 'Used 40 ft High Cube Cargo Worthy Container',
    condition: 'Used',
    size: 40,
    height: 'high_cube',
    grade: 'CW',
    base_price: 3150,
    rating: 4.8,
    review_count: 117,
    image_url: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
    short_description: 'High cube cargo worthy container with strong steel structure.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'new-40-iicl',
    name: 'New 40 ft Shipping Container Standard Height | IICL',
    condition: 'New',
    size: 40,
    height: 'standard',
    grade: 'IICL',
    base_price: 4750,
    rating: 4.9,
    review_count: 102,
    image_url: 'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=1200&q=80',
    short_description: 'One-trip standard height container with premium condition.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'used-20-asis',
    name: 'Used 20 ft Shipping Container Standard Height | AS IS',
    condition: 'Used',
    size: 20,
    height: 'standard',
    grade: 'AS_IS',
    base_price: 1150,
    rating: 4.4,
    review_count: 51,
    image_url: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1200&q=80',
    short_description: 'Economical storage container available for local delivery.',
    is_available: true,
    is_bestseller: false,
  },
  {
    id: 'refurbished-40hc',
    name: 'Refurbished 40 ft High Cube Shipping Container',
    condition: 'Refurbished',
    size: 40,
    height: 'high_cube',
    grade: 'WWT',
    base_price: 3850,
    rating: 4.9,
    review_count: 94,
    image_url: 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=1200&q=80',
    short_description: 'Refurbished high cube container with clean exterior finish.',
    is_available: true,
    is_bestseller: false,
  },
];

export default function Inventory() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialZip = urlParams.get('zip') || '';

  const [zipCode, setZipCode] = useState(initialZip);
  const [filters, setFilters] = useState({ size: [], condition: [], grade: [], height: [] });
  const [sortBy, setSortBy] = useState('default');

  const containers = inventoryProducts;
  const isLoading = false;

  const locationInfo = zipCode ? getLocationFromZip(zipCode) : null;

  const filteredContainers = useMemo(() => {
    let result = [...containers];

    if (filters.size.length > 0) {
      result = result.filter((c) => filters.size.includes(c.size));
    }
    if (filters.condition.length > 0) {
      result = result.filter((c) => filters.condition.includes(c.condition));
    }
    if (filters.grade.length > 0) {
      result = result.filter((c) => filters.grade.includes(c.grade));
    }
    if (filters.height.length > 0) {
      result = result.filter((c) => filters.height.includes(c.height));
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
        break;
      case 'name_asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return result;
  }, [containers, filters, sortBy]);

  const activeFilterCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

  const clearFilters = () => {
    setFilters({ size: [], condition: [], grade: [], height: [] });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-accent/90" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/[0.04] blur-[80px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            BROWSE INVENTORY
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Shipping Containers <span className="text-primary">For Sale</span>
          </h1>
          {locationInfo && (
            <p className="text-white/50 mt-3 text-base">
              Showing inventory near <span className="text-primary font-semibold">{locationInfo.city}</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold text-sm">Filters</span>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              <FilterSidebar filters={filters} onFilterChange={setFilters} zipCode={zipCode} onZipSubmit={setZipCode} />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-mono text-foreground font-semibold">{filteredContainers.length}</span> containers found
              </p>

              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                      {activeFilterCount > 0 && (
                        <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar filters={filters} onFilterChange={setFilters} zipCode={zipCode} onZipSubmit={setZipCode} />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? null : filteredContainers.length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredContainers.map((container, i) => (
                  <InventoryListCard key={container.id} container={container} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground mb-2">No containers match your filters.</p>
                <button onClick={clearFilters} className="text-primary text-sm hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
