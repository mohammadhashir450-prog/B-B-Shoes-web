'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingCart, Users, Plus, Edit2, Trash2, X, Save, Camera, Upload, Tag, Lock, Eye, EyeOff, TrendingUp, Sparkles, Crown, Check, ArrowRight, ChevronRight, Clock3, BarChart3, Wallet, PackageCheck, Search } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useProducts, Product } from '@/context/ProductContext';
import StockControl from '@/components/admin/StockControl';
import AdminSeasonalBanners from '@/components/admin/AdminSeasonalBanners';

interface Order {
  id: string;
  orderId?: string;
  user_id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  total: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentDetails?: {
    cod?: {
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
    };
    jazzcash?: {
      senderNumber?: string;
      transactionId?: string;
      receiverNumber?: string;
      receiverName?: string;
    };
    bank?: {
      bankName?: string;
      receiverAccountNumber?: string;
      receiverTitle?: string;
      senderAccountNumber?: string;
      transactionId?: string;
    };
    card?: {
      cardHolderName?: string;
      cardBrand?: string;
      cardLast4?: string;
      cardMasked?: string;
      expiryMonth?: string;
      expiryYear?: string;
      transactionId?: string;
    };
  };
  date: string;
}

const getRemainingLabel = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const two = (value: number) => String(value).padStart(2, '0');

  return `${days > 0 ? `${two(days)}d ` : ''}${two(hours)}h ${two(minutes)}m ${two(seconds)}s`;
};

export default function AdminPanel() {
  const DEFAULT_SIZES = ['7', '8', '9', '10', '11'];
  const DEFAULT_COLORS = ['Black'];
  const makeSizeColorKey = (size: string | number, color: string) => `${String(size)}__${String(color)}`;

  const buildInventoryMap = (
    sizes: Array<string | number>,
    colors: string[],
    existing?: any[]
  ): Record<string, number> => {
    const map: Record<string, number> = {};
    const source = Array.isArray(existing) ? existing : [];
    const safeColors = colors.length > 0 ? colors : DEFAULT_COLORS;

    sizes.forEach((size) => {
      safeColors.forEach((color) => {
        const key = makeSizeColorKey(size, color);
        const matchedByColor = source.find(
          (entry) => String(entry?.size) === String(size) && String(entry?.color || '') === String(color)
        );
        const fallbackBySize = source.find((entry) => String(entry?.size) === String(size));
        map[key] = Number((matchedByColor || fallbackBySize)?.quantity || 0);
      });
    });

    return map;
  };

  const router = useRouter();
  const { allProducts, getSaleProducts, getNewArrivals, refetchProducts, loading: contextLoading } = useProducts();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
  const [paymentSavingId, setPaymentSavingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSaleForm, setShowAddSaleForm] = useState(false);
  const [showAddNewArrivalForm, setShowAddNewArrivalForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSaleProduct, setEditingSaleProduct] = useState<Product | null>(null);
  const [editingNewArrival, setEditingNewArrival] = useState<Product | null>(null);
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  
  // Get filtered products from context
  const products = useMemo(() => {
    return allProducts.filter((p) => !p.isOnSale && !p.isNewArrival);
  }, [allProducts]);

  const searchedProducts = useMemo(() => {
    const normalized = productSearchQuery.trim().toLowerCase();

    return products
      .map((product, index) => ({
        product,
        serial: index + 1,
      }))
      .filter(({ product, serial }) => {
        if (!normalized) return true;

        const serialText = String(serial);
        const productName = String(product.name || '').toLowerCase();
        const productId = String(product.id || '').toLowerCase();

        return serialText.includes(normalized) || productName.includes(normalized) || productId.includes(normalized);
      });
  }, [products, productSearchQuery]);
  
  const salesProducts = useMemo(() => {
    return getSaleProducts();
  }, [getSaleProducts]);
  
  const newArrivals = useMemo(() => {
    return getNewArrivals();
  }, [getNewArrivals]);

  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | 'custom'>('30d');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  const filteredAnalyticsOrders = useMemo(() => {
    const now = new Date();

    if (analyticsRange === 'custom') {
      if (!customDateFrom || !customDateTo) return [];

      const from = new Date(customDateFrom);
      const to = new Date(customDateTo);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
        return [];
      }

      return orders.filter((order) => {
        const date = new Date(order.date);
        if (Number.isNaN(date.getTime())) return false;
        return date >= from && date <= to;
      });
    }

    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - (analyticsRange === '7d' ? 6 : 29));

    return orders.filter((order) => {
      const date = new Date(order.date);
      if (Number.isNaN(date.getTime())) return false;
      return date >= from && date <= now;
    });
  }, [orders, analyticsRange, customDateFrom, customDateTo]);

  const analytics = useMemo(() => {
    const grossRevenue = filteredAnalyticsOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const deliveredOrders = filteredAnalyticsOrders.filter((order) => String(order.status).toLowerCase() === 'delivered');
    const deliveredRevenue = deliveredOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const totalUnitsSold = filteredAnalyticsOrders.reduce((sum, order) => {
      const qty = (order.items || []).reduce((itemSum: number, item: any) => itemSum + (Number(item.quantity) || 0), 0);
      return sum + qty;
    }, 0);

    const statusCount = filteredAnalyticsOrders.reduce<Record<string, number>>((acc, order) => {
      const key = String(order.status || 'pending').toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const dayFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    const startDate = new Date();
    const endDate = new Date();
    let rangeLabel = 'Last 30 Days';

    if (analyticsRange === '7d') {
      startDate.setDate(endDate.getDate() - 6);
      rangeLabel = 'Last 7 Days';
    } else if (analyticsRange === '30d') {
      startDate.setDate(endDate.getDate() - 29);
      rangeLabel = 'Last 30 Days';
    } else {
      if (customDateFrom && customDateTo) {
        const from = new Date(customDateFrom);
        const to = new Date(customDateTo);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from <= to) {
          startDate.setTime(from.getTime());
          endDate.setTime(to.getTime());
          rangeLabel = `${dayFormatter.format(from)} - ${dayFormatter.format(to)}`;
        }
      }
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const dayCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const previousStart = new Date(startDate);
    previousStart.setDate(startDate.getDate() - dayCount);
    const previousEnd = new Date(startDate);
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

    const previousPeriodOrders = orders.filter((order) => {
      const date = new Date(order.date);
      if (Number.isNaN(date.getTime())) return false;
      return date >= previousStart && date <= previousEnd;
    });

    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const previousUnitsSold = previousPeriodOrders.reduce((sum, order) => {
      const qty = (order.items || []).reduce((itemSum: number, item: any) => itemSum + (Number(item.quantity) || 0), 0);
      return sum + qty;
    }, 0);
    const previousOrdersCount = previousPeriodOrders.length;

    const calculateGrowthPercent = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const revenueGrowthPercent = calculateGrowthPercent(grossRevenue, previousRevenue);
    const unitsGrowthPercent = calculateGrowthPercent(totalUnitsSold, previousUnitsSold);
    const ordersGrowthPercent = calculateGrowthPercent(filteredAnalyticsOrders.length, previousOrdersCount);

    const safeDayCount = Math.min(dayCount, 62);
    const trendData = Array.from({ length: safeDayCount }, (_, idx) => {
      const pointDate = new Date(startDate);
      pointDate.setDate(startDate.getDate() + idx);
      const key = pointDate.toISOString().slice(0, 10);

      return {
        key,
        label: dayFormatter.format(pointDate),
        revenue: 0,
      };
    });

    const trendIndex = trendData.reduce<Record<string, number>>((acc, point, idx) => {
      acc[point.key] = idx;
      return acc;
    }, {});

    filteredAnalyticsOrders.forEach((order) => {
      const orderDate = new Date(order.date);
      if (Number.isNaN(orderDate.getTime())) return;
      const key = orderDate.toISOString().slice(0, 10);
      const idx = trendIndex[key];
      if (idx !== undefined) {
        trendData[idx].revenue += Number(order.total) || 0;
      }
    });

    const productSalesMap = new Map<string, { units: number; revenue: number }>();
    filteredAnalyticsOrders.forEach((order) => {
      (order.items || []).forEach((item: any) => {
        const name = String(item.productName || item.name || 'Unknown Product');
        const units = Number(item.quantity) || 0;
        const revenue = (Number(item.price) || 0) * units;
        const existing = productSalesMap.get(name) || { units: 0, revenue: 0 };
        existing.units += units;
        existing.revenue += revenue;
        productSalesMap.set(name, existing);
      });
    });

    const topProducts = Array.from(productSalesMap.entries())
      .map(([name, metrics]) => ({ name, ...metrics }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const chartMax = Math.max(...trendData.map((point) => point.revenue), 1);
    const avgOrderValue = filteredAnalyticsOrders.length > 0 ? grossRevenue / filteredAnalyticsOrders.length : 0;

    return {
      grossRevenue,
      deliveredRevenue,
      totalUnitsSold,
      totalOrders: filteredAnalyticsOrders.length,
      deliveredOrders: deliveredOrders.length,
      pendingOrders: statusCount.pending || 0,
      processingOrders: statusCount.processing || 0,
      trendData,
      chartMax,
      avgOrderValue,
      topProducts,
      rangeLabel,
      previousRevenue,
      previousUnitsSold,
      previousOrdersCount,
      revenueGrowthPercent,
      unitsGrowthPercent,
      ordersGrowthPercent,
    };
  }, [filteredAnalyticsOrders, analyticsRange, customDateFrom, customDateTo, orders]);
  
  // Size and color management
  const [selectedSizes, setSelectedSizes] = useState<string[]>(DEFAULT_SIZES);
  const [selectedColors, setSelectedColors] = useState<string[]>(DEFAULT_COLORS);
  const [sizeInventory, setSizeInventory] = useState<Record<string, number>>(buildInventoryMap(DEFAULT_SIZES, DEFAULT_COLORS));
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [salesEndsAtInput, setSalesEndsAtInput] = useState('');
  const [timerSaving, setTimerSaving] = useState(false);
  const [timerMessage, setTimerMessage] = useState('');
  const [timerMode, setTimerMode] = useState<'custom' | 'duration'>('duration');
  const [timerDuration, setTimerDuration] = useState<number>(1);
  const [timerUnit, setTimerUnit] = useState<'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'>('days');
  const [tickerMessage, setTickerMessage] = useState('');
  const [tickerSpeed, setTickerSpeed] = useState<number>(18);
  const [flatSalePercent, setFlatSalePercent] = useState<number>(25);
  const [flatSaleProductIds, setFlatSaleProductIds] = useState<string[]>([]);
  const [removeFlatSaleProductIds, setRemoveFlatSaleProductIds] = useState<string[]>([]);
  const [flatSaleApplying, setFlatSaleApplying] = useState(false);
  const [flatSaleRemoving, setFlatSaleRemoving] = useState(false);
  const [flatSaleMessage, setFlatSaleMessage] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageUploadStatus, setImageUploadStatus] = useState('');
  const [secondaryImageUploadError, setSecondaryImageUploadError] = useState('');
  const [secondaryImageUploadStatus, setSecondaryImageUploadStatus] = useState('');
  
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    image: '',
    secondaryImage: '',
    sizeColorImages: [],
    category: 'Men',
    subcategory: '',
    brand: 'B&B',
    sizes: [],
    colors: [],
    description: '',
    rating: 4.5,
    reviews: 0,
    inStock: true,
    stock: 100,
    sold: 0,
    isOnSale: false,
    isNewArrival: false
  });

  const previewMaxDiscount = useMemo(() => {
    const productMax = allProducts.reduce((max, product) => {
      const discount = Number(product.discount || 0);
      if (discount > max) return discount;

      if ((product.originalPrice || 0) > product.price && product.originalPrice) {
        const computed = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        return Math.max(max, computed);
      }

      return max;
    }, 0);

    return Math.max(productMax, Math.min(100, Math.max(0, Number(flatSalePercent) || 0)));
  }, [allProducts, flatSalePercent]);

  const previewSalesEndMs = useMemo(() => {
    if (timerMode === 'duration') {
      const duration = Math.max(1, Number(timerDuration) || 1);
      const multipliers: Record<'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years', number> = {
        seconds: 1000,
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
        weeks: 7 * 24 * 60 * 60 * 1000,
        months: 30 * 24 * 60 * 60 * 1000,
        years: 365 * 24 * 60 * 60 * 1000,
      };

      return Date.now() + duration * multipliers[timerUnit];
    }

    if (!salesEndsAtInput) return null;
    const parsed = new Date(salesEndsAtInput).getTime();
    return Number.isFinite(parsed) ? parsed : null;
  }, [timerMode, timerDuration, timerUnit, salesEndsAtInput]);

  const previewRemainingLabel = useMemo(() => {
    if (!previewSalesEndMs) return '00h 00m 00s';
    return getRemainingLabel(previewSalesEndMs - Date.now());
  }, [previewSalesEndMs]);

  const previewSalesEndLabel = useMemo(() => {
    if (!previewSalesEndMs) return '--';

    return new Intl.DateTimeFormat('en-PK', {
      timeZone: 'Asia/Karachi',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(previewSalesEndMs));
  }, [previewSalesEndMs]);

  const previewTickerDurationSeconds = Number.isFinite(tickerSpeed)
    ? Math.min(45, Math.max(6, tickerSpeed))
    : 18;

  const previewTickerText = `${(tickerMessage.trim() || `Flash Sale Live | Up to ${previewMaxDiscount}% Off | Ends In ${previewRemainingLabel} | Ends ${previewSalesEndLabel} PKT | Shop Now`)} | Up to ${previewMaxDiscount}% Off | Ends In ${previewRemainingLabel} | Ends ${previewSalesEndLabel} PKT`;

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders?scope=all');
          if (response.ok) {
            const data = await response.json();
            setOrders(data?.data?.orders || []);
          }
        } catch (error) { 
          console.error(error); 
        }
      };

      fetchOrders();

      const fetchSalesTimer = async () => {
        try {
          const response = await fetch('/api/settings/sales-timer', { cache: 'no-store' });
          if (!response.ok) return;

          const result = await response.json();
          const endsAt = result?.data?.salesEndsAt;
          setTickerMessage(result?.data?.salesTickerMessage || '');
          setTickerSpeed(Number(result?.data?.salesTickerSpeed || 18));
          setFlatSalePercent(Math.min(100, Math.max(1, Number(result?.data?.flatSalePercent || 25))));
          if (endsAt) {
            const date = new Date(endsAt);
            if (!Number.isNaN(date.getTime())) {
              const timezoneOffset = date.getTimezoneOffset() * 60000;
              const localDate = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
              setSalesEndsAtInput(localDate);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchSalesTimer();
    }
  }, [isAuthenticated]);

  const saveSalesTimer = async () => {
    setTimerMessage('');
    setTimerSaving(true);

    try {
      let endDateTime: string | null = null;

      if (timerMode === 'duration') {
        // Calculate end date based on duration
        const now = new Date();
        const durationMs = timerDuration * (
          timerUnit === 'seconds' ? 1000 :
          timerUnit === 'minutes' ? 60 * 1000 :
          timerUnit === 'hours' ? 60 * 60 * 1000 :
          timerUnit === 'days' ? 24 * 60 * 60 * 1000 :
          timerUnit === 'weeks' ? 7 * 24 * 60 * 60 * 1000 :
          timerUnit === 'months' ? 30 * 24 * 60 * 60 * 1000 :
          365 * 24 * 60 * 60 * 1000 // years
        );
        
        const endDate = new Date(now.getTime() + durationMs);
        endDateTime = endDate.toISOString();
      } else {
        // Use custom datetime
        if (salesEndsAtInput) {
          const date = new Date(salesEndsAtInput);
          endDateTime = date.toISOString();
        }
      }

      const response = await fetch('/api/settings/sales-timer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salesEndsAt: endDateTime,
          salesTickerMessage: tickerMessage,
          salesTickerSpeed: tickerSpeed,
          flatSalePercent,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to update sales timer');
      }

      setTimerMessage('Sales timer updated successfully.');
    } catch (error) {
      setTimerMessage(error instanceof Error ? error.message : 'Failed to update sales timer');
    } finally {
      setTimerSaving(false);
    }
  };

  const applyFlatSaleToSelected = async () => {
    setFlatSaleMessage('');

    const normalizedPercent = Math.min(100, Math.max(1, Number(flatSalePercent) || 1));
    const selectedProducts = products.filter((product) => flatSaleProductIds.includes(String(product.id)));

    if (selectedProducts.length === 0) {
      setFlatSaleMessage('Select at least one product to apply flat sale.');
      return;
    }

    setFlatSaleApplying(true);
    try {
      const updates = selectedProducts.map(async (product) => {
        const basePrice = Number(product.price) || 0;
        const originalPrice = Number(product.originalPrice) > 0
          ? Number(product.originalPrice)
          : basePrice;

        if (originalPrice <= 0) {
          throw new Error(`Invalid original price for ${product.name}`);
        }

        const salePrice = Math.max(0, Math.round(originalPrice * (100 - normalizedPercent) / 100));

        const response = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...product,
            isOnSale: true,
            discount: normalizedPercent,
            originalPrice,
            price: salePrice,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || `Failed to update ${product.name}`);
        }
      });

      await Promise.all(updates);
      setFlatSaleProductIds([]);
      setFlatSaleMessage(`Flat ${normalizedPercent}% sale applied to ${selectedProducts.length} product(s).`);
      await refetchProducts();
    } catch (error) {
      setFlatSaleMessage(error instanceof Error ? error.message : 'Failed to apply flat sale');
    } finally {
      setFlatSaleApplying(false);
    }
  };

  const removeFlatSaleFromSelected = async () => {
    setFlatSaleMessage('');

    const selectedSaleProducts = salesProducts.filter((product) => removeFlatSaleProductIds.includes(String(product.id)));

    if (selectedSaleProducts.length === 0) {
      setFlatSaleMessage('Select at least one sale product to remove flat sale.');
      return;
    }

    setFlatSaleRemoving(true);
    try {
      const updates = selectedSaleProducts.map(async (product) => {
        const restorePrice = Number(product.originalPrice) > 0
          ? Number(product.originalPrice)
          : Number(product.price) || 0;

        if (restorePrice <= 0) {
          throw new Error(`Invalid restore price for ${product.name}`);
        }

        const response = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...product,
            isOnSale: false,
            discount: 0,
            originalPrice: 0,
            price: restorePrice,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || `Failed to update ${product.name}`);
        }
      });

      await Promise.all(updates);
      setRemoveFlatSaleProductIds([]);
      setFlatSaleMessage(`Sale removed from ${selectedSaleProducts.length} product(s).`);
      await refetchProducts();
    } catch (error) {
      setFlatSaleMessage(error instanceof Error ? error.message : 'Failed to remove sale');
    } finally {
      setFlatSaleRemoving(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (password === 'hashir189') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'authenticated');
      setPassword('');
    } else {
      setAuthError('Access Denied: Invalid Security Key');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    router.push('/');
  };

  const updateOrderStatus = async (order: Order, nextStatus: 'pending' | 'processing' | 'delivered') => {
    const targetId = order.orderId || order.id;
    if (!targetId) return;

    try {
      setStatusSavingId(order.id);
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: targetId, status: nextStatus }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to update order status');
      }

      setOrders((prev) => prev.map((o) => (
        o.id === order.id ? { ...o, status: nextStatus } : o
      )));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setStatusSavingId(null);
    }
  };

  const updatePaymentStatus = async (order: Order, nextPaymentStatus: 'pending' | 'paid' | 'failed') => {
    const targetId = order.orderId || order.id;
    if (!targetId) return;

    try {
      setPaymentSavingId(order.id);
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: targetId, paymentStatus: nextPaymentStatus }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to update payment status');
      }

      setOrders((prev) => prev.map((o) => (
        o.id === order.id
          ? {
              ...o,
              paymentStatus: nextPaymentStatus,
              status: (nextPaymentStatus === 'paid' && o.status === 'pending') ? 'processing' : o.status,
            }
          : o
      )));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update payment status');
    } finally {
      setPaymentSavingId(null);
    }
  };

  // --- PRE-AUTH VIEW (THE VAULT LOGIN) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B101E] relative flex flex-col items-center justify-center overflow-hidden selection:bg-[#D4AF37]/30 selection:text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] relative z-10 px-6"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#F4CE5C] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <Crown className="w-10 h-10 text-[#0B101E]" />
            </div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              Restricted Area
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-tight mb-2">
              The <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">Vault</span>
            </h1>
          </div>

          <div className="bg-[#121A2F]/40 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <AnimatePresence>
              {authError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                    <p className="text-red-400 text-xs tracking-wide text-center font-bold uppercase">{authError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold ml-1">
                  Master Key
                </label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all duration-300" 
                    placeholder="Enter master key..." 
                    required 
                    autoFocus
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit" 
                className="w-full group relative bg-[#D4AF37] text-[#0B101E] font-black py-4 rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[10px] hover:bg-white overflow-hidden mt-6"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span>Authorize</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- POST-AUTH VIEW (THE ADMIN DASHBOARD) ---
  const addSize = () => {
    const size = newSize.trim();
    if (size && !selectedSizes.includes(size)) {
      const nextSizes = [...selectedSizes, size].sort();
      setSelectedSizes(nextSizes);
      setSizeInventory((prev) => {
        const next = { ...prev };
        selectedColors.forEach((color) => {
          const key = makeSizeColorKey(size, color);
          next[key] = next[key] ?? 0;
        });
        return next;
      });
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSelectedSizes(selectedSizes.filter(s => s !== size));
    setSizeInventory((prev) => {
      const next = { ...prev };
      selectedColors.forEach((color) => {
        delete next[makeSizeColorKey(size, color)];
      });
      return next;
    });
  };

  const addColor = () => {
    const color = newColor.trim();
    if (color && !selectedColors.includes(color)) {
      const nextColors = [...selectedColors, color];
      setSelectedColors(nextColors);
      setSizeInventory((prev) => {
        const next = { ...prev };
        selectedSizes.forEach((size) => {
          const key = makeSizeColorKey(size, color);
          next[key] = next[key] ?? 0;
        });
        return next;
      });
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    const nextColors = selectedColors.filter(c => c !== color);
    setSelectedColors(nextColors);
    setSizeInventory((prev) => {
      const next = { ...prev };
      selectedSizes.forEach((size) => {
        delete next[makeSizeColorKey(size, color)];
      });
      return next;
    });

    const pruneVariantImages = (variants: any[] | undefined) => {
      if (!Array.isArray(variants)) return [];
      return variants.filter((entry) => String(entry?.color || '').toLowerCase() !== color.toLowerCase());
    };

    if (editingProduct) {
      setEditingProduct((prev) => (prev ? { ...prev, sizeColorImages: pruneVariantImages((prev as any).sizeColorImages) } : prev));
    } else if (editingSaleProduct) {
      setEditingSaleProduct((prev) => (prev ? { ...prev, sizeColorImages: pruneVariantImages((prev as any).sizeColorImages) } : prev));
    } else if (editingNewArrival) {
      setEditingNewArrival((prev) => (prev ? { ...prev, sizeColorImages: pruneVariantImages((prev as any).sizeColorImages) } : prev));
    } else {
      setNewProduct((prev) => ({ ...prev, sizeColorImages: pruneVariantImages((prev as any).sizeColorImages) }));
    }
  };

  const handleAction = async (method: string, url: string, body: any) => {
    try {
      setLoading(true);
      console.log(`📤 ${method} ${url}:`, { image: body.image ? '✅ Present' : '❌ Missing' });
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const responseData = await res.json();
      console.log(`📥 Response:`, { ok: res.ok, image: responseData?.data?.image ? '✅ Saved' : '❌ Not saved' });
      if (res.ok) {
        alert('✓ Action completed successfully!');
        await refetchProducts();
        setShowAddForm(false);
        setShowAddSaleForm(false);
        setShowAddNewArrivalForm(false);
        setEditingProduct(null);
        setEditingSaleProduct(null);
        setEditingNewArrival(null);
        setSelectedSizes(DEFAULT_SIZES);
        setSelectedColors(DEFAULT_COLORS);
        setSizeInventory(buildInventoryMap(DEFAULT_SIZES, DEFAULT_COLORS));
        setImageUploadError('');
        setImageUploadStatus('');
        setSecondaryImageUploadError('');
        setSecondaryImageUploadStatus('');
      } else {
        alert('✗ Failed to save changes: ' + (responseData?.message || 'Unknown error'));
      }
    } catch (err) { 
      console.error('❌ Error:', err);
      alert('✗ Error occurred: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setLoading(false);
    }
  };

  const currentProduct = editingProduct || editingSaleProduct || editingNewArrival || newProduct;
  const isSaleWorkflow = activeTab === 'sales' || showAddSaleForm || Boolean(editingSaleProduct);
  const currentColorImages = Array.isArray((currentProduct as any)?.sizeColorImages)
    ? (currentProduct as any).sizeColorImages
    : [];

  const assignProductValue = (updates: Partial<Product>) => {
    if (editingProduct) {
      setEditingProduct((prev) => (prev ? { ...prev, ...updates } : prev));
      return;
    }
    if (editingSaleProduct) {
      setEditingSaleProduct((prev) => (prev ? { ...prev, ...updates } : prev));
      return;
    }
    if (editingNewArrival) {
      setEditingNewArrival((prev) => (prev ? { ...prev, ...updates } : prev));
      return;
    }
    setNewProduct((prev) => ({ ...prev, ...updates }));
  };

  const getColorImage = (color: string) => {
    const found = currentColorImages.find(
      (entry: any) => String(entry?.color || '').toLowerCase() === color.toLowerCase() && String(entry?.image || '').trim()
    );
    return String(found?.image || '').trim();
  };

  const setColorImage = (color: string, imageUrl: string) => {
    const normalize = (value: unknown) => String(value || '').trim().toLowerCase();

    const applyFor = (productState: Product | null) => {
      if (!productState) return productState;

      const existing = Array.isArray((productState as any).sizeColorImages)
        ? (productState as any).sizeColorImages
        : [];

      const next = existing.filter(
        (entry: any) => normalize(entry?.color) !== normalize(color)
      );

      next.push({ size: 0, color: String(color).trim(), image: String(imageUrl).trim() });
      return { ...productState, sizeColorImages: next as any };
    };

    if (editingProduct) {
      setEditingProduct((prev) => applyFor(prev));
      return;
    }
    if (editingSaleProduct) {
      setEditingSaleProduct((prev) => applyFor(prev));
      return;
    }
    if (editingNewArrival) {
      setEditingNewArrival((prev) => applyFor(prev));
      return;
    }

    setNewProduct((prev) => {
      const updated = applyFor(prev as Product | null);
      return (updated || prev) as Product;
    });
  };

  return (
    <div className="min-h-screen bg-[#0B101E] text-white selection:bg-[#D4AF37]/30 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Layers */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Premium Header */}
      <div className="sticky top-0 z-50 bg-[#0B101E]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Crown className="w-5 h-5 text-[#0B101E]" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-widest leading-none">B&B VAULT</h1>
              <p className="text-[8px] text-[#D4AF37] tracking-[0.3em] uppercase mt-1">Management Console</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="group flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
          >
            Logout
            <Lock size={12} className="group-hover:scale-110" />
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
        
        {/* Premium Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { key: 'products', label: 'Portfolio', icon: Package },
            { key: 'stock', label: 'Stock Control', icon: PackageCheck },
            { key: 'sales', label: 'Sales Event', icon: Tag },
            { key: 'seasonal-banners', label: 'Seasonal', icon: Sparkles },
            { key: 'newarrivals', label: 'New Drops', icon: Sparkles },
            { key: 'orders', label: 'Concierge (Orders)', icon: ShoppingCart },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-3.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase transition-all flex items-center gap-2.5 ${
                  isActive 
                    ? 'bg-[#D4AF37] text-[#0B101E] shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Global Form for Adding/Editing */}
        <AnimatePresence>
          {(showAddForm || showAddSaleForm || showAddNewArrivalForm || editingProduct || editingSaleProduct || editingNewArrival) && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-[#121A2F]/60 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 mb-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">
                        {editingProduct || editingSaleProduct || editingNewArrival ? 'Modify Asset' : 'Mint New Asset'}
                      </h2>
                      <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-1">Product Database</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowAddForm(false); setShowAddSaleForm(false); setShowAddNewArrivalForm(false);
                      setEditingProduct(null); setEditingSaleProduct(null); setEditingNewArrival(null);
                    }}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Image Upload Section */}
                <div className="mb-10 p-8 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Product Visuals</label>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[9px] font-bold tracking-[0.12em] uppercase border bg-emerald-500/15 text-emerald-300 border-emerald-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                      Upload Ready
                    </span>
                  </div>
                  <p className="text-[10px] tracking-wide text-white/45 uppercase mb-5">Uploaded image will be saved as-is.</p>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <p className="text-white/70 text-xs font-bold tracking-[0.18em] uppercase mb-3">Primary Image</p>
                      <div className="w-full h-48 bg-white rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative shadow-lg group">
                        {currentProduct.image ? (
                          <Image 
                            src={currentProduct.image}
                            alt="Primary preview"
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            unoptimized={currentProduct.image.includes('cloudinary')}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Camera size={32} className="text-white/20" />
                        )}
                      </div>

                      <div className="mt-4">
                        <CldUploadWidget
                          uploadPreset="bb_web"
                          options={{
                            cloudName: 'dt2ikjlfc',
                            sources: ['local', 'url', 'camera'],
                            multiple: false,
                            maxFiles: 1,
                            maxFileSize: 5000000,
                            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                            folder: 'bb_shoes'
                          }}
                          onSuccess={async (result: any) => {
                            try {
                              const uploadInfo = result?.info;
                              const imageUrl = String(uploadInfo?.secure_url || '').trim();
                              if (!uploadInfo) {
                                setImageUploadError('Image upload failed: No URL returned');
                                return;
                              }
                              if (!imageUrl) {
                                setImageUploadError('Image upload failed: Invalid image URL');
                                return;
                              }

                              setImageUploadError('');
                              setImageUploadStatus('✓ Primary image uploaded successfully');
                              setTimeout(() => setImageUploadStatus(''), 3000);
                              assignProductValue({ image: imageUrl });
                            } catch (error: any) {
                              setImageUploadStatus('');
                              setImageUploadError(error?.message || 'Failed to upload image');
                            }
                          }}
                          onError={(error: any) => {
                            setImageUploadError('Upload failed: ' + (error?.message || 'Unknown error'));
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="w-full bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold tracking-wide flex items-center justify-center gap-3 hover:bg-white/20 transition-all text-sm"
                            >
                              <Upload size={18} />
                              Upload Primary
                            </button>
                          )}
                        </CldUploadWidget>

                        {imageUploadError && (
                          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                            🔴 {imageUploadError}
                          </div>
                        )}
                        {imageUploadStatus && (
                          <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
                            {imageUploadStatus}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-white/70 text-xs font-bold tracking-[0.18em] uppercase mb-3">Hover Image (Desktop)</p>
                      <div className="w-full h-48 bg-white rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative shadow-lg group">
                        {currentProduct.secondaryImage ? (
                          <Image
                            src={currentProduct.secondaryImage}
                            alt="Secondary preview"
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            unoptimized={currentProduct.secondaryImage.includes('cloudinary')}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-center px-4">
                            <Camera size={28} className="text-white/20 mx-auto mb-2" />
                            <p className="text-white/30 text-xs">Optional second image for hover swap</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <CldUploadWidget
                          uploadPreset="bb_web"
                          options={{
                            cloudName: 'dt2ikjlfc',
                            sources: ['local', 'url', 'camera'],
                            multiple: false,
                            maxFiles: 1,
                            maxFileSize: 5000000,
                            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                            folder: 'bb_shoes'
                          }}
                          onSuccess={async (result: any) => {
                            try {
                              const uploadInfo = result?.info;
                              const imageUrl = String(uploadInfo?.secure_url || '').trim();
                              if (!uploadInfo) {
                                setSecondaryImageUploadError('Secondary upload failed: No URL returned');
                                return;
                              }
                              if (!imageUrl) {
                                setSecondaryImageUploadError('Secondary upload failed: Invalid image URL');
                                return;
                              }

                              setSecondaryImageUploadError('');
                              setSecondaryImageUploadStatus('✓ Secondary image uploaded successfully');
                              setTimeout(() => setSecondaryImageUploadStatus(''), 3000);
                              assignProductValue({ secondaryImage: imageUrl });
                            } catch (error: any) {
                              setSecondaryImageUploadStatus('');
                              setSecondaryImageUploadError(error?.message || 'Failed to upload secondary image');
                            }
                          }}
                          onError={(error: any) => {
                            setSecondaryImageUploadError('Upload failed: ' + (error?.message || 'Unknown error'));
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="w-full bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold tracking-wide flex items-center justify-center gap-3 hover:bg-white/20 transition-all text-sm"
                            >
                              <Upload size={18} />
                              Upload Hover Image
                            </button>
                          )}
                        </CldUploadWidget>

                        {secondaryImageUploadError && (
                          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                            🔴 {secondaryImageUploadError}
                          </div>
                        )}
                        {secondaryImageUploadStatus && (
                          <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
                            {secondaryImageUploadStatus}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedColors.length > 0 && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">Color Variant Images</label>
                      <p className="text-[10px] tracking-wide text-white/40 uppercase mb-5">Upload a dedicated image for each color. Product page switches image when user selects color.</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedColors.map((color) => {
                          const colorImage = getColorImage(color);
                          return (
                            <div key={color} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-white">{color}</p>
                                {colorImage ? <span className="text-[10px] text-emerald-300 uppercase tracking-[0.14em]">Assigned</span> : <span className="text-[10px] text-white/40 uppercase tracking-[0.14em]">Not assigned</span>}
                              </div>
                              <div className="w-full h-32 rounded-lg border border-white/10 bg-white overflow-hidden relative mb-3">
                                {colorImage ? (
                                  <Image
                                    src={colorImage}
                                    alt={`${color} variant`}
                                    fill
                                    className="object-cover"
                                    unoptimized={colorImage.includes('cloudinary')}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-black/50">No image</div>
                                )}
                              </div>
                              <CldUploadWidget
                                uploadPreset="bb_web"
                                options={{
                                  cloudName: 'dt2ikjlfc',
                                  sources: ['local', 'url', 'camera'],
                                  multiple: false,
                                  maxFiles: 1,
                                  maxFileSize: 5000000,
                                  clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                                  folder: 'bb_shoes'
                                }}
                                onSuccess={async (result: any) => {
                                  const uploadInfo = result?.info;
                                  const imageUrl = String(uploadInfo?.secure_url || '').trim();

                                  if (!imageUrl) {
                                    setImageUploadError(`Variant upload failed for ${color}`);
                                    return;
                                  }

                                  setColorImage(color, imageUrl);
                                  setImageUploadError('');
                                  setImageUploadStatus(`✓ ${color} variant image uploaded`);
                                  setTimeout(() => setImageUploadStatus(''), 3000);
                                }}
                                onError={(error: any) => {
                                  setImageUploadError(`Upload failed for ${color}: ${error?.message || 'Unknown error'}`);
                                }}
                              >
                                {({ open }) => (
                                  <button
                                    type="button"
                                    onClick={() => open()}
                                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[0.12em] hover:bg-white/20 transition-all"
                                  >
                                    Upload {color} Image
                                  </button>
                                )}
                              </CldUploadWidget>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] tracking-wide text-white/30 uppercase mt-5">Recommended: 800x800px PNG/WEBP/JPG for smooth hover transitions</p>
                </div>

                {/* Form Fields Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Asset Name *</label>
                    <input 
                      type="text" 
                      placeholder="Midnight Monarch" 
                      value={currentProduct.name} 
                      onChange={e => {
                        const val = e.target.value;
                        if(editingProduct) setEditingProduct({...editingProduct, name: val});
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, name: val});
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, name: val});
                        else setNewProduct({...newProduct, name: val});
                      }} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all" 
                      required
                    />
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Price (PKR) *</label>
                    <input 
                      type="number" 
                      placeholder="12999" 
                      value={currentProduct.price || ''} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        if(editingProduct) setEditingProduct({...editingProduct, price: val});
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, price: val});
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, price: val});
                        else setNewProduct({...newProduct, price: val});
                      }} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all" 
                      required
                    />
                  </div>

                  {isSaleWorkflow && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Original Price (PKR) *</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="15999"
                          value={currentProduct.originalPrice || ''}
                          onChange={e => {
                            const val = Number(e.target.value);
                            if(editingProduct) setEditingProduct({...editingProduct, originalPrice: val});
                            else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, originalPrice: val});
                            else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, originalPrice: val});
                            else setNewProduct({...newProduct, originalPrice: val});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Discount (%) *</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="25"
                          value={currentProduct.discount || ''}
                          onChange={e => {
                            const val = Number(e.target.value);
                            const clamped = Number.isFinite(val) ? Math.min(100, Math.max(1, val)) : 1;
                            const original = Number(currentProduct.originalPrice) || 0;
                            const salePrice = original > 0 ? Math.max(0, Math.round(original * (100 - clamped) / 100)) : currentProduct.price;

                            if(editingProduct) setEditingProduct({...editingProduct, discount: clamped, price: salePrice});
                            else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, discount: clamped, price: salePrice});
                            else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, discount: clamped, price: salePrice});
                            else setNewProduct({...newProduct, discount: clamped, price: salePrice});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all"
                          required
                        />
                        <p className="text-[10px] text-white/40 tracking-wide uppercase">Allowed range: 1-100%</p>
                      </div>

                      <div className="md:col-span-2 bg-[#0B101E] border border-[#D4AF37]/20 rounded-xl p-4">
                        <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2 font-bold">Discount Preview</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-white/70 line-through">PKR {(Number(currentProduct.originalPrice) || 0).toLocaleString()}</span>
                          <ChevronRight size={14} className="text-[#D4AF37]" />
                          <span className="text-[#D4AF37] font-black">PKR {(Number(currentProduct.price) || 0).toLocaleString()}</span>
                          <span className="text-emerald-400 font-bold">({Number(currentProduct.discount) || 0}% OFF)</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Category *</label>
                    <select 
                      value={currentProduct.category} 
                      onChange={e => {
                        const val = e.target.value;
                        if(editingProduct) setEditingProduct({...editingProduct, category: val});
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, category: val});
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, category: val});
                        else setNewProduct({...newProduct, category: val});
                      }} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#121A2F] transition-all appearance-none"
                    >
                      <option value="Men" className="bg-[#0B101E] text-white py-2">Men</option>
                      <option value="Women" className="bg-[#0B101E] text-white py-2">Women</option>
                      <option value="Kids" className="bg-[#0B101E] text-white py-2">Kids</option>
                      <option value="Accessories" className="bg-[#0B101E] text-white py-2">Accessories</option>
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div className="space-y-2">
                    <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Classification</label>
                    <select 
                      value={(currentProduct as any).subcategory || ''} 
                      onChange={e => {
                        const val = e.target.value;
                        if(editingProduct) setEditingProduct({...editingProduct, subcategory: val} as any);
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, subcategory: val} as any);
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, subcategory: val} as any);
                        else setNewProduct({...newProduct, subcategory: val});
                      }} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#121A2F] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#0B101E]">None</option>
                      <option value="Sneakers" className="bg-[#0B101E]">Sneakers</option>
                      <option value="Basketball" className="bg-[#0B101E]">Basketball</option>
                      <option value="Formal" className="bg-[#0B101E]">Formal</option>
                      <option value="Running" className="bg-[#0B101E]">Running</option>
                      <option value="Oxford" className="bg-[#0B101E]">Oxford</option>
                      <option value="Loafers" className="bg-[#0B101E]">Loafers</option>
                      <option value="Boots" className="bg-[#0B101E]">Boots</option>
                      <option value="Sandals" className="bg-[#0B101E]">Sandals</option>
                      <option value="Slippers" className="bg-[#0B101E]">Slippers</option>
                      <option value="Joggers" className="bg-[#0B101E]">Joggers</option>
                      <option value="Ladies Sandals" className="bg-[#0B101E]">Ladies Sandals</option>
                      <option value="Ladies Slippers" className="bg-[#0B101E]">Ladies Slippers</option>
                      <option value="Ladies Court Shoes" className="bg-[#0B101E]">Ladies Court Shoes</option>
                      <option value="Ladies Mucs" className="bg-[#0B101E]">Ladies Mucs</option>
                      <option value="Socks" className="bg-[#0B101E]">Socks</option>
                      <option value="Polish" className="bg-[#0B101E]">Polish</option>
                      <option value="Brushes" className="bg-[#0B101E]">Brushes</option>
                      <option value="Peshawari Chappal" className="bg-[#0B101E]">Peshawari Chappal</option>
                    </select>
                  </div>

                  {/* Stock Status */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Inventory Status *</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          if(editingProduct) setEditingProduct({...editingProduct, inStock: true});
                          else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, inStock: true});
                          else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, inStock: true});
                          else setNewProduct({...newProduct, inStock: true});
                        }}
                        className={`flex-1 py-4 px-6 rounded-xl text-[10px] tracking-[0.2em] uppercase font-bold transition-all border ${
                          currentProduct.inStock 
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                            : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        In Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if(editingProduct) setEditingProduct({...editingProduct, inStock: false});
                          else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, inStock: false});
                          else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, inStock: false});
                          else setNewProduct({...newProduct, inStock: false});
                        }}
                        className={`flex-1 py-4 px-6 rounded-xl text-[10px] tracking-[0.2em] uppercase font-bold transition-all border ${
                          !currentProduct.inStock 
                            ? 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                            : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        Depleted
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 space-y-2">
                  <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold">Asset Details</label>
                  <textarea 
                    placeholder="Describe materials, craftsmanship, and unique attributes..." 
                    value={currentProduct.description} 
                    onChange={e => {
                      const val = e.target.value;
                      if(editingProduct) setEditingProduct({...editingProduct, description: val});
                      else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, description: val});
                      else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, description: val});
                      else setNewProduct({...newProduct, description: val});
                    }} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all" 
                    rows={4}
                  />
                </div>

                {/* Attributes (Size & Color) */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* Sizes */}
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <label className="flex items-center gap-2 text-white text-sm font-bold mb-4">
                      <Package size={16} className="text-[#D4AF37]" /> Sizes
                    </label>
                    <div className="flex gap-3 mb-6">
                      <input 
                        type="number" 
                        placeholder="Add size..." 
                        value={newSize} 
                        onChange={e => setNewSize(e.target.value)} 
                        className="flex-1 bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50" 
                      />
                      <button 
                        type="button"
                        onClick={addSize} 
                        className="bg-white/10 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSizes.map(size => (
                        <div key={size} className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                          {size}
                          <button type="button" onClick={() => removeSize(size)} className="hover:text-white transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <label className="flex items-center gap-2 text-white text-sm font-bold mb-4">
                      <Sparkles size={16} className="text-[#D4AF37]" /> Colors
                    </label>
                    <div className="flex gap-3 mb-6">
                      <input 
                        type="text" 
                        placeholder="Add color..." 
                        value={newColor} 
                        onChange={e => setNewColor(e.target.value)} 
                        className="flex-1 bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50" 
                      />
                      <button 
                        type="button"
                        onClick={addColor} 
                        className="bg-white/10 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedColors.map(color => (
                        <div key={color} className="bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                          {color}
                          <button type="button" onClick={() => removeColor(color)} className="hover:text-red-400 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size-wise Inventory Management */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-10">
                  <label className="flex items-center gap-2 text-white text-sm font-bold mb-6">
                    <Package size={16} className="text-[#D4AF37]" /> Size-wise Inventory
                  </label>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {selectedSizes.length === 0 || selectedColors.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-8">Add sizes above to manage inventory</p>
                    ) : (
                      selectedSizes.map(size => (
                        <div key={size} className="p-4 bg-[#0B101E] rounded-xl border border-white/5">
                          <div className="w-16 px-3 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] font-bold text-center mb-3">
                            Size {size}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {selectedColors.map((color) => {
                              const key = makeSizeColorKey(size, color);
                              return (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="w-20 text-[11px] text-white/70 font-semibold truncate">{color}</span>
                                  <input
                                    type="number"
                                    placeholder="Qty"
                                    value={sizeInventory[key] ?? 0}
                                    onChange={(e) => {
                                      const nextQty = Math.max(0, Number(e.target.value) || 0);
                                      setSizeInventory((prev) => ({ ...prev, [key]: nextQty }));
                                    }}
                                    min="0"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 tracking-widest uppercase mt-4">0 quantity means out of stock for that size + color</p>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => {
                      if (!currentProduct.name) {
                        alert('❌ Product name is required');
                        return;
                      }
                      if (!currentProduct.price || currentProduct.price <= 0) {
                        alert('❌ Price must be greater than 0');
                        return;
                      }
                      if (!currentProduct.image || typeof currentProduct.image !== 'string' || currentProduct.image.trim() === '') {
                        alert('❌ Image is required - please upload via Cloudinary first');
                        console.error('Invalid image:', currentProduct.image, typeof currentProduct.image);
                        return;
                      }

                      const saleActive = activeTab === 'sales' || showAddSaleForm || Boolean(editingSaleProduct);
                      if (saleActive) {
                        const discount = Number(currentProduct.discount);
                        const originalPrice = Number(currentProduct.originalPrice);

                        if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
                          alert('❌ Discount must be between 1 and 100%');
                          return;
                        }

                        if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
                          alert('❌ Original price is required for sale products');
                          return;
                        }

                        const calculatedPrice = Math.max(0, Math.round(originalPrice * (100 - discount) / 100));
                        if (calculatedPrice >= originalPrice) {
                          alert('❌ Discounted price must be lower than original price');
                          return;
                        }

                        if(editingProduct) setEditingProduct({...editingProduct, price: calculatedPrice, discount, originalPrice});
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, price: calculatedPrice, discount, originalPrice});
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, price: calculatedPrice, discount, originalPrice});
                        else setNewProduct({...newProduct, price: calculatedPrice, discount, originalPrice});
                      }

                      const normalizedSizes = selectedSizes
                        .map((size) => ({ raw: size, numeric: Number(size) }))
                        .filter((entry) => Number.isFinite(entry.numeric));

                      const normalizedColors = selectedColors
                        .map((color) => String(color).trim())
                        .filter(Boolean);

                      const sizeStockPayload = normalizedSizes.flatMap((entry) => (
                        normalizedColors.map((color) => ({
                          size: entry.numeric,
                          quantity: Math.max(0, Number(sizeInventory[makeSizeColorKey(entry.raw, color)] || 0)),
                          color
                        }))
                      ));

                      const variantMap = new Map<string, { size: number; color: string; image: string }>();
                      const rawVariantImages = Array.isArray((currentProduct as any).sizeColorImages)
                        ? (currentProduct as any).sizeColorImages
                        : [];

                      rawVariantImages.forEach((entry: any) => {
                        const color = String(entry?.color || '').trim();
                        const image = String(entry?.image || '').trim();
                        if (!color || !image) return;
                        if (!normalizedColors.some((existing) => existing.toLowerCase() === color.toLowerCase())) return;

                        variantMap.set(color.toLowerCase(), {
                          size: Number(entry?.size) || 0,
                          color,
                          image,
                        });
                      });

                      const hasAnyAvailableSize = sizeStockPayload.some((entry) => entry.quantity > 0);
                      const computedStock = sizeStockPayload.reduce((sum, entry) => sum + entry.quantity, 0);
                      const shouldUseSizeInventory = hasAnyAvailableSize;

                      const body = {
                        ...currentProduct, 
                        brand: 'B&B', 
                        sizes: normalizedSizes.map((entry) => entry.numeric), 
                        colors: normalizedColors, 
                        sizeColorImages: Array.from(variantMap.values()),
                        sizeStock: shouldUseSizeInventory ? sizeStockPayload : [],
                        isOnSale: saleActive,
                        isNewArrival: activeTab === 'newarrivals' || showAddNewArrivalForm,
                        inStock: currentProduct.inStock === false ? false : true,
                        stock: shouldUseSizeInventory ? computedStock : Number(currentProduct.stock || 0),
                        discount: saleActive ? Number(currentProduct.discount) : 0,
                        originalPrice: saleActive ? Number(currentProduct.originalPrice) : 0,
                        price: saleActive
                          ? Math.max(0, Math.round((Number(currentProduct.originalPrice) || 0) * (100 - (Number(currentProduct.discount) || 0)) / 100))
                          : Number(currentProduct.price)
                      };
                      const method = (editingProduct || editingSaleProduct || editingNewArrival) ? 'PUT' : 'POST';
                      const url = method === 'PUT' ? `/api/products/${currentProduct.id}` : '/api/products';
                      handleAction(method, url, body);
                    }} 
                    disabled={loading}
                    className="flex-1 bg-[#D4AF37] text-[#0B101E] px-8 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <Save size={16} />
                    {loading ? 'Committing...' : 'Commit Asset'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddForm(false); setShowAddSaleForm(false); setShowAddNewArrivalForm(false);
                      setEditingProduct(null); setEditingSaleProduct(null); setEditingNewArrival(null);
                      setSelectedSizes(DEFAULT_SIZES);
                      setSelectedColors(DEFAULT_COLORS);
                      setSizeInventory(buildInventoryMap(DEFAULT_SIZES, DEFAULT_COLORS));
                    }} 
                    className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all text-[10px] tracking-[0.2em] uppercase"
                  >
                    Abort
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <button 
              onClick={() => {
                setShowAddForm(true);
                setNewProduct({
                  id: '', name: '', price: 0, originalPrice: 0, discount: 0, image: '', secondaryImage: '', sizeColorImages: [],
                  category: 'Men', subcategory: '', brand: 'B&B', sizes: [], colors: [], description: '',
                  rating: 4.5, reviews: 0, inStock: true, stock: 100, sold: 0, isOnSale: false, isNewArrival: false
                });
                setSelectedSizes(DEFAULT_SIZES); setSelectedColors(DEFAULT_COLORS); setSizeInventory(buildInventoryMap(DEFAULT_SIZES, DEFAULT_COLORS));
              }} 
              className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-full font-bold mb-10 flex items-center gap-3 hover:bg-white/10 transition-all text-[10px] tracking-[0.2em] uppercase"
            >
              <Plus size={16}/> 
              Register New Asset
            </button>

            <div className="mb-8 bg-[#121A2F]/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-5">
              <label className="text-[10px] tracking-[0.16em] uppercase text-white/60 font-bold block mb-3">
                Search by Serial, Name, or Product ID
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B101E] px-3 py-2.5">
                <Search size={16} className="text-white/50" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Example: 12 or Peshawari or 67f..."
                  className="w-full bg-transparent text-white placeholder:text-white/35 outline-none text-sm"
                />
                {productSearchQuery ? (
                  <button
                    type="button"
                    onClick={() => setProductSearchQuery('')}
                    className="text-[10px] tracking-[0.12em] uppercase font-bold text-[#D4AF37] hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-white/55">
                Showing {searchedProducts.length} of {products.length} products
              </p>
            </div>
            
            {loading || contextLoading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-50">
                <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
                <p className="text-[10px] tracking-[0.3em] uppercase">Accessing Database</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-[#121A2F]/40 backdrop-blur-sm rounded-3xl border border-white/5">
                <Package size={48} className="mx-auto text-white/20 mb-6" strokeWidth={1} />
                <p className="text-white/50 font-medium text-sm">Vault is empty. Initiate asset registration.</p>
              </div>
            ) : searchedProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#121A2F]/40 backdrop-blur-sm rounded-3xl border border-white/5">
                <Search size={42} className="mx-auto text-white/20 mb-5" strokeWidth={1.5} />
                <p className="text-white/70 font-semibold text-sm">No product found for &quot;{productSearchQuery}&quot;</p>
                <p className="text-white/45 text-xs mt-2">Try serial number, product name, or product id.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchedProducts.map(({ product: p, serial }) => (
                  <div key={p.id} className="bg-[#121A2F]/60 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden group hover:border-white/20 transition-all">
                    <div className="relative aspect-square bg-[#0B101E] p-6">
                      <Image 
                        src={p.image || '/placeholder.jpg'} 
                        alt={p.name} 
                        fill 
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl" 
                        unoptimized={p.image?.includes('cloudinary')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-[8px] font-black tracking-[0.2em] text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1.5 rounded-full uppercase backdrop-blur-md">
                          #{serial} • {p.category}
                        </span>
                      </div>
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-[#0B101E]/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-full font-bold text-[9px] tracking-[0.2em] uppercase">Depleted</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 border-t border-white/5">
                      <h3 className="font-serif font-bold text-lg text-white mb-1 truncate">{p.name}</h3>
                      {p.originalPrice && p.originalPrice > p.price ? (
                        <div className="mb-5">
                          <p className="text-base font-bold text-[#D4AF37]">PKR {p.price.toLocaleString()}</p>
                          <p className="text-xs text-white/40 line-through">PKR {p.originalPrice.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-white/70 mb-5">PKR {p.price.toLocaleString()}</p>
                      )}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(p);
                            const safeColors = (p.colors || []).length > 0 ? (p.colors || []) : DEFAULT_COLORS;
                            setSelectedSizes((p.sizes || []).map((s) => String(s))); setSelectedColors(safeColors);
                            setSizeInventory(buildInventoryMap((p.sizes || []).map((s) => String(s)), safeColors, (p as any).sizeStock));
                          }} 
                          className="flex-1 bg-white/5 border border-white/10 text-white/70 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 size={14}/> Edit
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('Purge this asset from the database?')) {
                              handleAction('DELETE', `/api/products/${p.id}`, {});
                            }
                          }} 
                          className="w-10 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* --- SALES TAB --- */}
        {activeTab === 'sales' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="bg-[#121A2F]/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8">
              <div className="flex items-start justify-between gap-6 flex-col md:flex-row mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Clock3 size={18} className="text-[#D4AF37]" />
                    Sales Countdown Timer
                  </h3>
                  <p className="text-white/50 text-sm mt-1">
                    {timerMode === 'duration' 
                      ? 'Set timer by duration (5 seconds to 5+ years)'
                      : 'Set exact date and time'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-3 mb-6">
                {(['custom', 'duration'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setTimerMode(mode)}
                    className={`px-4 py-2 rounded-lg text-[10px] tracking-[0.1em] uppercase font-bold transition-all ${
                      timerMode === mode
                        ? 'bg-[#D4AF37] text-[#0B101E]'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {mode === 'custom' ? 'Custom Date' : 'Quick Duration'}
                  </button>
                ))}
              </div>

              {/* Custom Date Mode */}
              {timerMode === 'custom' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                  <input
                    type="datetime-local"
                    value={salesEndsAtInput}
                    onChange={(e) => setSalesEndsAtInput(e.target.value)}
                    className="bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white flex-1"
                  />
                </div>
              )}

              {/* Duration Mode */}
              {timerMode === 'duration' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value) || 1)}
                    className="bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white col-span-2 md:col-span-1"
                    placeholder="Duration"
                  />
                  <select
                    value={timerUnit}
                    onChange={(e) => setTimerUnit(e.target.value as typeof timerUnit)}
                    className="bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white col-span-2 md:col-span-3"
                  >
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              )}

              {/* Save Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.16em] text-white/60 mb-2 block">Ticker Message (Optional)</label>
                  <input
                    type="text"
                    value={tickerMessage}
                    onChange={(e) => setTickerMessage(e.target.value.slice(0, 180))}
                    className="bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white w-full"
                    placeholder="Flash Sale Live | Free Delivery Nationwide | Limited Stock"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.16em] text-white/60 mb-2 block">Ticker Speed ({tickerSpeed}s loop)</label>
                  <input
                    type="range"
                    min="6"
                    max="45"
                    step="1"
                    value={tickerSpeed}
                    onChange={(e) => setTickerSpeed(Number(e.target.value))}
                    className="w-full accent-[#D4AF37]"
                  />
                </div>

                <div className="bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/70 flex items-center">
                  Lower value = faster ticker | Higher value = slower ticker
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Live Preview (Navbar Ticker)</p>
                  <div className="flex gap-2">
                    {(['desktop', 'mobile'] as const).map((device) => (
                      <button
                        key={device}
                        type="button"
                        onClick={() => setPreviewDevice(device)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] tracking-[0.1em] uppercase font-bold transition-all ${
                          previewDevice === device
                            ? 'bg-[#D4AF37] text-[#0B101E]'
                            : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        {device}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`rounded-xl overflow-hidden border border-white/10 ${previewDevice === 'mobile' ? 'max-w-[390px] mx-auto' : ''}`}>
                  <div className="bg-gradient-to-r from-[#7B0000] via-[#C20F1E] to-[#7B0000] text-white border-b border-[#FF9AA2]/30 shadow-[0_8px_28px_-12px_rgba(194,15,30,0.9)]">
                    {previewDevice === 'desktop' ? (
                      <div className="px-3 py-2.5 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-md bg-[#2C0000] border border-[#FFB3BC]/30 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.22em] uppercase whitespace-nowrap sales-badge-pulse">
                          <span className="sales-live-dot" />
                          Live
                        </span>
                        <div className="sales-marquee group flex-1 overflow-hidden rounded-md border border-white/15 bg-white/5 px-2 py-1.5">
                          <div className="sales-marquee-track" style={{ animationDuration: `${previewTickerDurationSeconds}s` }}>
                            {[1, 2].map((copy) => (
                              <span key={copy} className="sales-marquee-content text-[11px] md:text-xs font-bold tracking-[0.12em] uppercase">
                                {previewTickerText}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-2 py-2">
                        <div className="sales-marquee group flex-1 overflow-hidden rounded-md border border-white/15 bg-white/5 px-2 py-1.5">
                          <div className="sales-marquee-track" style={{ animationDuration: `${previewTickerDurationSeconds}s` }}>
                            {[1, 2].map((copy) => (
                              <span key={copy} className="sales-marquee-content text-[10px] font-bold tracking-[0.1em] uppercase">
                                {previewTickerText}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={saveSalesTimer}
                  disabled={timerSaving || (timerMode === 'duration' && !timerDuration) || (timerMode === 'custom' && !salesEndsAtInput)}
                  className="bg-[#D4AF37] text-[#0B101E] font-bold py-3 px-5 rounded-xl text-[10px] tracking-[0.15em] uppercase disabled:opacity-60 flex-1 sm:flex-none"
                >
                  {timerSaving ? 'Saving...' : 'Save Timer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSalesEndsAtInput('');
                    setTimerDuration(1);
                    setTimerMode('duration');
                    setTickerMessage('');
                    setTickerSpeed(18);
                    setFlatSalePercent(25);
                    setFlatSaleProductIds([]);
                    setRemoveFlatSaleProductIds([]);
                    setFlatSaleMessage('');
                    setTimerMessage('');
                  }}
                  className="bg-white/10 border border-white/10 text-white font-bold py-3 px-5 rounded-xl text-[10px] tracking-[0.15em] uppercase flex-1 sm:flex-none"
                >
                  Clear All
                </button>
              </div>

              {timerMessage && (
                <p className="text-xs mt-4 text-[#D4AF37] tracking-wider uppercase">{timerMessage}</p>
              )}
            </div>

            <div className="bg-[#121A2F]/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8">
              <div className="flex items-start justify-between gap-4 flex-col md:flex-row mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Tag size={18} className="text-[#D4AF37]" />
                    Flat Sale For Specific Products
                  </h3>
                  <p className="text-white/50 text-sm mt-1">
                    Choose products and apply one flat discount (1-100%). Timer expiry will hide these sale products automatically.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.16em] text-white/60 mb-2 block">Flat Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={flatSalePercent}
                    onChange={(e) => setFlatSalePercent(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                    className="bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white w-full"
                  />
                </div>
                <div className="md:col-span-2 flex gap-2 items-end">
                  <button
                    type="button"
                    onClick={() => setFlatSaleProductIds(products.map((item) => String(item.id)))}
                    className="bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase font-bold"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlatSaleProductIds([])}
                    className="bg-white/5 border border-white/10 text-white/70 px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase font-bold"
                  >
                    Clear Selection
                  </button>
                  <button
                    type="button"
                    onClick={applyFlatSaleToSelected}
                    disabled={flatSaleApplying || flatSaleProductIds.length === 0}
                    className="ml-auto bg-[#D4AF37] text-[#0B101E] font-bold px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase disabled:opacity-60"
                  >
                    {flatSaleApplying ? 'Applying...' : `Apply ${flatSalePercent}%`}
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#0B101E]/70">
                {products.length === 0 ? (
                  <p className="text-white/50 text-sm p-4">No non-sale products available for flat sale.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {products.map((product) => {
                      const productId = String(product.id);
                      const checked = flatSaleProductIds.includes(productId);

                      return (
                        <label key={productId} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setFlatSaleProductIds((prev) => {
                                if (e.target.checked) return [...prev, productId];
                                return prev.filter((id) => id !== productId);
                              });
                            }}
                            className="accent-[#D4AF37]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{product.name}</p>
                            <p className="text-xs text-white/50">PKR {(Number(product.price) || 0).toLocaleString()}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {flatSaleMessage && (
                <p className="text-xs mt-4 text-[#D4AF37] tracking-wider uppercase">{flatSaleMessage}</p>
              )}
            </div>

            <div className="bg-[#121A2F]/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8">
              <div className="flex items-start justify-between gap-4 flex-col md:flex-row mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Tag size={18} className="text-red-400" />
                    Remove Flat Sale From Selected
                  </h3>
                  <p className="text-white/50 text-sm mt-1">
                    Select active sale products and rollback them with one click.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center mb-4">
                <button
                  type="button"
                  onClick={() => setRemoveFlatSaleProductIds(salesProducts.map((item) => String(item.id)))}
                  className="bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase font-bold"
                >
                  Select All Sale
                </button>
                <button
                  type="button"
                  onClick={() => setRemoveFlatSaleProductIds([])}
                  className="bg-white/5 border border-white/10 text-white/70 px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase font-bold"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={removeFlatSaleFromSelected}
                  disabled={flatSaleRemoving || removeFlatSaleProductIds.length === 0}
                  className="ml-auto bg-red-500/90 text-white font-bold px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase disabled:opacity-60"
                >
                  {flatSaleRemoving ? 'Removing...' : 'Remove Flat Sale'}
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#0B101E]/70">
                {salesProducts.length === 0 ? (
                  <p className="text-white/50 text-sm p-4">No active sale products found.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {salesProducts.map((product) => {
                      const productId = String(product.id);
                      const checked = removeFlatSaleProductIds.includes(productId);

                      return (
                        <label key={productId} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setRemoveFlatSaleProductIds((prev) => {
                                if (e.target.checked) return [...prev, productId];
                                return prev.filter((id) => id !== productId);
                              });
                            }}
                            className="accent-red-400"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{product.name}</p>
                            <p className="text-xs text-white/50">
                              PKR {(Number(product.price) || 0).toLocaleString()} {product.originalPrice ? `| Was PKR ${Number(product.originalPrice).toLocaleString()}` : ''}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => {
                setShowAddSaleForm(true);
                setNewProduct({
                  id: '', name: '', price: 0, originalPrice: 0, discount: 0, image: '', secondaryImage: '', sizeColorImages: [],
                  category: 'Men', subcategory: '', brand: 'B&B', sizes: [], colors: [], description: '',
                  rating: 4.5, reviews: 0, inStock: true, stock: 100, sold: 0, isOnSale: true, isNewArrival: false
                });
                setSelectedSizes(DEFAULT_SIZES); setSelectedColors(DEFAULT_COLORS); setSizeInventory(buildInventoryMap(DEFAULT_SIZES, DEFAULT_COLORS));
              }} 
              className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-full font-bold mb-10 flex items-center gap-3 hover:bg-white/10 transition-all text-[10px] tracking-[0.2em] uppercase"
            >
              <Tag size={16}/> 
              Initiate Sale Event
            </button>
            
            {loading || contextLoading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-50">
                <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
                <p className="text-[10px] tracking-[0.3em] uppercase">Accessing Database</p>
              </div>
            ) : salesProducts.length === 0 ? (
              <div className="text-center py-32 bg-[#121A2F]/40 backdrop-blur-sm rounded-3xl border border-white/5">
                <Tag size={48} className="mx-auto text-white/20 mb-6" strokeWidth={1} />
                <p className="text-white/50 font-medium text-sm">No active sales events.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {salesProducts.map(p => (
                  <div key={p.id} className="bg-[#121A2F]/60 backdrop-blur-md rounded-3xl border border-red-500/10 overflow-hidden group hover:border-red-500/30 transition-all shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                    <div className="relative aspect-square bg-[#0B101E] p-6">
                      <Image 
                        src={p.image || '/placeholder.jpg'} alt={p.name} fill 
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl" 
                        unoptimized={p.image?.includes('cloudinary')}
                      />
                      <div className="absolute top-4 right-4">
                        <span className="text-[8px] font-black tracking-[0.2em] text-white bg-red-600/80 border border-red-500 px-3 py-1.5 rounded-full uppercase backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                          Sale
                        </span>
                      </div>
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-[#0B101E]/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-full font-bold text-[9px] tracking-[0.2em] uppercase">Depleted</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 border-t border-white/5">
                      <h3 className="font-serif font-bold text-lg text-white mb-1 truncate">{p.name}</h3>
                      {p.originalPrice && p.originalPrice > p.price ? (
                        <div className="mb-5">
                          <p className="text-base font-bold text-red-400">PKR {p.price.toLocaleString()}</p>
                          <p className="text-xs text-white/40 line-through">PKR {p.originalPrice.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-red-400 mb-5">PKR {p.price.toLocaleString()}</p>
                      )}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingSaleProduct(p);
                            const safeColors = (p.colors || []).length > 0 ? (p.colors || []) : DEFAULT_COLORS;
                            setSelectedSizes((p.sizes || []).map((s) => String(s))); setSelectedColors(safeColors);
                            setSizeInventory(buildInventoryMap((p.sizes || []).map((s) => String(s)), safeColors, (p as any).sizeStock));
                          }} 
                          className="flex-1 bg-white/5 border border-white/10 text-white/70 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 size={14}/> Edit
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('Purge this sale asset?')) handleAction('DELETE', `/api/products/${p.id}`, {});
                          }} 
                          className="w-10 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* --- NEW ARRIVALS TAB --- */}
        {activeTab === 'newarrivals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <button 
              onClick={() => {
                setShowAddNewArrivalForm(true);
                setNewProduct({
                  id: '', name: '', price: 0, originalPrice: 0, discount: 0, image: '', secondaryImage: '', sizeColorImages: [],
                  category: 'Men', subcategory: '', brand: 'B&B', sizes: [], colors: [], description: '',
                  rating: 4.5, reviews: 0, inStock: true, stock: 100, sold: 0, isOnSale: false, isNewArrival: true
                });
                setSelectedSizes(DEFAULT_SIZES); setSelectedColors(DEFAULT_COLORS); setSizeInventory(buildInventoryMap(DEFAULT_SIZES, DEFAULT_COLORS));
              }} 
              className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-full font-bold mb-10 flex items-center gap-3 hover:bg-white/10 transition-all text-[10px] tracking-[0.2em] uppercase"
            >
              <Sparkles size={16}/> 
              Log New Arrival
            </button>
            
            {loading || contextLoading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-50">
                <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
                <p className="text-[10px] tracking-[0.3em] uppercase">Accessing Database</p>
              </div>
            ) : newArrivals.length === 0 ? (
              <div className="text-center py-32 bg-[#121A2F]/40 backdrop-blur-sm rounded-3xl border border-white/5">
                <Sparkles size={48} className="mx-auto text-white/20 mb-6" strokeWidth={1} />
                <p className="text-white/50 font-medium text-sm">No new arrivals currently active.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map(p => (
                  <div key={p.id} className="bg-[#121A2F]/60 backdrop-blur-md rounded-3xl border border-blue-400/10 overflow-hidden group hover:border-blue-400/30 transition-all shadow-[0_0_20px_rgba(96,165,250,0.05)]">
                    <div className="relative aspect-square bg-[#0B101E] p-6">
                      <Image 
                        src={p.image || '/placeholder.jpg'} alt={p.name} fill 
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl" 
                        unoptimized={p.image?.includes('cloudinary')}
                      />
                      <div className="absolute top-4 right-4">
                        <span className="text-[8px] font-black tracking-[0.2em] text-blue-900 bg-blue-400/90 border border-blue-300 px-3 py-1.5 rounded-full uppercase backdrop-blur-md shadow-[0_0_15px_rgba(96,165,250,0.4)]">
                          New
                        </span>
                      </div>
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-[#0B101E]/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-full font-bold text-[9px] tracking-[0.2em] uppercase">Depleted</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 border-t border-white/5">
                      <h3 className="font-serif font-bold text-lg text-white mb-1 truncate">{p.name}</h3>
                      {p.originalPrice && p.originalPrice > p.price ? (
                        <div className="mb-5">
                          <p className="text-base font-bold text-blue-300">PKR {p.price.toLocaleString()}</p>
                          <p className="text-xs text-white/40 line-through">PKR {p.originalPrice.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-blue-300 mb-5">PKR {p.price.toLocaleString()}</p>
                      )}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingNewArrival(p);
                            const safeColors = (p.colors || []).length > 0 ? (p.colors || []) : DEFAULT_COLORS;
                            setSelectedSizes((p.sizes || []).map((s) => String(s))); setSelectedColors(safeColors);
                            setSizeInventory(buildInventoryMap((p.sizes || []).map((s) => String(s)), safeColors, (p as any).sizeStock));
                          }} 
                          className="flex-1 bg-white/5 border border-white/10 text-white/70 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 size={14}/> Edit
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('Purge this arrival asset?')) handleAction('DELETE', `/api/products/${p.id}`, {});
                          }} 
                          className="w-10 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* --- STOCK CONTROL TAB --- */}
        {activeTab === 'stock' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            {allProducts.length === 0 ? (
              <div className="text-center py-32 bg-[#121A2F]/40 backdrop-blur-sm rounded-3xl border border-white/5">
                <PackageCheck size={48} className="mx-auto text-white/20 mb-6" strokeWidth={1} />
                <p className="text-white/50 font-medium text-sm">No products available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allProducts.map((product) => (
                  <div key={product.id} className="bg-[#121A2F]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{product.name}</h3>
                        <p className="text-white/50 text-sm mt-1">{product.sizes?.length || 0} sizes • Category: {product.category}</p>
                      </div>
                      <button
                        onClick={() => setEditingStockProduct(editingStockProduct?.id === product.id ? null : product)}
                        className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-all text-xs font-bold tracking-[0.1em] uppercase whitespace-nowrap"
                      >
                        {editingStockProduct?.id === product.id ? 'Close' : 'Manage Stock'}
                      </button>
                    </div>

                    {editingStockProduct?.id === product.id && (
                      <StockControl
                        product={product}
                        onSave={async (_, sizeStock) => {
                          try {
                            const response = await fetch(`/api/products/${product.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ sizeStock })
                            });

                            if (response.ok) {
                              alert('Stock updated successfully!');
                              await refetchProducts();
                            } else {
                              alert('Failed to update stock');
                            }
                          } catch (err) {
                            alert('Error: ' + err);
                          }
                        }}
                        onClose={() => setEditingStockProduct(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* --- SEASONAL BANNERS TAB --- */}
        {activeTab === 'seasonal-banners' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            <AdminSeasonalBanners />
          </motion.div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-32 bg-[#121A2F]/40 backdrop-blur-sm rounded-3xl border border-white/5">
                <ShoppingCart size={48} className="mx-auto text-white/20 mb-6" strokeWidth={1} />
                <p className="text-white/50 font-medium text-sm">No incoming transmissions.</p>
              </div>
            ) : (
              Object.entries(
                orders.reduce<Record<string, Order[]>>((acc, order) => {
                  const key = order.user_id || 'unknown-user';
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(order);
                  return acc;
                }, {})
              ).map(([userId, userOrders]) => (
                <div key={userId} className="bg-[#121A2F]/30 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                  
                  {/* User Group Header */}
                  <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-[#D4AF37]" />
                      <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/70">Client ID: {userId.substring(0,8)}...</span>
                    </div>
                    <span className="text-[10px] text-white/40">{userOrders.length} Active Ledgers</span>
                  </div>

                  {/* Orders List */}
                  <div className="p-4 space-y-4">
                    {userOrders.map((o) => (
                      <div key={o.id} className="bg-[#0B101E]/80 border border-white/5 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                        
                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                              #{o.orderId?.substring(0,8) || o.id.substring(0,8)}
                            </span>
                            <span className="text-xs text-white/40">{new Date(o.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-serif text-lg text-white mb-1">{o.customerName}</h4>
                          <p className="text-xs text-white/50 mb-3">{o.customerEmail}</p>
                          <p className="text-xs text-white/50 mb-3">{o.customerPhone || 'Phone not provided'}</p>
                          <div className="space-y-1 mb-3">
                            <p className="text-[11px] text-[#D4AF37]/80 uppercase tracking-[0.18em]">Payment Method: {o.paymentMethod || 'cod'}</p>
                            <p className="text-[11px] uppercase tracking-[0.18em]">
                              Payment Status:{' '}
                              <span className={
                                (o.paymentStatus || 'pending') === 'paid'
                                  ? 'text-emerald-400'
                                  : (o.paymentStatus || 'pending') === 'failed'
                                    ? 'text-red-400'
                                    : 'text-amber-400'
                              }>
                                {(o.paymentStatus || 'pending').toUpperCase()}
                              </span>
                            </p>
                            {o.paymentMethod === 'cod' ? (
                              <p className="text-xs text-white/50">COD - Pay on delivery</p>
                            ) : null}
                            {o.paymentMethod === 'jazzcash' ? (
                              <>
                                <p className="text-xs text-white/50">Sender JazzCash: {o.paymentDetails?.jazzcash?.senderNumber || 'N/A'}</p>
                                <p className="text-xs text-white/50">Transaction ID: {o.paymentDetails?.jazzcash?.transactionId || 'N/A'}</p>
                              </>
                            ) : null}
                            {o.paymentMethod === 'bank' ? (
                              <>
                                <p className="text-xs text-white/50">Bank: {o.paymentDetails?.bank?.bankName || 'N/A'}</p>
                                <p className="text-xs text-white/50">Receiver Account: {o.paymentDetails?.bank?.receiverAccountNumber || 'N/A'}</p>
                                <p className="text-xs text-white/50">Sender Account: {o.paymentDetails?.bank?.senderAccountNumber || 'N/A'}</p>
                                <p className="text-xs text-white/50">Transaction ID: {o.paymentDetails?.bank?.transactionId || 'N/A'}</p>
                              </>
                            ) : null}
                            {o.paymentMethod === 'card' ? (
                              <>
                                <p className="text-xs text-white/50">Card Holder: {o.paymentDetails?.card?.cardHolderName || 'N/A'}</p>
                                <p className="text-xs text-white/50">Card: {o.paymentDetails?.card?.cardBrand || 'Card'} {o.paymentDetails?.card?.cardMasked || (o.paymentDetails?.card?.cardLast4 ? `**** **** **** ${o.paymentDetails.card.cardLast4}` : 'N/A')}</p>
                                <p className="text-xs text-white/50">Transaction ID: {o.paymentDetails?.card?.transactionId || 'N/A'}</p>
                              </>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-white/40">{o.items.length} Assets</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="font-bold text-white">PKR {o.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-start lg:items-end gap-4">
                          
                          {/* Dynamic Status Badge */}
                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${
                            o.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            o.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-green-500/10 text-green-400 border-green-500/20'
                          }`}>
                            {o.status}
                          </div>

                          {/* Control Buttons */}
                          <div className="flex bg-white/5 border border-white/5 rounded-xl p-1">
                            {(['pending', 'processing', 'delivered'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => updateOrderStatus(o, status)}
                                disabled={statusSavingId === o.id || o.status === status}
                                className={`px-4 py-2 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all ${
                                  o.status === status
                                    ? 'bg-[#D4AF37] text-[#0B101E] shadow-md'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                } disabled:opacity-50`}
                              >
                                {statusSavingId === o.id && o.status !== status ? '...' : status}
                              </button>
                            ))}
                          </div>

                          {/* Payment Verification */}
                          <div className="flex bg-white/5 border border-white/5 rounded-xl p-1">
                            {(['pending', 'paid', 'failed'] as const).map((paymentState) => (
                              <button
                                key={paymentState}
                                onClick={() => updatePaymentStatus(o, paymentState)}
                                disabled={paymentSavingId === o.id || (o.paymentStatus || 'pending') === paymentState}
                                className={`px-4 py-2 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all ${
                                  (o.paymentStatus || 'pending') === paymentState
                                    ? paymentState === 'paid'
                                      ? 'bg-emerald-500/30 text-emerald-200 shadow-md'
                                      : paymentState === 'failed'
                                        ? 'bg-red-500/20 text-red-200 shadow-md'
                                        : 'bg-amber-500/20 text-amber-200 shadow-md'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                } disabled:opacity-50`}
                              >
                                {paymentSavingId === o.id && (o.paymentStatus || 'pending') !== paymentState ? '...' : paymentState}
                              </button>
                            ))}
                          </div>

                          {(o.paymentStatus || 'pending') === 'paid' ? (
                            <p className="text-[10px] text-emerald-400 uppercase tracking-[0.14em] font-bold">Payment received - Ready for delivery</p>
                          ) : (
                            <p className="text-[10px] text-amber-300 uppercase tracking-[0.14em] font-bold">Payment not verified yet</p>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* --- ANALYTICS TAB --- */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
            <div className="bg-[#121A2F]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold">Analytics Date Range</h3>
                  <p className="text-white/50 text-xs mt-1">Filter metrics by 7 days, 30 days, or custom period.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(['7d', '30d', 'custom'] as const).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setAnalyticsRange(range);
                        if (range === 'custom' && (!customDateFrom || !customDateTo)) {
                          const today = new Date();
                          const from = new Date(today);
                          from.setDate(today.getDate() - 29);
                          const toValue = today.toISOString().slice(0, 10);
                          const fromValue = from.toISOString().slice(0, 10);
                          setCustomDateFrom(fromValue);
                          setCustomDateTo(toValue);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] tracking-[0.2em] uppercase font-bold transition-all border ${
                        analyticsRange === range
                          ? 'bg-[#D4AF37] text-[#0B101E] border-[#D4AF37]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {analyticsRange === 'custom' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold mb-1">From</label>
                    <input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                      className="w-full bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold mb-1">To</label>
                    <input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                      className="w-full bg-[#0B101E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                    />
                  </div>
                </div>
              )}

              <div className="mt-5 bg-[#0B101E]/70 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-sm font-bold">Quick Compare</p>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">Current vs Previous Range</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold">Revenue Growth</p>
                    <p className={`text-lg font-black mt-1 ${analytics.revenueGrowthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {analytics.revenueGrowthPercent >= 0 ? '+' : ''}{analytics.revenueGrowthPercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      PKR {analytics.grossRevenue.toLocaleString()} vs PKR {analytics.previousRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold">Orders Growth</p>
                    <p className={`text-lg font-black mt-1 ${analytics.ordersGrowthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {analytics.ordersGrowthPercent >= 0 ? '+' : ''}{analytics.ordersGrowthPercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {analytics.totalOrders} vs {analytics.previousOrdersCount} orders
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold">Units Growth</p>
                    <p className={`text-lg font-black mt-1 ${analytics.unitsGrowthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {analytics.unitsGrowthPercent >= 0 ? '+' : ''}{analytics.unitsGrowthPercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {analytics.totalUnitsSold} vs {analytics.previousUnitsSold} units
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <div className="bg-[#121A2F]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold mb-2">Total Revenue</p>
                <p className="text-2xl font-black text-white">PKR {analytics.grossRevenue.toLocaleString()}</p>
                <div className="mt-3 flex items-center gap-2 text-[#D4AF37] text-xs">
                  <Wallet size={14} />
                  <span>All order totals</span>
                </div>
              </div>

              <div className="bg-[#121A2F]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold mb-2">Delivered Revenue</p>
                <p className="text-2xl font-black text-white">PKR {analytics.deliveredRevenue.toLocaleString()}</p>
                <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs">
                  <Check size={14} />
                  <span>Completed deliveries</span>
                </div>
              </div>

              <div className="bg-[#121A2F]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold mb-2">Units Sold</p>
                <p className="text-2xl font-black text-white">{analytics.totalUnitsSold.toLocaleString()}</p>
                <div className="mt-3 flex items-center gap-2 text-sky-400 text-xs">
                  <PackageCheck size={14} />
                  <span>Total item quantity</span>
                </div>
              </div>

              <div className="bg-[#121A2F]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold mb-2">Average Order Value</p>
                <p className="text-2xl font-black text-white">PKR {Math.round(analytics.avgOrderValue).toLocaleString()}</p>
                <div className="mt-3 flex items-center gap-2 text-violet-300 text-xs">
                  <TrendingUp size={14} />
                  <span>{analytics.totalOrders} total orders</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-[#121A2F]/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg font-bold">Revenue Trend ({analytics.rangeLabel})</h3>
                    <p className="text-white/50 text-xs mt-1">Filtered sales amount visualized in chart form</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">{analytics.totalOrders} Orders</span>
                </div>

                <div className="h-72 overflow-x-auto [scrollbar-width:thin]">
                  <div className="h-full flex items-end gap-3 min-w-max pr-2">
                    {analytics.trendData.map((point) => {
                      const ratio = Math.max(6, (point.revenue / analytics.chartMax) * 100);

                      return (
                        <div key={point.key} className="h-full w-[48px] flex flex-col justify-end gap-2">
                          <div className="h-56 bg-[#0B101E] border border-white/5 rounded-xl p-2 flex items-end">
                            <div
                              className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F4CE5C] rounded-md shadow-[0_0_18px_rgba(212,175,55,0.35)]"
                              style={{ height: `${ratio}%` }}
                              title={`PKR ${point.revenue.toLocaleString()}`}
                            />
                          </div>
                          <p className="text-center text-[9px] text-white/60 uppercase tracking-wider whitespace-nowrap">{point.label}</p>
                          <p className="text-center text-[9px] text-white font-bold">{point.revenue > 0 ? `${Math.round(point.revenue / 1000)}K` : '0'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#121A2F]/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <h3 className="text-white font-bold mb-4">Order Pipeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-400">Pending</span>
                      <span className="text-white font-bold">{analytics.pendingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-400">Processing</span>
                      <span className="text-white font-bold">{analytics.processingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Delivered</span>
                      <span className="text-white font-bold">{analytics.deliveredOrders}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-3 flex items-center justify-between text-sm">
                      <span className="text-white/70">Total Orders</span>
                      <span className="text-white font-black">{analytics.totalOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121A2F]/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <h3 className="text-white font-bold mb-4">Top Selling Products</h3>
                  {analytics.topProducts.length === 0 ? (
                    <p className="text-white/50 text-sm">No product-level sales data in selected range.</p>
                  ) : (
                    <div className="space-y-3">
                      {analytics.topProducts.map((product) => (
                        <div key={product.name} className="bg-[#0B101E]/80 border border-white/5 rounded-xl p-3">
                          <p className="text-sm text-white font-semibold truncate">{product.name}</p>
                          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                            <span>{product.units} units</span>
                            <span className="text-[#D4AF37] font-bold">PKR {Math.round(product.revenue).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}