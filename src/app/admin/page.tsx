'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, ShoppingCart, Users, Plus, Edit2, Trash2, X, Save, Camera, Upload, Tag, Lock, Eye, EyeOff, TrendingUp, Sparkles, Crown, Check } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useProducts, Product } from '@/context/ProductContext';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  total: number;
  status: string;
  date: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const { allProducts, getSaleProducts, getNewArrivals, refetchProducts, loading: contextLoading } = useProducts();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSaleForm, setShowAddSaleForm] = useState(false);
  const [showAddNewArrivalForm, setShowAddNewArrivalForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSaleProduct, setEditingSaleProduct] = useState<Product | null>(null);
  const [editingNewArrival, setEditingNewArrival] = useState<Product | null>(null);
  
  // Get filtered products from context
  const products = useMemo(() => {
    return allProducts.filter((p) => !p.isOnSale && !p.isNewArrival);
  }, [allProducts]);
  
  const salesProducts = useMemo(() => {
    return getSaleProducts();
  }, [getSaleProducts]);
  
  const newArrivals = useMemo(() => {
    return getNewArrivals();
  }, [getNewArrivals]);
  
  // Size and color management
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['7', '8', '9', '10', '11']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black']);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    image: '',
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
          const response = await fetch('/api/orders');
          if (response.ok) {
            const data = await response.json();
            setOrders(data.orders || []);
          }
        } catch (error) { 
          console.error(error); 
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (password === 'hashir189') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'authenticated');
      setPassword('');
    } else {
      setAuthError('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B101E] via-[#1a1f3a] to-[#0047AB] flex items-center justify-center p-4">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 border border-[#D4AF37]/20">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#FFC107] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0047AB] to-[#0B101E] bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600 font-medium">B&B Exclusive Management</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0047AB] mb-3">Admin Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-5 py-4 border-2 border-[#0047AB]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent pr-12 transition-all group-hover:border-[#0047AB]/50" 
                  placeholder="Enter admin password" 
                  required 
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0047AB] transition"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
            
            {authError && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-xl text-sm font-semibold">
                {authError}
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#0047AB] to-[#0B101E] text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Lock className="w-5 h-5" />
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const addSize = () => {
    const size = newSize.trim();
    if (size && !selectedSizes.includes(size)) {
      setSelectedSizes([...selectedSizes, size].sort());
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSelectedSizes(selectedSizes.filter(s => s !== size));
  };

  const addColor = () => {
    if (newColor && !selectedColors.includes(newColor)) {
      setSelectedColors([...selectedColors, newColor]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setSelectedColors(selectedColors.filter(c => c !== color));
  };

  const handleAction = async (method: string, url: string, body: any) => {
    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('✓ Product saved successfully!');
        await refetchProducts();
        setShowAddForm(false);
        setShowAddSaleForm(false);
        setShowAddNewArrivalForm(false);
        setEditingProduct(null);
        setEditingSaleProduct(null);
        setEditingNewArrival(null);
        setSelectedSizes(['7', '8', '9', '10', '11']);
        setSelectedColors(['Black']);
      } else {
        alert('✗ Failed to save product');
      }
    } catch (err) { 
      console.error(err);
      alert('✗ Error occurred');
    } finally { 
      setLoading(false); 
    }
  };

  const currentProduct = editingProduct || editingSaleProduct || editingNewArrival || newProduct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-[#0B101E] via-[#0047AB] to-[#0B101E] text-white py-8 shadow-2xl border-b-4 border-[#D4AF37] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#D4AF37]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFC107] rounded-full flex items-center justify-center shadow-xl">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">B&B Admin Portal</h1>
              <p className="text-sm text-[#D4AF37] font-medium">Luxury Brand Management System</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Premium Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {[
            { key: 'products', label: 'Regular Products', icon: Package },
            { key: 'sales', label: 'Sales & Discounts', icon: Tag },
            { key: 'newarrivals', label: 'New Arrivals', icon: Sparkles },
            { key: 'orders', label: 'Orders', icon: ShoppingCart }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-8 py-4 rounded-2xl text-sm font-bold capitalize transition-all shadow-md hover:shadow-xl flex items-center gap-3 ${
                  activeTab === tab.key 
                    ? 'bg-gradient-to-r from-[#0047AB] to-[#0B101E] text-white scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Premium Form for Adding/Editing */}
        {(showAddForm || showAddSaleForm || showAddNewArrivalForm || editingProduct || editingSaleProduct || editingNewArrival) && (
          <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/30 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFC107]/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Crown className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-2xl font-bold text-[#0047AB]">
                  {editingProduct || editingSaleProduct || editingNewArrival ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              
              {/* Image Upload Section */}
              <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-[#0047AB] mb-4">Product Main Image</label>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40 bg-white rounded-2xl border-3 border-dashed border-[#D4AF37]/40 flex items-center justify-center overflow-hidden relative shadow-lg group hover:shadow-xl transition-shadow">
                    {currentProduct.image ? (
                      <Image 
                        src={currentProduct.image} 
                        alt="preview" 
                        fill 
                        className="object-cover" 
                        unoptimized={currentProduct.image.includes('cloudinary')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Camera size={40} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
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
                      onSuccess={(result: any) => {
                        console.log('Upload success:', result);
                        const url = result.info.secure_url;
                        if (editingProduct) setEditingProduct({...editingProduct, image: url});
                        else if (editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, image: url});
                        else if (editingNewArrival) setEditingNewArrival({...editingNewArrival, image: url});
                        else setNewProduct({...newProduct, image: url});
                        alert('✓ Image uploaded successfully!');
                      }}
                      onError={(error: any) => {
                        console.error('Upload error:', error);
                        alert('✗ Failed to upload image. Please try again.');
                      }}
                    >
                      {({ open }) => (
                        <button 
                          type="button"
                          onClick={() => open()} 
                          className="bg-gradient-to-r from-[#D4AF37] to-[#FFC107] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                          <Upload size={20} /> 
                          Upload to Cloudinary
                        </button>
                      )}
                    </CldUploadWidget>
                    <p className="text-xs text-gray-500 mt-3">Recommended: 800x800px, PNG or JPG, max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-bold text-[#0047AB] mb-2">Product Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Midnight Monarch Shoes" 
                    value={currentProduct.name} 
                    onChange={e => {
                      const val = e.target.value;
                      if(editingProduct) setEditingProduct({...editingProduct, name: val});
                      else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, name: val});
                      else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, name: val});
                      else setNewProduct({...newProduct, name: val});
                    }} 
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                    required
                  />
                </div>
                
                {/* Price */}
                <div>
                  <label className="block text-sm font-bold text-[#0047AB] mb-2">Price (PKR) *</label>
                  <input 
                    type="number" 
                    placeholder="e.g., 12999" 
                    value={currentProduct.price || ''} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      if(editingProduct) setEditingProduct({...editingProduct, price: val});
                      else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, price: val});
                      else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, price: val});
                      else setNewProduct({...newProduct, price: val});
                    }} 
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                    required
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-bold text-[#0047AB] mb-2">Category *</label>
                  <select 
                    value={currentProduct.category} 
                    onChange={e => {
                      const val = e.target.value;
                      if(editingProduct) setEditingProduct({...editingProduct, category: val});
                      else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, category: val});
                      else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, category: val});
                      else setNewProduct({...newProduct, category: val});
                    }} 
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all bg-white font-medium"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Heritage">Heritage</option>
                  </select>
                </div>

                {/* Subcategory Selection */}
                <div>
                  <label className="block text-sm font-bold text-[#0047AB] mb-2">Subcategory</label>
                  <select 
                    value={(currentProduct as any).subcategory || ''} 
                    onChange={e => {
                      const val = e.target.value;
                      if(editingProduct) setEditingProduct({...editingProduct, subcategory: val} as any);
                      else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, subcategory: val} as any);
                      else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, subcategory: val} as any);
                      else setNewProduct({...newProduct, subcategory: val});
                    }} 
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all bg-white font-medium"
                  >
                    <option value="">None</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Formal">Formal</option>
                    <option value="Running">Running</option>
                    <option value="Oxford">Oxford</option>
                    <option value="Loafers">Loafers</option>
                    <option value="Boots">Boots</option>
                  </select>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-bold text-[#0047AB] mb-2">Stock Status *</label>
                  <div className="flex items-center gap-4 h-full">
                    <button
                      type="button"
                      onClick={() => {
                        if(editingProduct) setEditingProduct({...editingProduct, inStock: true});
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, inStock: true});
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, inStock: true});
                        else setNewProduct({...newProduct, inStock: true});
                      }}
                      className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
                        currentProduct.inStock 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      ✓ In Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if(editingProduct) setEditingProduct({...editingProduct, inStock: false});
                        else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, inStock: false});
                        else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, inStock: false});
                        else setNewProduct({...newProduct, inStock: false});
                      }}
                      className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
                        !currentProduct.inStock 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      ✗ Out of Stock
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#0047AB] mb-2">Product Description</label>
                <textarea 
                  placeholder="Describe the product features, materials, and unique selling points..." 
                  value={currentProduct.description} 
                  onChange={e => {
                    const val = e.target.value;
                    if(editingProduct) setEditingProduct({...editingProduct, description: val});
                    else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, description: val});
                    else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, description: val});
                    else setNewProduct({...newProduct, description: val});
                  }} 
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                  rows={4}
                />
              </div>

              {/* Size Selection */}
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl border border-blue-100">
                <label className="flex items-center gap-2 text-sm font-bold text-[#0047AB] mb-4">
                  <Package size={18} />
                  Available Sizes
                </label>
                <div className="flex gap-3 mb-4">
                  <input 
                    type="number" 
                    placeholder="Add size (e.g., 42)" 
                    value={newSize} 
                    onChange={e => setNewSize(e.target.value)} 
                    className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] outline-none" 
                  />
                  <button 
                    type="button"
                    onClick={addSize} 
                    className="bg-[#0047AB] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#003A8C] transition-all shadow-md hover:shadow-lg"
                  >
                    Add Size
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedSizes.map(size => (
                    <div 
                      key={size} 
                      className="bg-white border-2 border-[#D4AF37] text-[#0047AB] px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm"
                    >
                      {size}
                      <button 
                        type="button"
                        onClick={() => removeSize(size)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8 p-6 bg-gradient-to-br from-amber-50/50 to-transparent rounded-2xl border border-amber-100">
                <label className="flex items-center gap-2 text-sm font-bold text-[#0047AB] mb-4">
                  <Sparkles size={18} />
                  Available Colors
                </label>
                <div className="flex gap-3 mb-4">
                  <input 
                    type="text" 
                    placeholder="Add color (e.g., Navy Blue)" 
                    value={newColor} 
                    onChange={e => setNewColor(e.target.value)} 
                    className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:border-[#D4AF37] outline-none" 
                  />
                  <button 
                    type="button"
                    onClick={addColor} 
                    className="bg-[#0047AB] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#003A8C] transition-all shadow-md hover:shadow-lg"
                  >
                    Add Color
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedColors.map(color => (
                    <div 
                      key={color} 
                      className="bg-white border-2 border-[#D4AF37] text-[#0047AB] px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm"
                    >
                      {color}
                      <button 
                        type="button"
                        onClick={() => removeColor(color)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    if (!currentProduct.name || !currentProduct.price || !currentProduct.image) {
                      alert('Please fill all required fields: Name, Price, and Image');
                      return;
                    }
                    const body = {
                      ...currentProduct, 
                      brand: 'B&B', 
                      sizes: selectedSizes, 
                      colors: selectedColors, 
                      isOnSale: activeTab === 'sales' || showAddSaleForm, 
                      isNewArrival: activeTab === 'newarrivals' || showAddNewArrivalForm,
                      inStock: currentProduct.inStock !== undefined ? currentProduct.inStock : true
                    };
                    const method = (editingProduct || editingSaleProduct || editingNewArrival) ? 'PUT' : 'POST';
                    const url = method === 'PUT' ? `/api/products/${currentProduct.id}` : '/api/products';
                    handleAction(method, url, body);
                  }} 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#0047AB] to-[#0B101E] text-white px-12 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Save size={22} />
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddForm(false); 
                    setShowAddSaleForm(false); 
                    setShowAddNewArrivalForm(false);
                    setEditingProduct(null); 
                    setEditingSaleProduct(null); 
                    setEditingNewArrival(null);
                    setSelectedSizes(['7', '8', '9', '10', '11']);
                    setSelectedColors(['Black']);
                  }} 
                  className="px-12 py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button 
              onClick={() => {
                setShowAddForm(true);
                setNewProduct({
                  id: '',
                  name: '',
                  price: 0,
                  originalPrice: 0,
                  discount: 0,
                  image: '',
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
                  isOnSale: false,
                  isNewArrival: false
                });
                setSelectedSizes(['7', '8', '9', '10', '11']);
                setSelectedColors(['Black']);
              }} 
              className="bg-gradient-to-r from-[#0047AB] to-[#0B101E] text-white px-8 py-4 rounded-2xl font-bold mb-8 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus size={22}/> 
              Add Regular Product
            </button>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4 font-medium">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No regular products yet. Add your first product!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100 hover:shadow-2xl hover:scale-[1.02] transition-all group">
                    <div className="relative h-56 w-full mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                      <Image 
                        src={p.image || '/placeholder.jpg'} 
                        alt={p.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300" 
                        unoptimized={p.image?.includes('cloudinary')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-1">
                      <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">{p.category}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#0B101E] mb-2 line-clamp-1">{p.name}</h3>
                    <p className="text-2xl font-bold text-[#0047AB] mb-4">PKR {p.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(p);
                          setSelectedSizes(p.sizes || []);
                          setSelectedColors(p.colors || []);
                        }} 
                        className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16}/>
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this product?')) {
                            handleAction('DELETE', `/api/products/${p.id}`, {});
                          }
                        }} 
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div>
            <button 
              onClick={() => {
                setShowAddSaleForm(true);
                setNewProduct({
                  id: '',
                  name: '',
                  price: 0,
                  originalPrice: 0,
                  discount: 0,
                  image: '',
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
                  isOnSale: true,
                  isNewArrival: false
                });
                setSelectedSizes(['7', '8', '9', '10', '11']);
                setSelectedColors(['Black']);
              }} 
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-bold mb-8 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Tag size={22}/> 
              Add Sale Product
            </button>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4 font-medium">Loading sale products...</p>
              </div>
            ) : salesProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-red-200">
                <Tag size={64} className="mx-auto text-red-300 mb-4" />
                <p className="text-gray-500 font-medium">No sale products yet. Add your first sale!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {salesProducts.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-red-100 hover:shadow-2xl hover:scale-[1.02] transition-all group">
                    <div className="relative h-56 w-full mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-amber-50">
                      <Image 
                        src={p.image || '/placeholder.jpg'} 
                        alt={p.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300" 
                        unoptimized={p.image?.includes('cloudinary')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                        SALE
                      </div>
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-1">
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{p.category}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#0B101E] mb-2 line-clamp-1">{p.name}</h3>
                    <p className="text-2xl font-bold text-red-600 mb-4">PKR {p.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingSaleProduct(p);
                          setSelectedSizes(p.sizes || []);
                          setSelectedColors(p.colors || []);
                        }} 
                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16}/>
                        Edit Sale
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this sale product?')) {
                            handleAction('DELETE', `/api/products/${p.id}`, {});
                          }
                        }} 
                        className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Arrivals Tab */}
        {activeTab === 'newarrivals' && (
          <div>
            <button 
              onClick={() => {
                setShowAddNewArrivalForm(true);
                setNewProduct({
                  id: '',
                  name: '',
                  price: 0,
                  originalPrice: 0,
                  discount: 0,
                  image: '',
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
                  isOnSale: false,
                  isNewArrival: true
                });
                setSelectedSizes(['7', '8', '9', '10', '11']);
                setSelectedColors(['Black']);
              }} 
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold mb-8 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Sparkles size={22}/> 
              Add New Arrival
            </button>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4 font-medium">Loading new arrivals...</p>
              </div>
            ) : newArrivals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-green-200">
                <Sparkles size={64} className="mx-auto text-green-300 mb-4" />
                <p className="text-gray-500 font-medium">No new arrivals yet. Add your first item!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {newArrivals.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-green-100 hover:shadow-2xl hover:scale-[1.02] transition-all group">
                    <div className="relative h-56 w-full mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                      <Image 
                        src={p.image || '/placeholder.jpg'} 
                        alt={p.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300" 
                        unoptimized={p.image?.includes('cloudinary')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                        NEW
                      </div>
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">Out of Stock</span>
                        </div>
                        )}
                    </div>
                    <div className="mb-1">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{p.category}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#0B101E] mb-2 line-clamp-1">{p.name}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-4">PKR {p.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingNewArrival(p);
                          setSelectedSizes(p.sizes || []);
                          setSelectedColors(p.colors || []);
                        }} 
                        className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16}/>
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this new arrival?')) {
                            handleAction('DELETE', `/api/products/${p.id}`, {});
                          }
                        }} 
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No orders yet</p>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 flex justify-between items-center hover:shadow-xl transition-all">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Order #{o.id}</p>
                    <h4 className="font-bold text-xl text-[#0B101E] mb-2">{o.customerName}</h4>
                    <p className="text-sm text-gray-600">
                      {o.items.length} Items • <span className="font-bold text-[#0047AB]">PKR {o.total.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="bg-gradient-to-r from-[#FFC107] to-[#D4AF37] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                    {o.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
