import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ContainerCard from '@/components/shared/ContainerCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function ShopBySize() {
  const { data: containers, isLoading } = useQuery({
    queryKey: ['shop-by-size-containers'],
    queryFn: () => base44.entities.Container.filter({ is_available: true }, '-created_date', 6),
    initialData: [],
  });

  return (
    <section className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6">
          <div>
            <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">BROWSE INVENTORY</span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              Shop Containers{' '}
              <span className="text-primary">by Size</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-md">
              New and used containers in various sizes, conditions, and grades — delivered to your site.
            </p>
          </div>
          <Link to="/inventory">
            <Button variant="outline" className="border-border text-foreground hover:bg-foreground hover:text-background font-semibold rounded-xl h-11 px-6 transition-all hover:-translate-y-0.5 hover:shadow-lg flex-shrink-0">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-5 w-full rounded-lg" />
                  <Skeleton className="h-8 w-32 rounded-lg" />
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
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground mb-4">No containers listed yet. Check back soon or contact us.</p>
            <Link to="/contact">
              <Button variant="outline" className="rounded-xl">Request a Quote</Button>
            </Link>
          </div>
        )}

        {containers.length > 0 && (
          <div className="mt-10 text-center">
            <Link to="/inventory">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-12 px-10 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                View All Containers for Sale <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}