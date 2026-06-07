import React, { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import {
  lookupPostalCode,
  saveSelectedLocation,
  cleanPostal,
  isUsZip,
  isCanadianPostal,
} from '../../lib/locationEngine';

export default function ZipRequiredModal({ open, onClose, onSuccess }) {
  const [postalInput, setPostalInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!open) return;

    const raw = postalInput.trim().toUpperCase();
    const clean = cleanPostal(raw);

    if (!clean) {
      setError('');
      return;
    }

    const ready = isUsZip(clean) || isCanadianPostal(clean);

    if (!ready) {
      setError('');
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      setError('');

      try {
        const location = await lookupPostalCode(raw);
        saveSelectedLocation(location);
        setPostalInput('');
        onSuccess(location);
      } catch (err) {
        setError(err.message || 'Enter a valid ZIP / Postal Code.');
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [postalInput, open, onSuccess]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[26px] bg-[#080b10] border border-white/10 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
          <MapPin className="text-green-500" size={22} />
        </div>

        <h2 className="text-white text-2xl font-black tracking-tight mb-2">
          Enter ZIP / Postal Code
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          Enter your ZIP or postal code to view accurate local container prices.
        </p>

        <input
          autoFocus
          className="w-full h-14 rounded-2xl bg-black border border-white/10 px-4 text-white text-base outline-none focus:border-green-500"
          placeholder="Enter ZIP / Postal Code"
          value={postalInput}
          onChange={(e) => setPostalInput(e.target.value)}
        />

        {checking && (
          <p className="text-green-500 text-xs font-bold mt-3">
            Detecting location...
          </p>
        )}

        {error && (
          <p className="text-red-400 text-xs font-bold mt-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
