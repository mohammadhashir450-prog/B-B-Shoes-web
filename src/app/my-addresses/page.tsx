'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Plus, Edit2, Trash2, MapPin, Phone, User, Home as HomeIcon } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  isDefault: boolean;
}

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: 'Punjab'
  });

  useEffect(() => {
    const saved = localStorage.getItem('user-addresses');
    if (saved) {
      setAddresses(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newAddresses: Address[]) => {
    localStorage.setItem('user-addresses', JSON.stringify(newAddresses));
    setAddresses(newAddresses);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = addresses.map(addr =>
        addr.id === editingId ? { ...addr, ...formData } : addr
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0
      };
      saveToStorage([...addresses, newAddress]);
    }

    setFormData({ name: '', phone: '', address: '', city: '', province: 'Punjab' });
    setShowForm(false);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    saveToStorage(addresses.filter(addr => addr.id !== id));
  };

  const setAsDefault = (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">My Addresses</h1>
              <p className="text-gray-400">Manage your delivery addresses</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ name: '', phone: '', address: '', city: '', province: 'Punjab' });
              }}
              className="bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 px-6 rounded-full transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Address
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-[#1A2435] rounded-2xl p-8 border border-[#D4AF37]/20 mb-8">
              <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-12 pr-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-12 pr-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Complete Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg pl-12 pr-4 py-3 focus:border-[#D4AF37] focus:outline-none min-h-[100px]"
                      placeholder="House no., Street, Area"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                      placeholder="e.g., Lahore, Karachi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Province</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="AJK">Azad Jammu & Kashmir</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 rounded-full transition-all"
                  >
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', phone: '', address: '', city: '', province: 'Punjab' });
                    }}
                    className="px-8 border border-white/20 hover:border-[#D4AF37] text-white font-bold py-3 rounded-full transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <div className="bg-[#1A2435] rounded-3xl p-16 text-center border border-white/10">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No Addresses Saved</h2>
              <p className="text-gray-400 mb-8">Add your first delivery address to get started</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-[#1A2435] rounded-xl p-6 border-2 transition-all ${
                    address.isDefault 
                      ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="font-bold">{address.name}</h3>
                        {address.isDefault && (
                          <span className="text-xs text-[#D4AF37]">Default Address</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {address.phone}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>{address.address}</span>
                    </p>
                    <p className="text-gray-400 ml-6">{address.city}, {address.province}</p>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => setAsDefault(address.id)}
                      className="w-full border border-white/20 hover:border-[#D4AF37] text-white font-semibold py-2 rounded-lg transition-all text-sm"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
