'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, ShoppingCart, Users, Plus, Edit2, Trash2, X, Save, Camera, Upload, Tag, Lock, Eye, EyeOff } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  sizeColorImages?: { size: number; color: string; image: string }[];
  category: string;
  brand: string;
  sizes: number[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
  isOnSale?: boolean;
  isNewArrival?: boolean;
}

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
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [salesProducts, setSalesProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSaleForm, setShowAddSaleForm] = useState(false);
  const [showAddNewArrivalForm, setShowAddNewArrivalForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSaleProduct, setEditingSaleProduct] = useState<Product | null>(null);
  const [editingNewArrival, setEditingNewArrival] = useState<Product | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([7, 8, 9, 10, 11, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black', 'White']);
  const [sizeColorImages, setSizeColorImages] = useState<{ size: number; color: string; image: string }[]>([]);
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
    category: 'Formal',
    brand: 'B&B',
    sizes: [7, 8, 9, 10, 11, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
    colors: ['Black', 'White'],
    description: '',
    rating: 4.5,
    reviews: 0,
    isOnSale: false
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/products');
          if (response.ok) {
            const data = await response.json();
            const allProducts = data.products || [];
            setProducts(allProducts.filter((p: Product) => !p.isOnSale && !p.isNewArrival));
            setSalesProducts(allProducts.filter((p: Product) => p.isOnSale));
            setNewArrivals(allProducts.filter((p: Product) => p.isNewArrival));
          }
        } catch (error) { console.error(error); } finally { setLoading(false); }
      };

      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders');
          if (response.ok) {
            const data = await response.json();
            setOrders(data.orders || []);
          }
        } catch (error) { console.error(error); }
      };

      fetchProducts();
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
      <div className="min-h-screen bg-gradient-to-br from-[#0047AB] to-[#002D6B] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#FFC107] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-[#0047AB]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0047AB] mb-2">Admin Panel</h1>
            <p className="text-gray-600">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0047AB] mb-2">Admin Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-[#0047AB]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] pr-12" 
                  placeholder="Enter admin password" 
                  required 
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0047AB] transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {authError && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
                {authError}
              </div>
            )}
            <button 
              type="submit" 
              className="w-full bg-[#0047AB] text-white font-bold py-3 rounded-lg hover:bg-[#003A8C] transition shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        const allProducts = data.products || [];
        setProducts(allProducts.filter((p: Product) => !p.isOnSale && !p.isNewArrival));
        setSalesProducts(allProducts.filter((p: Product) => p.isOnSale));
        setNewArrivals(allProducts.filter((p: Product) => p.isNewArrival));
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const addSize = () => {
    const size = parseInt(newSize);
    if (size && !selectedSizes.includes(size)) {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColor && !selectedColors.includes(newColor)) {
      setSelectedColors([...selectedColors, newColor]);
      setNewColor('');
    }
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
        alert('Action Successful!');
        fetchProducts();
        setShowAddForm(false);
        setShowAddSaleForm(false);
        setShowAddNewArrivalForm(false);
        setEditingProduct(null);
        setEditingSaleProduct(null);
        setEditingNewArrival(null);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const currentProduct = editingProduct || editingSaleProduct || editingNewArrival || newProduct;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0047AB] text-white py-6 shadow-md border-b-4 border-[#FFC107]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">B&B Admin Panel</h1>
            <p className="text-xs text-[#FFC107]">Exclusive Brand Management</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['products', 'sales', 'newarrivals', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition ${activeTab === tab ? 'bg-[#0047AB] text-white' : 'bg-white text-gray-500 shadow-sm'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Form for Adding/Editing */}
        {(showAddForm || showAddSaleForm || showAddNewArrivalForm || editingProduct || editingSaleProduct || editingNewArrival) && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#FFC107] mb-10">
            <h2 className="text-xl font-bold text-[#0047AB] mb-6">Product Details (Brand: B&B)</h2>
            
            {/* Image Upload Box */}
            <div className="mb-6 flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                {currentProduct.image ? <Image src={currentProduct.image} alt="preview" fill className="object-cover" /> : <Camera size={32} className="text-gray-400" />}
              </div>
              <CldUploadWidget 
                uploadPreset="bb_web" 
                onSuccess={(result: any) => {
                  const url = result.info.secure_url;
                  if (editingProduct) setEditingProduct({...editingProduct, image: url});
                  else if (editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, image: url});
                  else if (editingNewArrival) setEditingNewArrival({...editingNewArrival, image: url});
                  else setNewProduct({...newProduct, image: url});
                }}
              >
                {({ open }) => (
                  <button onClick={() => open()} className="bg-[#FFC107] text-[#0047AB] px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Upload size={18} /> Upload to Cloudinary
                  </button>
                )}
              </CldUploadWidget>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Product Name" value={currentProduct.name} onChange={e => {
                const val = e.target.value;
                if(editingProduct) setEditingProduct({...editingProduct, name: val});
                else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, name: val});
                else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, name: val});
                else setNewProduct({...newProduct, name: val});
              }} className="p-3 border rounded-lg" />
              
              <input type="number" placeholder="Price (PKR)" value={currentProduct.price} onChange={e => {
                const val = Number(e.target.value);
                if(editingProduct) setEditingProduct({...editingProduct, price: val});
                else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, price: val});
                else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, price: val});
                else setNewProduct({...newProduct, price: val});
              }} className="p-3 border rounded-lg" />

              <select value={currentProduct.category} onChange={e => {
                const val = e.target.value;
                if(editingProduct) setEditingProduct({...editingProduct, category: val});
                else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, category: val});
                else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, category: val});
                else setNewProduct({...newProduct, category: val});
              }} className="p-3 border rounded-lg">
                <option>Formal</option>
                <option>Casual</option>
                <option>Sneakers</option>
                <option>Boots</option>
              </select>

              <div className="flex gap-2">
                <input type="text" placeholder="Add Color" value={newColor} onChange={e => setNewColor(e.target.value)} className="flex-1 p-3 border rounded-lg" />
                <button onClick={addColor} className="bg-slate-800 text-white px-4 rounded-lg">Add</button>
              </div>
            </div>

            <textarea placeholder="Description" value={currentProduct.description} onChange={e => {
                const val = e.target.value;
                if(editingProduct) setEditingProduct({...editingProduct, description: val});
                else if(editingSaleProduct) setEditingSaleProduct({...editingSaleProduct, description: val});
                else if(editingNewArrival) setEditingNewArrival({...editingNewArrival, description: val});
                else setNewProduct({...newProduct, description: val});
              }} className="w-full p-3 border rounded-lg mt-6" rows={3} />

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => {
                  const body = {...currentProduct, brand: 'B&B', sizes: selectedSizes, colors: selectedColors, isOnSale: activeTab === 'sales', isNewArrival: activeTab === 'newarrivals'};
                  const method = (editingProduct || editingSaleProduct || editingNewArrival) ? 'PUT' : 'POST';
                  const url = method === 'PUT' ? `/api/products/${currentProduct.id}` : '/api/products';
                  handleAction(method, url, body);
                }} 
                className="bg-[#0047AB] text-white px-10 py-3 rounded-lg font-bold"
              >
                Save Product
              </button>
              <button onClick={() => {
                setShowAddForm(false); setShowAddSaleForm(false); setShowAddNewArrivalForm(false);
                setEditingProduct(null); setEditingSaleProduct(null); setEditingNewArrival(null);
              }} className="bg-gray-200 px-10 py-3 rounded-lg font-bold">Cancel</button>
            </div>
          </div>
        )}

        {/* Content Lists */}
        {activeTab === 'products' && (
          <div>
            <button onClick={() => setShowAddForm(true)} className="bg-[#0047AB] text-white px-6 py-3 rounded-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20}/> Add Regular Product
            </button>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border">
                  <div className="relative h-48 w-full mb-4">
                    <Image src={p.image || '/placeholder.jpg'} alt={p.name} fill className="object-cover rounded-xl" />
                  </div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-[#0047AB] font-bold">PKR {p.price.toLocaleString()}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setEditingProduct(p)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold">Edit</button>
                    <button onClick={() => handleAction('DELETE', `/api/products/${p.id}`, {})} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
           <div>
            <button onClick={() => setShowAddSaleForm(true)} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold mb-6 flex items-center gap-2">
              <Tag size={20}/> Add Sale Product
            </button>
            <div className="grid md:grid-cols-3 gap-6">
              {salesProducts.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                  <div className="relative h-48 w-full mb-4">
                    <Image src={p.image} alt={p.name} fill className="object-cover rounded-xl" />
                  </div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-red-600 font-bold">PKR {p.price.toLocaleString()}</p>
                  <button onClick={() => setEditingSaleProduct(p)} className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-bold mt-4">Edit Sale</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Order #{o.id}</p>
                  <h4 className="font-bold">{o.customerName}</h4>
                  <p className="text-sm text-gray-600">{o.items.length} Items • PKR {o.total.toLocaleString()}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}