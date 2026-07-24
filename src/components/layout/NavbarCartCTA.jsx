import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})}`;

function BasketCountIcon({ count }) {
  const label = count > 99 ? '99+' : String(count);
  const countClass = label.length > 2 ? 'text-[7px]' : label.length > 1 ? 'text-[8px]' : 'text-[10px]';

  return (
    <span className="relative grid h-8 w-9 shrink-0 place-items-center" aria-hidden="true">
      <svg viewBox="0 0 36 30" fill="none" className="absolute inset-0 h-full w-full">
        <path d="M11.5 9.25 14.1 4.5h7.8l2.6 4.75" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.75 9.8h26.5l-2.55 14H7.3l-2.55-14Z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`relative translate-y-px font-black leading-none tracking-[-0.06em] ${countClass}`}>{label}</span>
    </span>
  );
}

export default function NavbarCartCTA({ mobile = false, onNavigate }) {
  const { cart, getSubtotal, removeItem } = useCart();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const subtotal = getSubtotal();
  const hasItems = itemCount > 0;
  const frameClass = mobile
    ? 'h-12 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90'
    : 'h-10 w-28 rounded-lg bg-primary px-0 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40';
  const motionTransition = { duration: reducedMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] };

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

  const handleButtonClick = () => {
    if (hasItems) {
      setIsOpen((open) => !open);
      return;
    }

    onNavigate?.();
    navigate('/inventory');
  };

  const buttonLabel = hasItems
    ? `Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}, subtotal ${formatMoney(subtotal)}`
    : 'Get pricing';

  return (
    <div className={`relative ${mobile ? 'w-full' : ''}`} ref={containerRef}>
      <Button
        type="button"
        onClick={handleButtonClick}
        aria-label={buttonLabel}
        aria-haspopup={hasItems ? 'dialog' : undefined}
        aria-expanded={hasItems ? isOpen : undefined}
        className={`relative flex items-center justify-center overflow-hidden font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent ${frameClass}`}
      >
        <AnimatePresence initial={false} mode="wait">
          {hasItems ? (
            <motion.span
              key="cart-content"
              className="flex items-center justify-center gap-1 whitespace-nowrap"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={motionTransition}
            >
              <BasketCountIcon count={itemCount} />
              {!mobile && <span className="text-sm font-bold leading-none tracking-[-0.02em]">{formatMoney(subtotal)}</span>}
            </motion.span>
          ) : (
            <motion.span
              key="pricing-content"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={motionTransition}
            >
              Get Pricing
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {hasItems && isOpen && (
          <motion.section
            role="dialog"
            aria-label="Your cart"
            initial={reducedMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={motionTransition}
            className={`absolute z-[60] mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a1320]/95 text-white shadow-2xl shadow-black/50 backdrop-blur-xl ${mobile ? 'left-0' : 'right-0'}`}
          >
            <header className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
              <div>
                <h2 className="text-sm font-bold tracking-tight">Your Cart</h2>
                <p className="mt-0.5 text-xs text-white/50">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white" aria-label="Close cart">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-3">
              {cart.map((item) => (
                <article className="flex gap-3" key={item.id}>
                  {item.image || item.img ? <img src={item.image || item.img} alt="" className="h-14 w-[76px] rounded-xl bg-white/[0.06] object-cover" /> : <div className="h-14 w-[76px] rounded-xl bg-white/[0.06]" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white/90">{item.title}</h3>
                      <button type="button" onClick={() => removeItem(item.id)} className="rounded-md p-1 text-white/35 transition-colors hover:bg-white/[0.08] hover:text-primary" aria-label={`Remove ${item.title} from cart`}>
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
              <div className="mb-3 flex items-center justify-between text-sm"><span className="text-white/60">Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
              <Link to="/checkout" onClick={() => { setIsOpen(false); onNavigate?.(); }}>
                <Button className="h-10 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90">View Cart</Button>
              </Link>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
