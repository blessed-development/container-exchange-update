import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ContainerGallery from '@/components/product/ContainerGallery';
import ShippingCalculator from '@/components/product/ShippingCalculator';
import ContainerSpecs from '@/components/product/ContainerSpecs';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, Loader2, Phone } from 'lucide-react';

const GRADE_INFO = {
  'AS_IS': { label: 'As-Is', desc: 'Container may have cosmetic and structural issues. Sold as-is with no guarantees.' },
  'WWT': { label: 'Wind & Water Tight', desc: 'Guaranteed not to leak. May have dings, dents, and surface rust. Doors in working order.' },
  'CW': { label: 'Cargo Worthy', desc: 'Certified for international shipping. Structurally sound and watertight. Inspected by certified surveyor.' },
  'IICL': { label: 'IICL Certified', desc: 'Meets the highest international standards. Minimal wear, premium condition.' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const zipCode = urlParams.get('zip') || '';

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
          <Link to="/inventory" className="text-primary hover:underline">
            Browse all containers
          </Link>
        </div>
      </div>
    );
  }

  const gradeInfo = GRADE_INFO[container.grade] || {};
  const allImages = [container.image_url, ...(container.gallery_urls || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/inventory" className="hover:text-primary transition-colors">Inventory</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{container.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Gallery */}
          <div>
            <ContainerGallery images={allImages} />
            
            {/* Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-black text-foreground mb-4">{container.name}</h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-primary/10 text-primary font-mono">
                  {container.size}FT
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {container.condition?.toUpperCase()}
                </Badge>
                {container.height === 'high_cube' && (
                  <Badge variant="outline" className="font-mono text-primary border-primary">
                    HIGH CUBE
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{container.rating}</span>
                  <span className="text-xs text-muted-foreground">({container.review_count} reviews)</span>
                </div>
              </div>

              {/* Grade Info */}
              <div className="bg-muted/50 border border-border rounded-sm p-4 mb-6">
                <p className="text-xs font-mono text-muted-foreground tracking-widest mb-1">GRADE</p>
                <p className="font-semibold text-sm mb-1">{gradeInfo.label}</p>
                <p className="text-sm text-muted-foreground">{gradeInfo.desc}</p>
              </div>

              {container.description && (
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {container.description}
                </p>
              )}

              {/* Specs */}
              <ContainerSpecs container={container} />
            </div>
          </div>

          {/* Right - Calculator (Sticky) */}
          <div>
            <div className="lg:sticky lg:top-24">
              <ShippingCalculator container={container} initialZip={zipCode} />
              
              {/* Call Banner */}
              <div className="mt-4 bg-accent text-white rounded-sm p-4 flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-white/50 font-mono">CALL FOR BEST PRICING</p>
                  <a href="tel:+18005551234" className="font-mono font-bold text-primary hover:underline">
                    (800) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}