import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    zip_code: '',
    container_name: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await base44.entities.Quote.create({
      ...form,
      status: 'pending',
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-mono text-primary tracking-widest">GET IN TOUCH</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-3">
            REQUEST A{' '}
            <span className="text-primary">QUOTE</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Tell us what you need and we'll get back to you with the best pricing and delivery options for your location.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-mono text-muted-foreground tracking-widest mb-4">CONTACT US</h3>
              <div className="space-y-4">
                <a href="tel:+18005551234" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 border border-border rounded-sm flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-sm">(800) 555-1234</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 7AM-6PM PST</p>
                  </div>
                </a>
                <a href="mailto:info@containersexchange.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 border border-border rounded-sm flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">info@containersexchange.com</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-border rounded-sm flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">60+ Depot Locations</p>
                    <p className="text-xs text-muted-foreground">Nationwide USA Coverage</p>
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
                className="text-center py-20 border border-border rounded-sm bg-card"
              >
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quote Request Submitted</h3>
                <p className="text-muted-foreground mb-6">
                  Our team will review your request and contact you within 24 hours with pricing details.
                </p>
                <Button onClick={() => { setIsSubmitted(false); setForm({ customer_name: '', customer_email: '', customer_phone: '', zip_code: '', container_name: '', notes: '' }); }} variant="outline">
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 sm:p-8 space-y-6">
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
                      placeholder="(555) 123-4567"
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
                      onChange={(e) => handleChange('zip_code', e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="90210"
                      className="h-11 font-mono"
                      inputMode="numeric"
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  SUBMIT QUOTE REQUEST
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}