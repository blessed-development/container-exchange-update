import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ContainerCard from '@/components/shared/ContainerCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts() {
  const { data: containers, isLoading } = useQuery({
    queryKey: ['featured-containers'],
    queryFn: () => base44.entities.Container.filter({ is_available: true }, '-created_date', 6),
    initialData: [],
  });

  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono text-primary tracking-widest">INVENTORY</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-3">
              CONTAINERS{' '}
              <span className="text-primary">FOR SALE</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              New and used containers in various sizes, conditions, and grades.
            </p>
          </div>
          <Link to="/inventory">
            <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold tracking-wider">
              VIEW ALL <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : containers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {containers.map((container, i) => (
              <ContainerCard key={container.id} container={container} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-sm">
            <p className="text-muted-foreground mb-4">No containers listed yet. Check back soon!</p>
            <Link to="/contact">
              <Button variant="outline">Request a Quote</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}