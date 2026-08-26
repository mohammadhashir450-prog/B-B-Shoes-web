'use client';

import { useState, useEffect } from 'react';
import { Truck, Save, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { invalidateShippingCache } from '@/hooks/useShipping';

interface ShippingConfig {
  fee: number;
  isFree: boolean;
  freeThreshold: number;
  label: string;
}

export default function AdminShippingSettings() {
  const [config, setConfig] = useState<ShippingConfig>({
    fee: 0,
    isFree: true,
    freeThreshold: 0,
    label: 'Free',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // fee input as string so user can type freely
  const [feeInput, setFeeInput] = useState('0');
  const [thresholdInput, setThresholdInput] = useState('0');

  // ── Fetch current config ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings/shipping', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data as ShippingConfig;
          setConfig(d);
          setFeeInput(String(d.fee ?? 0));
          setThresholdInput(String(d.freeThreshold ?? 0));
        }
      } catch {
        setError('Could not load current shipping settings.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Compute preview label ───────────────────────────────────────────────
  const fee = Math.max(0, Number(feeInput) || 0);
  const threshold = Math.max(0, Number(thresholdInput) || 0);
  const effectivelyFree = config.isFree || fee === 0;

  const preview = (() => {
    if (config.isFree) return 'FREE always';
    if (fee === 0) return 'FREE (cost is 0)';
    if (threshold > 0) return `FREE above PKR ${threshold.toLocaleString()}, else PKR ${fee.toLocaleString()}`;
    return `PKR ${fee.toLocaleString()} on every order`;
  })();

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const body = {
        fee,
        isFree: config.isFree,
        freeThreshold: threshold,
      };
      const res = await fetch('/api/settings/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Save failed');

      const saved = json.data as ShippingConfig;
      setConfig(saved);
      setFeeInput(String(saved.fee));
      setThresholdInput(String(saved.freeThreshold));
      invalidateShippingCache(); // clear client-side cache so next visit re-fetches
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save shipping settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
          <Truck className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Shipping Settings</h3>
          <p className="text-white/50 text-sm">Manage delivery charges across the store</p>
        </div>
      </div>

      {/* Live Preview Badge */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37]/8 border border-[#D4AF37]/20">
        <Info className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
        <p className="text-sm text-[#D4AF37] font-semibold">
          Current: <span className="text-white">{preview}</span>
        </p>
      </div>

      {/* Toggle — Global Free */}
      <div className="bg-[#0B101E]/80 border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Global Free Shipping</p>
            <p className="text-white/50 text-xs mt-0.5">
              When ON — all orders ship free regardless of amount
            </p>
          </div>
          <button
            onClick={() => setConfig((c) => ({ ...c, isFree: !c.isFree }))}
            className="flex items-center gap-2 transition-all"
            aria-label="Toggle free shipping"
          >
            {config.isFree ? (
              <ToggleRight className="w-9 h-9 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-white/30" />
            )}
            <span className={`text-sm font-bold ${config.isFree ? 'text-emerald-400' : 'text-white/40'}`}>
              {config.isFree ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Chip: showing status */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
          config.isFree
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
            : 'bg-white/5 text-white/40 border border-white/10'
        }`}>
          {config.isFree ? '✓ Free shipping is active for all orders' : 'Custom fee mode — set below'}
        </div>
      </div>

      {/* Fee & Threshold inputs (shown when not globally free) */}
      {!config.isFree && (
        <div className="bg-[#0B101E]/80 border border-white/10 rounded-2xl p-5 space-y-4">
          <p className="text-white/70 text-sm font-semibold">Custom Shipping Fee</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping Fee */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Shipping Fee (PKR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₨</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  placeholder="e.g. 200"
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
              <p className="text-xs text-white/30 mt-1">Set to 0 for free shipping</p>
            </div>

            {/* Free Threshold */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Free Above (PKR) <span className="text-white/25">— optional</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₨</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
              <p className="text-xs text-white/30 mt-1">0 = no free threshold</p>
            </div>
          </div>

          {/* Preview of fee logic */}
          <div className="pt-1 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8 text-xs text-white/60">
            <span className="text-white/40">Preview: </span>
            {fee === 0
              ? <span className="text-emerald-400 font-semibold">Free on all orders</span>
              : threshold > 0
                ? <span>PKR {fee.toLocaleString()} per order · <span className="text-emerald-400">Free above PKR {threshold.toLocaleString()}</span></span>
                : <span>PKR {fee.toLocaleString()} on every order</span>
            }
          </div>
        </div>
      )}

      {/* Save button + feedback */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-[#D4AF37] text-[#06080F] hover:bg-[#C9A227] active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? (
            <><div className="w-4 h-4 rounded-full border-2 border-[#06080F]/40 border-t-[#06080F] animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Save Shipping Settings</>
          )}
        </button>

        {saved && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Saved! Changes are now live.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-1.5 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>

      {/* Info note */}
      <p className="text-xs text-white/25 leading-relaxed">
        Changes take effect immediately on checkout and all product pages. Existing orders are not affected retroactively.
      </p>
    </div>
  );
}
