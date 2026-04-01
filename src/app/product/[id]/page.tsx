'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useProducts, Product as ProductType } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';
import { ChevronRight, ChevronDown, Star, Heart, ShoppingBag, Check, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { getProductById, loading: contextLoading } = useProducts();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try to get product from context
        const contextProduct = getProductById(params.id);
        
        if (contextProduct) {
          setProduct(contextProduct);
          if (contextProduct.colors && contextProduct.colors.length > 0) {
            setSelectedColor(contextProduct.colors[0]);
          }
          setLoading(false);
        } else if (!contextLoading) {
          // If not in context and context is loaded, fetch from API
          const response = await fetch(`/api/products/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            const fetchedProduct = data?.data || data?.product || null;
            setProduct(fetchedProduct);
            if (fetchedProduct?.colors && fetchedProduct.colors.length > 0) {
              setSelectedColor(fetchedProduct.colors[0]);
            }
          } else {
            setError('Product not found');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id, getProductById, contextLoading]);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;

    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: product.name,
      price: product.price,
      image: selectedDisplayImage || product.image,
      size: selectedSize,
      color: selectedColor || 'Default',
      category: product.category
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getSizeQuantityForColor = (sizeValue: string): number | null => {
    if (!product || !Array.isArray(product.sizeStock) || product.sizeStock.length === 0) {
      return null;
    }

    const bySize = product.sizeStock.filter((ss) => String(ss.size) === sizeValue);
    if (bySize.length === 0) {
      return 0;
    }

    if (selectedColor) {
      const exact = bySize.find((ss) => String(ss.color || '').toLowerCase() === selectedColor.toLowerCase());
      return exact ? Number(exact.quantity || 0) : 0;
    }

    return bySize.reduce((sum, ss) => sum + Number(ss.quantity || 0), 0);
  };

  useEffect(() => {
    if (!selectedSize || !product) return;

    const quantity = getSizeQuantityForColor(selectedSize);
    if (quantity !== null && quantity <= 0) {
      setSelectedSize(null);
    }
  }, [selectedColor, selectedSize, product]);

  const selectedDisplayImage = useMemo(() => {
    if (!product) return '';

    const fallback = String(product.image || '').trim();
    const variantImages = Array.isArray(product.sizeColorImages) ? product.sizeColorImages : [];
    if (!selectedColor || variantImages.length === 0) return fallback;

    const normalize = (value: unknown) => String(value || '').trim().toLowerCase();
    const targetColor = normalize(selectedColor);

    if (selectedSize) {
      const exactBySizeAndColor = variantImages.find((entry: any) => {
        const entryColor = normalize(entry?.color);
        const entrySize = String(entry?.size ?? '').trim();
        return entryColor === targetColor && entrySize === String(selectedSize);
      });

      const exactImage = String(exactBySizeAndColor?.image || '').trim();
      if (exactImage) return exactImage;
    }

    const byColor = variantImages.find((entry: any) => normalize(entry?.color) === targetColor);
    const colorImage = String(byColor?.image || '').trim();
    return colorImage || fallback;
  }, [product, selectedColor, selectedSize]);

  const colorImageOptions = useMemo(() => {
    if (!product || !Array.isArray(product.colors)) return [];

    const variantImages = Array.isArray(product.sizeColorImages) ? product.sizeColorImages : [];
    const normalize = (value: unknown) => String(value || '').trim().toLowerCase();

    return product.colors.map((color) => {
      const found = variantImages.find((entry: any) => normalize(entry?.color) === normalize(color) && String(entry?.image || '').trim());
      return {
        color,
        image: String(found?.image || product.image || '').trim(),
      };
    }).filter((entry) => entry.image);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#0B101E]">
        <Navbar />
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white text-[#0B101E]">
        <Navbar />
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist'}</p>
          <Link 
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedPrice = `PKR ${product.price.toLocaleString()}`;
  const hasDiscountPricing = Boolean(product.originalPrice && product.originalPrice > product.price);
  const formattedOriginalPrice = hasDiscountPricing ? `PKR ${Number(product.originalPrice).toLocaleString()}` : '';
  const serialNumber = String(product.id || '').slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-white text-[#0B101E] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(212,175,55,0.08),transparent_38%),radial-gradient(circle_at_88%_16%,rgba(0,0,0,0.03),transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbfb_55%,#ffffff_100%)] pointer-events-none" />
      <Navbar />

      <div className="pt-24 pb-16 md:pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">HOME</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${product.category.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors">{product.category.toUpperCase()}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B101E] uppercase">{product.name}</span>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Left Side - Image */}
            <div>
              <div className="bg-[#F8F8F8] rounded-3xl overflow-hidden mb-6 aspect-square relative border border-gray-200">
                <img 
                  src={selectedDisplayImage || product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold uppercase tracking-wider">Out of Stock</span>
                  </div>
                )}
              </div>
              {colorImageOptions.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {colorImageOptions.map((entry) => (
                    <button
                      key={entry.color}
                      type="button"
                      onClick={() => setSelectedColor(entry.color)}
                      className={`rounded-xl overflow-hidden border-2 transition-all ${
                        selectedColor === entry.color
                          ? 'border-[#D4AF37] shadow-[0_0_0_1px_rgba(212,175,55,0.4)]'
                          : 'border-gray-200 hover:border-[#0B101E]/50'
                      }`}
                      aria-label={`Select ${entry.color} image`}
                    >
                      <div className="relative aspect-square">
                        <img src={entry.image} alt={`${entry.color} preview`} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide py-2 bg-white text-[#0B101E]">{entry.color}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37] px-4 py-1 rounded-full">
                  <span className="text-[#D4AF37] text-xs font-bold tracking-wider">{product.category}</span>
                </div>
                <div className="inline-block bg-[#0B101E]/5 border border-[#0B101E]/20 px-4 py-1 rounded-full">
                  <span className="text-[#0B101E] text-xs font-bold tracking-wider">SERIAL #{serialNumber}</span>
                </div>
                {product.isNewArrival && (
                  <div className="inline-block bg-green-500/10 border border-green-500 px-4 py-1 rounded-full">
                    <span className="text-green-500 text-xs font-bold tracking-wider">NEW ARRIVAL</span>
                  </div>
                )}
                {product.isOnSale && (
                  <div className="inline-block bg-red-500/10 border border-red-500 px-4 py-1 rounded-full">
                    <span className="text-red-500 text-xs font-bold tracking-wider">ON SALE</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < (product.rating || 0) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-300 text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">({product.reviews || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-6">
                <span className="text-3xl font-bold text-[#D4AF37]">{formattedPrice}</span>
                {hasDiscountPricing ? (
                  <span className="text-lg text-gray-400 line-through">{formattedOriginalPrice}</span>
                ) : null}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-700 leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold tracking-wider uppercase text-gray-700">
                      COLOR: <span className="text-[#D4AF37]">{selectedColor || 'Select'}</span>
                    </label>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color 
                            ? 'border-[#0B101E] bg-[#0B101E] text-white shadow-sm' 
                            : 'bg-white text-[#0B101E] border-gray-300 hover:border-[#0B101E]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold tracking-wider uppercase text-gray-700">
                      SELECT SIZE: <span className="text-[#D4AF37]">{selectedSize || 'Choose'}</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.map((size) => {
                      const normalizedSize = String(size);
                      const quantity = getSizeQuantityForColor(normalizedSize);
                      const hasExplicitInventory = quantity !== null;
                      const isOutOfStock = hasExplicitInventory && quantity <= 0;
                      
                      return (
                        <button
                          key={normalizedSize}
                          onClick={() => !isOutOfStock && setSelectedSize(normalizedSize)}
                          disabled={isOutOfStock}
                          className={`py-3 rounded-lg font-semibold border-2 transition-all relative ${
                            selectedSize === normalizedSize
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                              : isOutOfStock
                              ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-75'
                              : 'bg-white text-black border-gray-300 hover:border-[#D4AF37] hover:bg-[#FFF7D9]'
                          }`}
                        >
                          {normalizedSize}
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {product.sizeStock && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {product.sizes.map((size) => {
                        const normalizedSize = String(size);
                        const quantity = getSizeQuantityForColor(normalizedSize);
                        const isLowStock = quantity !== null && quantity > 0 && quantity <= 3;
                        const isOutOfStock = quantity === 0;
                        
                        return (
                          <div key={normalizedSize} className={`px-2 py-1.5 rounded text-center font-semibold ${
                            quantity === null
                              ? 'bg-blue-100 text-blue-700'
                              :
                            isOutOfStock 
                              ? 'bg-red-100 text-red-700'
                              : isLowStock
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {normalizedSize}: {quantity === null ? 'In Stock' : quantity > 0 ? quantity : 'Out'}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !product.inStock}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_24px_-10px_rgba(212,175,55,0.6)] hover:shadow-[0_16px_30px_-12px_rgba(212,175,55,0.75)]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {!product.inStock ? 'OUT OF STOCK' : showSuccess ? 'ADDED TO BAG!' : 'ADD TO BAG'}
                </button>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`border-2 transition-all p-4 rounded-xl ${isWishlisted(product.id) ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-300 hover:border-[#D4AF37]'}`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted(product.id) ? 'fill-[#D4AF37] stroke-[#D4AF37]' : ''}`} />
                </button>
              </div>

              {/* Expandable Sections */}
              <div className="space-y-4">
                {/* Product Details */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transform-gpu transition-all duration-300 hover:-translate-y-1">
                  <button
                    onClick={() => toggleSection('composition')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold tracking-wider text-sm text-[#0B101E]">PRODUCT DETAILS</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'composition' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === 'composition' && (
                    <div className="p-4 pt-0 space-y-2 text-sm text-gray-700">
                      <p>• Premium quality materials</p>
                      <p>• Expert craftsmanship</p>
                      <p>• Durable construction</p>
                      <p>• Available in multiple sizes and colors</p>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transform-gpu transition-all duration-300 hover:-translate-y-1">
                  <button
                    onClick={() => toggleSection('shipping')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold tracking-wider text-sm text-[#0B101E]">SHIPPING & RETURNS</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'shipping' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === 'shipping' && (
                    <div className="p-4 pt-0 space-y-2 text-sm text-gray-700">
                      <p>• Free shipping on orders above PKR 4,000</p>
                      <p>• Delivery within 3-5 business days</p>
                      <p>• Easy returns within 7 days</p>
                      <p>• 100% secure checkout</p>
                    </div>
                  )}
                </div>

                {/* About B&B Shoes */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transform-gpu transition-all duration-300 hover:-translate-y-1">
                  <button
                    onClick={() => toggleSection('heritage')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold tracking-wider text-sm text-[#0B101E]">ABOUT B&B SHOES</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'heritage' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === 'heritage' && (
                    <div className="p-4 pt-0 space-y-3 text-sm text-gray-700">
                      <p>B&B Shoes represents the perfect blend of traditional craftsmanship and modern design.</p>
                      <p>Each piece is carefully selected to ensure the highest standards of quality and comfort.</p>
                      <p>Trust in our commitment to excellence with every purchase.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 py-4 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg overflow-hidden border border-gray-200">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-sm">{product.name}</p>
              <p className="text-gray-500 text-xs">{selectedColor || 'Color'} / Size {selectedSize || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <span className="text-xl font-bold text-[#D4AF37] block">{formattedPrice}</span>
              {hasDiscountPricing ? (
                <span className="text-xs text-gray-400 line-through block">{formattedOriginalPrice}</span>
              ) : null}
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize || !product.inStock}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_24px_-10px_rgba(212,175,55,0.6)] hover:shadow-[0_16px_30px_-12px_rgba(212,175,55,0.75)]"
            >
              {!product.inStock ? 'OUT OF STOCK' : showSuccess ? 'ADDED!' : 'ADD TO BAG'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 right-4 bg-[#D4AF37] text-black px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-slide-in">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="font-bold">Added to Bag!</p>
            <Link href="/bag" className="text-sm underline hover:no-underline">
              View Bag
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
