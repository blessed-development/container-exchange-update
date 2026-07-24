import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

export default function NavbarCartCTA({ mobile = false, onNavigate }) {
  const { cart, getSubtotal, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const itemCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const subtotal = getSubtotal();
  const hasItems = itemCount > 0;
  const emptyButtonClass = mobile
    ? 'w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-12'
    : 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 text-sm px-5';

  useEffect(() => {
    if (!hasItems) setIsOpen(false);
  }, [hasItems]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${mobile ? 'w-full' : ''}`} ref={containerRef}>
      <AnimatePresence initial={false} mode="wait">
        {hasItems ? (
          <motion.button
            key="cart-summary"
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent ${mobile ? 'h-12 w-full' : 'h-10'}`}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span className="rounded-full bg-black/15 px-1.5 py-0.5 text-xs font-bold leading-none">{itemCount}</span>
            <span>{formatMoney(subtotal)}</span>
          </motion.button>
        ) : (
          <motion.div
            key="get-pricing"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/inventory" onClick={onNavigate}>
              <Button className={emptyButtonClass}>Get Pricing</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Your cart"
            initial={reducedMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-[60] mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a1320]/95 text-white shadow-2xl shadow-black/50 backdrop-blur-xl ${mobile ? 'left-0' : 'right-0'}`}
          >
            <header className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
              <div>
                <h2 className="text-sm font-bold tracking-tight">Your Cart</h2>
                <p className="mt-0.5 text-xs text-white/50">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-3">
              {cart.map((item) => (
                <article className="flex gap-3" key={item.id}>
                  {item.image || item.img ? (
                    <img
                      src={item.image || item.img}
                      alt=""
                      className="h-14 w-[76px] rounded-xl bg-white/[0.06] object-cover"
                    />
                  ) : (
                    <div className="h-14 w-[76px] rounded-xl bg-white/[0.06]" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white/90">{item.title}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-1 text-white/35 transition-colors hover:bg-white/[0.08] hover:text-primary"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-xs text-white/55">
                      <span>Qty {item.qty}</span>
                      <span className="font-medium text-white/80">{formatMoney(item.unitPrice)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="border-t border-white/[0.08] px-4 py-3.5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <Link to="/checkout" onClick={() => { setIsOpen(false); onNavigate?.(); }}>
                <Button className="h-10 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                  View Cart
                </Button>
              </Link>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
