import React from 'react';
import { Check, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import './ShippingCalculator.css';

const dimensionsFor = (product) => {
  const height = product?.height === 'high_cube' ? "9'6\" H" : "8'6\" H";
  return `${product?.size || 20}' L × 8' W × ${height}`;
};

export default function SpecialtyQuotePanel({ product }) {
  const isNew = String(product?.condition || '').toLowerCase() === 'new';
  const gradeLabel = isNew ? 'IICL Certified' : 'Used Reefer';
  const gradeNote = isNew
    ? 'New one-trip specialty configuration'
    : 'Unit details confirmed with quote';
  const params = new URLSearchParams({
    container: product?.name || 'Specialty shipping container',
    source: 'Specialty product page',
  });

  return (
    <aside className="widget specialty-configurator">
      <div className="step-label">ENTER ZIP / POSTAL CODE</div>
      <ZipCodeSearch
        variant="hero"
        appearance="calculator"
        showAction={false}
        showCurrentLocationControl
        className="calculator-location-search"
        placeholder="Enter your ZIP / Postal Code"
      />

      <div className="section-header"><span>CONTAINER SPECIFICATIONS</span></div>
      <div className="main-tabs specialty-specification-tab" aria-label="Fixed container specification">
        <div className="main-tab active" role="status">
          <span className="tab-title">{product?.size}ft{product?.height === 'high_cube' ? ' High Cube' : ''}</span>
          <span className="tab-sub">{dimensionsFor(product)}</span>
          <span className="tab-price">{isNew ? 'NEW / ONE-TRIP' : 'USED REEFER'}</span>
          <span className="main-tab-active-check" aria-hidden="true"><Check size={9} /></span>
        </div>
      </div>

      <div className="section-header"><span>GRADE CLASSIFICATION</span></div>
      <div className="section-card grade-section-card specialty-grade-card">
        <div className="grade-upgrade-grid">
          <div className="grade-upgrade-btn active" role="status">
            <span className="grade-name">{gradeLabel}</span>
            <span className="grade-delta included">{gradeNote}</span>
            <span className="grade-active-check" aria-hidden="true"><Check size={11} /></span>
          </div>
        </div>
      </div>

      <div className="checkout">
        <div className="checkout-inner">
          <div className="tax-note"><Lock size={13} /> Quote-only configuration</div>
          <hr className="divider" />
          <div className="total-row">
            <span className="total-lbl">Preview Price</span>
            <div className="flex flex-col items-end">
              <span className="total-price">${Number(product?.preview_price || 0).toLocaleString()}</span>
              <span className="mt-1 text-right text-[10px] font-medium text-muted-foreground">Construction display only</span>
            </div>
          </div>
          <Link to={`/contact?${params.toString()}`} className="ce-signature-link mt-4 block">
            <span className="ce-signature-button flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Request a Quote
            </span>
          </Link>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">No payment is collected from this page. Final price and configuration are confirmed by quote.</p>
        </div>
      </div>
    </aside>
  );
}
