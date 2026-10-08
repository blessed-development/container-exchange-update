import React from 'react';
import { FileText, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSavedSelectedLocation } from '@/lib/locationEngine';

export default function SpecialtyQuotePanel({ product }) {
  const location = getSavedSelectedLocation();
  const params = new URLSearchParams({
    container: product?.name || 'Specialty shipping container',
    source: 'Specialty product page',
    ...(location?.postalCode ? { zip: location.postalCode } : {}),
    ...(location?.marketDisplayName ? { location: location.marketDisplayName } : {}),
  });

  return (
    <aside className="rounded-[28px] border border-border bg-card p-6 shadow-[0_16px_50px_rgba(15,23,42,0.12)] sm:p-8">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
        Specialty configuration
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground">
        Request a Quote
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Specialty containers are quoted individually. Share your location and requirements so our team can confirm the appropriate configuration and next steps.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-muted/35 p-4 text-sm">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-bold text-foreground">Delivery location</p>
            <p className="mt-1 leading-5 text-muted-foreground">
              {location?.marketDisplayName || location?.postalCode
                ? `${location.marketDisplayName || location.city || 'Selected location'}${location.postalCode ? ` • ${location.postalCode}` : ''}`
                : 'Add your ZIP or postal code in the quote form.'}
            </p>
          </div>
        </div>
      </div>

      <Link
        to={`/contact?${params.toString()}`}
        className="ce-signature-link mt-6 block"
      >
        <span className="ce-signature-button flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold">
          <FileText className="h-4 w-4" aria-hidden="true" />
          Request a Quote
        </span>
      </Link>
      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        No payment is collected from this page.
      </p>
    </aside>
  );
}
