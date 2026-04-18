import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Truck, Building2, Loader2 } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShippingCalculator({ container, initialZip = '', overridePrice }) {
  const [zip, setZip] = useState(initialZip);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (initialZip && isValidZipCode(initialZip)) {
      calculateShipping(initialZip);
    }
  }, [initialZip, container?.size]);

  const calculateShipping = (zipCode) => {
    if (!isValidZipCode(zipCode)) return;
    
    setIsCalculating(true);
    // Simulate brief calculation delay for UX
    setTimeout(() => {
      const info = calculateDeliveryFee(zipCode, container?.size || '20');
      setDeliveryInfo(info);
      setIsCalculating(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateShipping(zip);
  };

  const containerPrice = overridePrice ?? container?.base_price ?? 0;
  const deliveryFee = deliveryMethod === 'delivery' ? (deliveryInfo?.fee || 0) : 0;
  const totalPrice = containerPrice + deliveryFee;

  return (
    <div className="border border-border rounded-sm bg-card">
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/30">
        <p className="text-xs font-mono text-muted-foreground tracking-widest mb-1">EXCHANGE VALUE</p>
        <p className="text-3xl font-black text-primary font-mono">
          ${containerPrice.toLocaleString()}
        </p>
      </div>

      {/* ZIP Input */}
      <div className="p-5 border-b border-border">
        <p className="text-xs font-mono text-muted-foreground tracking-widest mb-3">
          STEP 1 — ENTER ZIP CODE
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="ZIP CODE"
              className="pl-10 font-mono tracking-wider h-11"
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90 h-11 px-5">
            {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CALCULATE'}
          </Button>
        </form>
      </div>

      {/* Delivery Method */}
      <div className="p-5 border-b border-border">
        <p className="text-xs font-mono text-muted-foreground tracking-widest mb-3">
          STEP 2 — DELIVERY METHOD
        </p>
        <Tabs value={deliveryMethod} onValueChange={setDeliveryMethod}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="delivery" className="gap-2 font-mono text-xs">
              <Truck className="w-4 h-4" />
              DELIVERY
            </TabsTrigger>
            <TabsTrigger value="pickup" className="gap-2 font-mono text-xs">
              <Building2 className="w-4 h-4" />
              CUSTOMER PICKUP
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Price Breakdown */}
      <AnimatePresence>
        {deliveryInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 border-b border-border"
          >
            <p className="text-xs font-mono text-muted-foreground tracking-widest mb-3">
              PRICE BREAKDOWN
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Container Cost</span>
                <span className="font-mono font-semibold">${containerPrice.toLocaleString()}</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery to {deliveryInfo.city}
                  </span>
                  <span className="font-mono font-semibold">${deliveryFee.toLocaleString()}</span>
                </div>
              )}
              {deliveryMethod === 'pickup' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer Pickup</span>
                  <span className="font-mono font-semibold text-green-600">FREE</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Exchange Value</span>
                  <span className="text-xl font-black text-primary font-mono">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              {deliveryMethod === 'delivery' && deliveryInfo.estimatedDays && (
                <p className="text-xs text-muted-foreground font-mono mt-2">
                  Estimated delivery: {deliveryInfo.estimatedDays} business days
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="p-5">
        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider text-sm">
          REQUEST QUOTE
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Or call <a href="tel:+18005551234" className="text-primary font-mono hover:underline">(800) 555-1234</a>
        </p>
      </div>
    </div>
  );
}