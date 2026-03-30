'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { Product, SizeStock } from '@/context/ProductContext';

interface StockControlProps {
  product: Product;
  onSave: (product: Product, sizeStock: SizeStock[]) => Promise<void>;
  onClose: () => void;
}

export default function StockControl({ product, onSave, onClose }: StockControlProps) {
  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Default'];
  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState(false);
  const keyFor = (size: string | number, color: string) => `${product.id}-${String(size)}-${color}`;

  const getExistingQty = (size: string | number, color: string) => {
    const byColor = product.sizeStock?.find(
      (ss) => String(ss.size) === String(size) && String(ss.color || '') === String(color)
    );
    if (byColor) return byColor.quantity;

    const fallback = product.sizeStock?.find((ss) => String(ss.size) === String(size));
    return fallback?.quantity ?? 0;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newSizeStock: SizeStock[] = (product.sizes || []).flatMap((size) => (
        colors.map((color) => ({
          size,
          quantity: stockUpdates[keyFor(size, color)] ?? getExistingQty(size, color),
          color,
        }))
      ));

      await onSave(product, newSizeStock);
      onClose();
    } catch (err) {
      alert('Error updating stock: ' + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 pt-6 border-t border-white/10 space-y-4"
    >
      {product.sizes && product.sizes.length > 0 && (
        <>
          <h4 className="text-white/80 font-semibold text-sm mb-3">Manage Size + Color Stock Levels</h4>
          <div className="space-y-3">
            {product.sizes.map((size) => {
              return (
                <div key={String(size)} className="p-3 rounded-lg border border-white/15 bg-white/5">
                  <label className="block text-[10px] text-white/70 uppercase tracking-[0.1em] font-bold mb-3">
                    Size {size}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {colors.map((color) => {
                      const key = keyFor(size, color);
                      const currentQty = stockUpdates[key] ?? getExistingQty(size, color);
                      const isLowStock = currentQty > 0 && currentQty <= 3;
                      const isOutOfStock = currentQty === 0;

                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border transition-all ${
                            isOutOfStock
                              ? 'bg-red-500/20 border-red-400/50'
                              : isLowStock
                              ? 'bg-yellow-500/20 border-yellow-400/50'
                              : 'bg-green-500/20 border-green-400/50'
                          }`}
                        >
                          <label className="block text-[10px] text-white/70 uppercase tracking-[0.08em] font-bold mb-2 truncate">
                            {color}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) =>
                              setStockUpdates({
                                ...stockUpdates,
                                [key]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-[#0B101E] border border-white/20 rounded text-white text-center font-bold px-2 py-1 text-sm"
                          />
                          <p className={`text-xs mt-1 font-semibold text-center ${
                            isOutOfStock ? 'text-red-300' : isLowStock ? 'text-yellow-300' : 'text-green-300'
                          }`}>
                            {isOutOfStock ? 'Out' : isLowStock ? 'Low' : 'Good'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] font-bold py-2 px-4 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Stock Levels'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
