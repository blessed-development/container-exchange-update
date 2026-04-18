import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ContainerGallery from '@/components/product/ContainerGallery';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import ZipLocator from '@/components/product/ZipLocator';
import ProductFAQ from '@/components/product/ProductFAQ';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, Loader2 } from 'lucide-react';

const GRADE_INFO = {
  'AS_IS': { label: 'As-Is', desc: 'Container may have cosmetic and structural issues. Sold as-is with no guarantees.' },
  'WWT': { label: 'Wind & Water Tight', desc: 'Guaranteed not to leak. May have dings, dents, and surface rust. Doors in working order.' },
  'CW': { label: 'Cargo Worthy', desc: 'Certified for international shipping. Structurally sound and watertight. Inspected by certified surveyor.' },
  'IICL': { label: 'IICL Certified', desc: 'Meets the highest international standards. Minimal wear, premium condition.' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const [zipCode, setZipCode] = useState(urlParams.get('zip') || '');

  const { data: container, isLoading } = useQuery({
    queryKey: ['container', id],
    queryFn: () => base44.entities.Container.filter({ id }),
    select: (data) => data?.[0] || null,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!container) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Container not found.</p>
          <Link to="/inventory" className="text-primary hover:underline">Browse all containers</Link>
        </div>
      </div>
    );
  }

  const gradeInfo = GRADE_INFO[container.grade] || {};
  const allImages = [container.image_url, ...(container.gallery_urls || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/inventory" className="hover:text-primary transition-colors">Inventory</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{container.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Title + rating above everything */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-3">{container.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(container.rating || 4.5) ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`} />
              ))}
            </div>
            <span className="text-sm font-semibold">{(container.rating || 4.5).toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({container.review_count || 0} reviews)</span>
            <Badge className="bg-primary/10 text-primary font-mono rounded-full px-3">{container.size}ft</Badge>
            {container.height === 'high_cube' && (
              <Badge variant="outline" className="font-mono text-primary border-primary rounded-full px-3">High Cube</Badge>
            )}
            <Badge variant="outline" className="font-mono rounded-full px-3">
              {container.condition?.charAt(0).toUpperCase() + container.condition?.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — Gallery + description + FAQ */}
          <div>
            <ContainerGallery images={allImages} />

            {/* Grade info */}
            <div className="mt-8 bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-5">
              <p className="text-xs font-mono text-primary tracking-widest mb-1">GRADE CLASSIFICATION</p>
              <p className="font-bold text-base mb-1">{gradeInfo.label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{gradeInfo.desc}</p>
            </div>

            {container.description && (
              <p className="text-muted-foreground leading-relaxed text-base mb-8">{container.description}</p>
            )}

            {/* FAQ */}
            <ProductFAQ />
          </div>

          {/* RIGHT — Zip + Configurator */}
          <div>
            <div className="lg:sticky lg:top-24 space-y-0">
              <ZipLocator zipCode={zipCode} onZipChange={setZipCode} />
              <ProductConfigurator />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="border-t border-border mt-8">
        <RelatedProducts zipCode={zipCode} />
      </div>
    </div>
  );
}