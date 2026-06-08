import React, { useEffect, useMemo, useState } from 'react';
import InventoryListCard from '@/components/inventory/InventoryListCard';
import FilterSidebar from '@/components/inventory/FilterSidebar';
import { inventoryProducts } from '@/data/inventoryProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getSavedSelectedLocation } from '@/lib/locationEngine';

export default function Inventory() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialZip = urlParams.get('zip') || '';

  const [zipCode, setZipCode] = useState(initialZip);
  const [filters, setFilters] = useState({ size: [], condition: [], grade: [], height: [] });
  const [sortBy, setSortBy] = useState('default');
  const [savedLocation, setSavedLocation] = useState(() => getSavedSelectedLocation());

  const containers = inventoryProducts;
  const isLoading = false;

  useEffect(() => {
    const syncLocation = (event) => {
      setSavedLocation(event?.detail || getSavedSelectedLocation());
    };

    syncLocation();

    window.addEventListener('ce-location-change', syncLocation);
    window.addEventListener('storage', syncLocation);
    window.addEventListener('focus', syncLocation);
    window.addEventListener('pageshow', syncLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncLocation);
      window.removeEventListener('storage', syncLocation);
      window.removeEventListener('focus', syncLocation);
      window.removeEventListener('pageshow', syncLocation);
    };
  }, []);

  const inventoryLocationTitle = savedLocation?.postalCode
    ? `${savedLocation.city}, ${savedLocation.state}`
    : null;

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

  const cityPart = inventoryLocationTitle?.split(',')[0] || '';
  const statePart = inventoryLocationTitle?.split(',')[1] || '';

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
            Shipping Containers <span className="text-primary">For Sale Near Me</span>
          </h1>

         {inventoryLocationTitle && (
  <div className="pl-[38.5rem] mt-[-12px]">
    <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
      <span className="text-white">
        {cityPart}
      </span>

      <span className="text-primary">
        ,{statePart}
      </span>
    </h2>
  </div>
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

              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                zipCode={zipCode}
                onZipSubmit={setZipCode}
              />
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
                      <FilterSidebar
                        filters={filters}
                        onFilterChange={setFilters}
                        zipCode={zipCode}
                        onZipSubmit={setZipCode}
                      />
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
