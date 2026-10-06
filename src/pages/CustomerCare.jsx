import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, FileText, ShieldCheck, Truck } from 'lucide-react';
import PageSeo from '@/components/seo/PageSeo';
import { CUSTOMER_CARE_POLICIES } from '@/data/customerCarePolicies';

const ICONS = [Truck, ShieldCheck, ClipboardCheck, FileText, ShieldCheck];

export default function CustomerCare() {
  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Guides & Policies | Containers Exchange"
        description="Find clear guidance for container conditions, reservations, delivery preparation, order support, and privacy."
        path="/customer-care"
      />

      <header className="relative overflow-hidden bg-[#061226] py-24 text-white sm:py-28">
        <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/15 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-mono font-semibold tracking-[0.18em] text-primary">GUIDES & POLICIES</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Clear information for a confident container purchase.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Review practical guidance before you request a quote, confirm an order, or prepare your site for delivery.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Link
          to="/delivery"
          className="group mb-5 block rounded-2xl border border-primary/25 bg-primary/[0.06] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-xl"
        >
          <div className="flex items-start justify-between gap-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Truck className="h-5 w-5" />
            </div>
            <ArrowRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <h2 className="mt-7 text-xl font-black tracking-tight text-foreground">Delivery & Site Preparation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Prepare access, placement, and delivery details before your order is confirmed.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Read delivery guidance <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {CUSTOMER_CARE_POLICIES.map((policy, index) => {
            const Icon = ICONS[index] || FileText;
            return (
              <Link
                key={policy.slug}
                to={`/customer-care/${policy.slug}`}
                className="group rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.10] text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h2 className="mt-7 text-xl font-black tracking-tight text-foreground">{policy.title}</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{policy.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read guidance <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <aside className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.05] p-6 sm:p-8">
          <h2 className="text-xl font-black text-foreground">Need an answer about a specific order?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Include the container size, condition, location, and any delivery question in your message so our team can review the right details.
          </p>
          <Link to="/contact?source=Customer%20Care" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Contact Containers Exchange <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </main>
    </div>
  );
}
