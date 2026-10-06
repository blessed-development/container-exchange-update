import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import PageSeo from '@/components/seo/PageSeo';
import { COMPANY_CONTACT } from '@/config/companyContact';
import { getCustomerCarePolicy } from '@/data/customerCarePolicies';

export default function CustomerCarePolicy() {
  const { policySlug } = useParams();
  const policy = getCustomerCarePolicy(policySlug);

  if (!policy) return <Navigate to="/customer-care" replace />;

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={`${policy.title} | Containers Exchange`}
        description={policy.summary}
        path={`/customer-care/${policy.slug}`}
      />

      <header className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <Link to="/customer-care" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Guides & Policies
          </Link>
          <p className="mt-8 text-xs font-mono font-semibold tracking-[0.18em] text-primary">{policy.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">{policy.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{policy.summary}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="space-y-10">
          {policy.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[15px] leading-7 text-muted-foreground">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-[15px] leading-7 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="mt-10 rounded-2xl bg-[#07111f] p-6 text-white sm:p-8">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-xl font-black">Questions before you proceed?</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">Email the Containers Exchange team with the container, location, and order detail you would like us to review.</p>
          <a href={`mailto:${COMPANY_CONTACT.email}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            {COMPANY_CONTACT.email} <ArrowRight className="h-4 w-4" />
          </a>
        </aside>
      </main>
    </div>
  );
}
