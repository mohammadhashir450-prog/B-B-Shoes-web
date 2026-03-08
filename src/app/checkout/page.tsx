'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CreditCard, Smartphone, Banknote, Check, ChevronRight, Shield, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

const STORE_BANKS = [
  { name: 'HBL', account: '1234567890', title: 'B&B Shoes' },
  { name: 'Meezan Bank', account: '0987654321', title: 'B&B Shoes' },
  { name: 'Allied Bank', account: '1122334455', title: 'B&B Shoes' },
  { name: 'UBL', account: '5544332211', title: 'B&B Shoes' },
];

const PAKISTAN_BANKS = [
  'Allied Bank Limited (ABL)',
  'Askari Bank',
  'Bank Al Habib',
  'Bank Alfalah',
  'Bank of Khyber',
  'Bank of Punjab',
  'BankIslami Pakistan',
  'Dubai Islamic Bank Pakistan',
  'Faysal Bank',
  'First Women Bank',
  'Habib Bank Limited (HBL)',
  'Habib Metropolitan Bank',
  'Industrial Development Bank',
  'JS Bank',
  'KASB Bank',
  'MCB Bank (Muslim Commercial Bank)',
  'MCB Islamic Bank',
  'Meezan Bank',
  'National Bank of Pakistan (NBP)',
  'NIB Bank',
  'Pak Oman Investment Company',
  'Samba Bank',
  'Silk Bank',
  'Sindh Bank',
  'Soneri Bank',
  'Standard Chartered Pakistan',
  'Summit Bank',
  'United Bank Limited (UBL)',
  'Zarai Taraqiati Bank (ZTBL)',
  'Al Baraka Bank Pakistan',
];

const paymentMethods = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: CreditCard,
    description: 'Transfer to our bank account',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    icon: Smartphone,
    description: 'Pay via JazzCash wallet',
    details: { number: '03XX-XXXXXXX', name: 'B&B Shoes' }
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: Banknote,
    description: 'Pay when you receive',
  }
];

const STORAGE_KEY = 'user-payment-details';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string>('cod');
  const [showSuccess, setShowSuccess] = useState(false);

  // Payment Form States
  const [jazzCashNumber, setJazzCashNumber] = useState('');
  const [jazzCashTransactionId, setJazzCashTransactionId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankTransactionId, setBankTransactionId] = useState('');
  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [codName, setCodName] = useState('');
  const [codPhone, setCodPhone] = useState('');
  const [codAddress, setCodAddress] = useState('');
  const [codCity, setCodCity] = useState('');
  const [formError, setFormError] = useState('');

  // Save state indicators
  const [bankSaved, setBankSaved] = useState(false);
  const [jazzCashSaved, setJazzCashSaved] = useState(false);
  const [codSaved, setCodSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved payment details from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bank) {
          setSelectedBank(parsed.bank.selectedBank || '');
          setSenderAccountNumber(parsed.bank.accountNumber || '');
          setBankSaved(true);
        }
        if (parsed.jazzcash) {
          setJazzCashNumber(parsed.jazzcash.number || '');
          setJazzCashSaved(true);
        }
        if (parsed.cod) {
          setCodName(parsed.cod.name || '');
          setCodPhone(parsed.cod.phone || '');
          setCodAddress(parsed.cod.address || '');
          setCodCity(parsed.cod.city || '');
          setCodSaved(true);
        }
      } catch (_) {}
    }
  }, []);

  const showTempMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const handleSaveBank = () => {
    if (!selectedBank) { setFormError('Please select your bank first'); return; }
    if (!senderAccountNumber.trim()) { setFormError('Please enter your account number'); return; }
    setFormError('');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    saved.bank = { selectedBank, accountNumber: senderAccountNumber };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setBankSaved(true);
    showTempMessage('Bank details saved!');
  };

  const handleSaveJazzCash = () => {
    if (!jazzCashNumber.trim()) { setFormError('Please enter your JazzCash number'); return; }
    if (!/^03\d{9}$/.test(jazzCashNumber.replace(/-/g, ''))) { setFormError('Enter a valid number (03XXXXXXXXX)'); return; }
    setFormError('');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    saved.jazzcash = { number: jazzCashNumber };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setJazzCashSaved(true);
    showTempMessage('JazzCash number saved!');
  };

  const handleSaveCod = () => {
    if (!codName.trim()) { setFormError('Please enter your full name'); return; }
    if (!codPhone.trim() || !/^03\d{9}$/.test(codPhone.replace(/-/g, ''))) { setFormError('Enter a valid phone number (03XXXXXXXXX)'); return; }
    if (!codAddress.trim()) { setFormError('Please enter your delivery address'); return; }
    if (!codCity) { setFormError('Please select your city'); return; }
    setFormError('');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    saved.cod = { name: codName, phone: codPhone, address: codAddress, city: codCity };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setCodSaved(true);
    showTempMessage('Delivery details saved!');
  };

  const validatePaymentDetails = () => {
    setFormError('');

    if (selectedMethod === 'jazzcash') {
      if (!jazzCashNumber.trim()) {
        setFormError('Please enter your JazzCash number');
        return false;
      }
      if (!/^03\d{9}$/.test(jazzCashNumber.replace(/-/g, ''))) {
        setFormError('Please enter a valid JazzCash number (03XXXXXXXXX)');
        return false;
      }
      if (!jazzCashTransactionId.trim()) {
        setFormError('Please enter transaction ID after payment');
        return false;
      }
    }

    if (selectedMethod === 'bank') {
      if (!selectedBank) {
        setFormError('Please select your bank');
        return false;
      }
      if (!senderAccountNumber.trim()) {
        setFormError('Please enter your account number');
        return false;
      }
      if (!bankTransactionId.trim()) {
        setFormError('Please enter transaction reference/ID');
        return false;
      }
    }

    if (selectedMethod === 'cod') {
      if (!codName.trim()) {
        setFormError('Please enter your full name');
        return false;
      }
      if (!codPhone.trim()) {
        setFormError('Please enter your phone number');
        return false;
      }
      if (!/^03\d{9}$/.test(codPhone.replace(/-/g, ''))) {
        setFormError('Please enter a valid phone number (03XXXXXXXXX)');
        return false;
      }
      if (!codAddress.trim()) {
        setFormError('Please enter your delivery address');
        return false;
      }
      if (!codCity.trim()) {
        setFormError('Please select your city');
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validatePaymentDetails()) return;

    const orderData = {
      items,
      totalPrice,
      paymentMethod: selectedMethod,
      paymentDetails: selectedMethod === 'jazzcash'
        ? { number: jazzCashNumber, transactionId: jazzCashTransactionId }
        : selectedMethod === 'bank'
        ? { bank: selectedBank, accountNumber: senderAccountNumber, transactionId: bankTransactionId }
        : { name: codName, phone: codPhone, address: codAddress, city: codCity }
    };

    console.log('Order Data:', orderData);
    setShowSuccess(true);
    setTimeout(() => {
      clearCart();
      router.push('/my-orders');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Method</h1>
            <p className="text-gray-400">Choose your preferred payment option</p>
          </div>

          {/* Global save notification */}
          {saveMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-400 font-semibold">{saveMessage}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`bg-[#1A2435] rounded-xl p-6 border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#D4AF37]' : 'bg-white/5'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-white'}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold">{method.name}</h3>
                            {method.id === 'bank' && bankSaved && (
                              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Saved</span>
                            )}
                            {method.id === 'jazzcash' && jazzCashSaved && (
                              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Saved</span>
                            )}
                            {method.id === 'cod' && codSaved && (
                              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Saved</span>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{method.description}</p>

                        {/* ── Bank Transfer Form ── */}
                        {method.id === 'bank' && isSelected && (
                          <div className="bg-black/30 rounded-lg p-4 space-y-4" onClick={(e) => e.stopPropagation()}>

                            {/* Store bank accounts */}
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Our Bank Accounts (Transfer Here):</p>
                              <div className="space-y-2 mb-1">
                                {STORE_BANKS.map((bank) => (
                                  <div key={bank.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                    <div>
                                      <p className="font-semibold text-sm">{bank.name}</p>
                                      <p className="text-xs text-gray-400">{bank.title}</p>
                                    </div>
                                    <p className="text-[#D4AF37] font-mono text-sm">{bank.account}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* User bank details */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                              <p className="text-sm font-semibold text-[#D4AF37]">Your Bank Details:</p>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Select Your Bank *</label>
                                <select
                                  value={selectedBank}
                                  onChange={(e) => { setSelectedBank(e.target.value); setBankSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                                >
                                  <option value="">Choose your bank...</option>
                                  {PAKISTAN_BANKS.map((bank) => (
                                    <option key={bank} value={bank}>{bank}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Your Account Number *</label>
                                <input
                                  type="text"
                                  placeholder="Enter your account number"
                                  value={senderAccountNumber}
                                  onChange={(e) => { setSenderAccountNumber(e.target.value); setBankSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSaveBank(); }}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    bankSaved
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-[#D4AF37] text-black hover:bg-[#F4CE5C]'
                                  }`}
                                >
                                  {bankSaved ? <><CheckCircle2 className="w-4 h-4" /> Details Saved</> : <><Save className="w-4 h-4" /> Save Bank Details</>}
                                </button>
                                {bankSaved && <span className="text-xs text-green-400">✓ Saved to device</span>}
                              </div>

                              <div className="pt-2 border-t border-white/10">
                                <label className="block text-sm font-semibold mb-2">Transaction Reference / ID *</label>
                                <input
                                  type="text"
                                  placeholder="Enter transaction reference number"
                                  value={bankTransactionId}
                                  onChange={(e) => setBankTransactionId(e.target.value)}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-gray-400 mt-1">Enter the reference number from your bank transfer receipt</p>
                              </div>
                            </div>

                            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                              <p className="text-xs text-yellow-400">📌 Complete the bank transfer first, then enter your details and transaction ID above</p>
                            </div>
                          </div>
                        )}

                        {/* ── JazzCash Form ── */}
                        {method.id === 'jazzcash' && isSelected && method.details && (
                          <div className="bg-black/30 rounded-lg p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Send Payment To:</p>
                              <p className="text-2xl font-bold text-[#D4AF37] mb-1">{method.details.number}</p>
                              <p className="text-sm text-gray-400 mb-4">Account Title: {method.details.name}</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                              <p className="text-sm font-semibold text-[#D4AF37]">Your JazzCash Details:</p>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Your JazzCash Number *</label>
                                <input
                                  type="text"
                                  placeholder="03XX-XXXXXXX"
                                  value={jazzCashNumber}
                                  maxLength={11}
                                  onChange={(e) => { setJazzCashNumber(e.target.value); setJazzCashSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-gray-400 mt-1">The number you are sending from</p>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSaveJazzCash(); }}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    jazzCashSaved
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-[#D4AF37] text-black hover:bg-[#F4CE5C]'
                                  }`}
                                >
                                  {jazzCashSaved ? <><CheckCircle2 className="w-4 h-4" /> Number Saved</> : <><Save className="w-4 h-4" /> Save JazzCash Number</>}
                                </button>
                                {jazzCashSaved && <span className="text-xs text-green-400">✓ Saved to device</span>}
                              </div>

                              <div className="pt-2 border-t border-white/10">
                                <label className="block text-sm font-semibold mb-2">Transaction ID *</label>
                                <input
                                  type="text"
                                  placeholder="Enter JazzCash transaction ID"
                                  value={jazzCashTransactionId}
                                  onChange={(e) => setJazzCashTransactionId(e.target.value)}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-gray-400 mt-1">Transaction ID received after sending payment</p>
                              </div>
                            </div>

                            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                              <p className="text-xs text-yellow-400">📌 Send payment first, then enter your number and transaction ID</p>
                            </div>
                          </div>
                        )}

                        {/* ── Cash on Delivery Form ── */}
                        {method.id === 'cod' && isSelected && (
                          <div className="bg-black/30 rounded-lg p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
                              <p className="text-sm text-blue-400">💰 Pay in cash when your order is delivered to your door</p>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter your full name"
                                  value={codName}
                                  onChange={(e) => { setCodName(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                                <input
                                  type="text"
                                  placeholder="03XX-XXXXXXX"
                                  value={codPhone}
                                  maxLength={11}
                                  onChange={(e) => { setCodPhone(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                                <textarea
                                  placeholder="House/Flat #, Street, Area"
                                  value={codAddress}
                                  rows={3}
                                  onChange={(e) => { setCodAddress(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">City *</label>
                                <select
                                  value={codCity}
                                  onChange={(e) => { setCodCity(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                                >
                                  <option value="">Select your city...</option>
                                  <option value="Karachi">Karachi</option>
                                  <option value="Lahore">Lahore</option>
                                  <option value="Islamabad">Islamabad</option>
                                  <option value="Rawalpindi">Rawalpindi</option>
                                  <option value="Faisalabad">Faisalabad</option>
                                  <option value="Multan">Multan</option>
                                  <option value="Peshawar">Peshawar</option>
                                  <option value="Quetta">Quetta</option>
                                  <option value="Sialkot">Sialkot</option>
                                  <option value="Gujranwala">Gujranwala</option>
                                  <option value="Hyderabad">Hyderabad</option>
                                  <option value="Bahawalpur">Bahawalpur</option>
                                  <option value="Sargodha">Sargodha</option>
                                  <option value="Sukkur">Sukkur</option>
                                  <option value="Abbottabad">Abbottabad</option>
                                  <option value="Mardan">Mardan</option>
                                  <option value="Sahiwal">Sahiwal</option>
                                  <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSaveCod(); }}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    codSaved
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-[#D4AF37] text-black hover:bg-[#F4CE5C]'
                                  }`}
                                >
                                  {codSaved ? <><CheckCircle2 className="w-4 h-4" /> Details Saved</> : <><Save className="w-4 h-4" /> Save Delivery Details</>}
                                </button>
                                {codSaved && <span className="text-xs text-green-400">✓ Saved to device</span>}
                              </div>
                            </div>

                            <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                              <p className="text-xs text-green-400">✓ Available across all major cities of Pakistan</p>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-[#1A2435] to-[#0F1825] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Secure Payment</h3>
                    <p className="text-sm text-gray-400">All transactions are secure and encrypted. Your payment information is protected.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-2xl p-8 border border-[#D4AF37]/20 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-black/30 rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-gray-400">+{items.length - 3} more items</p>
                  )}
                </div>

                <div className="space-y-4 mb-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-semibold">PKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Delivery</span>
                    <span className="font-semibold text-[#D4AF37]">FREE</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">PKR {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{formError}</p>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={items.length === 0}
                  className="w-full bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1A2435] rounded-2xl p-8 max-w-md mx-4 border border-[#D4AF37]/30">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Order Placed!</h2>
            <p className="text-gray-400 text-center">Your order has been successfully placed. Redirecting to orders...</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
