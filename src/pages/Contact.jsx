import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PageSeo from '@/components/seo/PageSeo';
import { isContactDeliveryEnabled, submitEnquiry } from '@/lib/submitEnquiry';
import { COMPANY_CONTACT } from '@/config/companyContact';

export default function Contact() {
  const contactDeliveryAvailable = isContactDeliveryEnabled;
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    zip_code: '',
    container_name: '',
    notes: '',
    location: '',
    source_form: 'Website quote request',
    company_website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const container = params.get('container');
    const zip = params.get('zip');
    const notes = params.get('notes');
    const location = params.get('location');
    const source = params.get('source');

    if (!container && !zip && !notes && !location && !source) return;

    setForm((prev) => ({
      ...prev,
      container_name: container || prev.container_name,
      zip_code: zip || prev.zip_code,
      notes: notes || prev.notes,
      location: location || prev.location,
      source_form: source || prev.source_form,
    }));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitEnquiry({ ...form, source_form: form.source_form });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error?.message || 'Quote request could not be delivered. Your entered details are still in the form.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo title="Contact Containers Exchange | Shipping Container Quotes & Support" description="Contact Containers Exchange for shipping container availability, local pricing, delivery questions, and expert support." path="/contact" />
      {/* Header */}
      <div className="bg-[#061226] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/[0.05] blur-[80px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">GET IN TOUCH</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Request a{' '}
            <span className="text-primary">Quote</span>
          </h1>
          <p className="text-white/50 mt-5 max-w-lg mx-auto text-lg">
            {contactDeliveryAvailable
              ? 'Tell us what you need and we will confirm receipt by email.'
              : 'Online quote delivery is being finalized. This form is currently unavailable for submissions.'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-mono text-muted-foreground tracking-widest mb-6">CONTACT US</h3>
              <div className="space-y-4">
                <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <a href={`tel:${COMPANY_CONTACT.businessPhoneHref}`} className="text-sm font-semibold transition-colors hover:text-primary">
                      {COMPANY_CONTACT.businessPhone}
                    </a>
                    <p className="text-xs text-muted-foreground">Mon-Fri 7AM-6PM PST</p>
                  </div>
                </div>
                <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <a href={`mailto:${COMPANY_CONTACT.email}`} className="block break-all text-[13px] font-semibold tracking-tight transition-colors hover:text-primary sm:break-normal sm:text-sm">
                      {COMPANY_CONTACT.email}
                    </a>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary/15">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">60+ Depot Locations</p>
                    <p className="text-xs text-muted-foreground">Nationwide USA / Canada Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 border border-border rounded-2xl bg-card shadow-lg"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Quote Request Submitted!</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  We received your request and sent a confirmation to your email address.
                </p>
                <Button onClick={() => { setIsSubmitted(false); setForm({ customer_name: '', customer_email: '', customer_phone: '', zip_code: '', container_name: '', notes: '', location: '', source_form: 'Website quote request', company_website: '' }); }} variant="outline" className="ce-secondary-button h-11 rounded-xl px-6">
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
                {!contactDeliveryAvailable && (
                  <div role="status" className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm leading-relaxed text-foreground">
                    <p className="font-bold">Online quote delivery is temporarily unavailable.</p>
                    <p className="mt-1 text-muted-foreground">Please do not complete this form yet. We will enable secure submissions after an approved business mailbox and durable rate limiting are configured.</p>
                  </div>
                )}

                <fieldset disabled={!contactDeliveryAvailable} className="space-y-6 disabled:opacity-60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-muted-foreground tracking-widest mb-2 block">
                      FULL NAME *
                    </label>
                    <Input
                      required
                      value={form.customer_name}
                      onChange={(e) => handleChange('customer_name', e.target.value)}
                      placeholder="John Doe"
                      className="h-11"
                    />
                    <input name="company_website" value={form.company_website} onChange={(e) => handleChange('company_website', e.target.value)} tabIndex="-1" autoComplete="off" className="sr-only" aria-hidden="true" />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground tracking-widest mb-2 block">
                      EMAIL *
                    </label>
                    <Input
                      required
                      type="email"
                      value={form.customer_email}
                      onChange={(e) => handleChange('customer_email', e.target.value)}
                      placeholder="john@example.com"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground tracking-widest mb-2 block">
                      PHONE
                    </label>
                    <Input
                      value={form.customer_phone}
                      onChange={(e) => handleChange('customer_phone', e.target.value)}
                      placeholder="Your callback number (optional)"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground tracking-widest mb-2 block">
                      ZIP CODE *
                    </label>
                    <Input
                      required
                      value={form.zip_code}
                      onChange={(e) => handleChange('zip_code', e.target.value.toUpperCase().slice(0, 7))}
                      placeholder="90210 or M5V 2T6"
                      className="h-11 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground tracking-widest mb-2 block">
                    CONTAINER INTEREST
                  </label>
                  <Select
                    value={form.container_name}
                    onValueChange={(val) => handleChange('container_name', val)}
                    disabled={!contactDeliveryAvailable}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select container type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20ft Standard">20ft Standard Container</SelectItem>
                      <SelectItem value="20ft High Cube">20ft High Cube Container</SelectItem>
                      <SelectItem value="40ft Standard">40ft Standard Container</SelectItem>
                      <SelectItem value="40ft High Cube">40ft High Cube Container</SelectItem>
                      <SelectItem value="10ft Mini">10ft Mini Container</SelectItem>
                      <SelectItem value="Other">Other / Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground tracking-widest mb-2 block">
                    MESSAGE
                  </label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Tell us about your project or any specific requirements..."
                    className="min-h-[120px]"
                  />
                </div>

                {submitError && (
                  <p className="text-sm font-medium text-destructive">
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !contactDeliveryAvailable}
                  className="ce-signature-button h-13 w-full rounded-xl font-semibold tracking-wider"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {contactDeliveryAvailable ? 'SUBMIT QUOTE REQUEST' : 'QUOTE DELIVERY UNAVAILABLE'}
                </Button>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
