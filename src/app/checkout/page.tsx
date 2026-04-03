'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CreditCard, Smartphone, Banknote, Check, ChevronRight, Shield, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { maskCardNumber } from '@/lib/security';

const STORE_BANK_ACCOUNT = {
  name: 'Meezan Bank',
  account: '0987654321',
  title: 'B&B Shoes',
};

const STORE_JAZZCASH = {
  number: '03XX-XXXXXXX',
  name: 'B&B Shoes',
};

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: CreditCard,
    description: 'Pay securely with Visa or Mastercard',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: CreditCard,
    description: 'Transfer to Meezan Bank account',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    icon: Smartphone,
    description: 'Pay via JazzCash wallet',
    details: STORE_JAZZCASH
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
  const { data: session, status } = useSession();
  const { items, totalPrice, clearCart } = useCart();
  const deliveryFee = totalPrice >= 4000 ? 0 : totalPrice > 0 ? 250 : 0;
  const orderTotal = totalPrice + deliveryFee;
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Payment Form States
  const [jazzCashNumber, setJazzCashNumber] = useState('');
  const [jazzCashTransactionId, setJazzCashTransactionId] = useState('');
  const [bankTransactionId, setBankTransactionId] = useState('');
  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [preferredCardBrand, setPreferredCardBrand] = useState<'Visa' | 'Mastercard' | ''>('');
  const [codName, setCodName] = useState('');
  const [codPhone, setCodPhone] = useState('');
  const [codAddress, setCodAddress] = useState('');
  const [codCity, setCodCity] = useState('');
  const [formError, setFormError] = useState('');

  // Save state indicators
  const [bankSaved, setBankSaved] = useState(false);
  const [jazzCashSaved, setJazzCashSaved] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);
  const [savedCardProfile, setSavedCardProfile] = useState<{ cardHolderName: string; expiry: string; cardLast4: string; cardMasked: string; cardBrand: string } | null>(null);
  const [codSaved, setCodSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const normalizeDigits = (value: string) => {
    return value
      .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
      .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06F0))
      .replace(/[\uFF10-\uFF19]/g, (digit) => String(digit.charCodeAt(0) - 0xFF10));
  };

  const toNumeric = (value: string) => normalizeDigits(value).replace(/\D/g, '');

  const formatCardNumber = (value: string) => {
    const digits = toNumeric(value).slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = toNumeric(value).slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  function detectCardBrand(value: string) {
    const digits = toNumeric(value);
    if (/^4/.test(digits)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
    return 'Card';
  }

  function isValidLuhn(value: string) {
    const digits = toNumeric(value);
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i -= 1) {
      let digit = Number(digits[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  const cardNumberDigits = toNumeric(cardNumber);
  const cardExpiryValue = formatExpiry(cardExpiry);
  const cvcDigits = toNumeric(cardCvc);
  const hasSavedCard = Boolean(savedCardProfile);

  const cardFieldState = {
    holder:
      cardHolderName.trim().length === 0
        ? { tone: 'text-gray-500', text: 'Enter the name exactly as shown on the card' }
        : { tone: 'text-emerald-600', text: 'Card holder name looks good' },
    number: (() => {
      if (hasSavedCard && cardNumberDigits.length === 0) {
        return { tone: 'text-sky-600', text: `Saved card ready: ${savedCardProfile?.cardMasked || 'masked card on file'}` };
      }

      if (cardNumberDigits.length === 0) {
        return { tone: 'text-gray-500', text: 'Enter a Visa or Mastercard number' };
      }

      if (cardNumberDigits.length < 13) {
        return { tone: 'text-amber-600', text: `${cardNumberDigits.length} digits entered, card number is incomplete` };
      }

      if (cardNumberDigits.length > 19) {
        return { tone: 'text-red-600', text: 'Card number is too long' };
      }

      if (isValidLuhn(cardNumberDigits)) {
        return { tone: 'text-emerald-600', text: `${detectCardBrand(cardNumberDigits)} number looks valid` };
      }

      return { tone: 'text-amber-600', text: 'Card number format is being checked' };
    })(),
    expiry:
      cardExpiryValue.length === 0
        ? { tone: 'text-gray-500', text: hasSavedCard ? `Saved expiry: ${savedCardProfile?.expiry || 'available'}` : 'Use MM/YY format' }
        : /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiryValue)
          ? { tone: 'text-emerald-600', text: 'Expiry date looks valid' }
          : { tone: 'text-amber-600', text: 'Enter expiry in MM/YY format' },
    cvc:
      cvcDigits.length === 0
        ? { tone: 'text-gray-500', text: 'Enter 3 or 4 digits' }
        : /^\d{3,4}$/.test(cvcDigits)
          ? { tone: 'text-emerald-600', text: 'CVC looks valid' }
          : { tone: 'text-red-600', text: 'CVC must be 3 or 4 digits' },
  };

  // Load saved payment details from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bank) {
          setSenderAccountNumber(parsed.bank.accountNumber || '');
          setBankSaved(true);
        }
        if (parsed.jazzcash) {
          setJazzCashNumber(parsed.jazzcash.number || '');
          setJazzCashSaved(true);
        }
        if (parsed.card) {
          setCardHolderName(parsed.card.cardHolderName || '');
          setCardExpiry(parsed.card.expiry || '');
          setSavedCardProfile({
            cardHolderName: parsed.card.cardHolderName || '',
            expiry: parsed.card.expiry || '',
            cardLast4: parsed.card.last4 || '',
            cardMasked: parsed.card.cardMasked || (parsed.card.last4 ? `**** **** **** ${parsed.card.last4}` : ''),
            cardBrand: parsed.card.brand || 'Card',
          });
          setCardSaved(true);
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const showTempMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const handleSaveBank = () => {
    if (!senderAccountNumber.trim()) { setFormError('Please enter your account number'); return; }
    setFormError('');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    saved.bank = { accountNumber: senderAccountNumber };
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

  const handleSaveCard = () => {
    const digits = cardNumberDigits;
    if (!cardHolderName.trim()) {
      setFormError('Please enter card holder name');
      return;
    }
    if (!isValidLuhn(digits)) {
      setFormError('Please enter a valid card number');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiryValue)) {
      setFormError('Please enter expiry as MM/YY');
      return;
    }
    if (!/^\d{3,4}$/.test(cvcDigits)) {
      setFormError('Please enter a valid CVC (3 or 4 digits)');
      return;
    }

    setFormError('');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const masked = maskCardNumber(digits);
    const brand = detectCardBrand(digits);
    saved.card = {
      cardHolderName,
      expiry: cardExpiryValue,
      last4: digits.slice(-4),
      brand,
      cardMasked: masked,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setSavedCardProfile({
      cardHolderName,
      expiry: cardExpiry,
      cardLast4: digits.slice(-4),
      cardMasked: masked,
      cardBrand: brand,
    });
    setCardNumber('');
    setCardCvc('');
    setCardSaved(true);
    showTempMessage('Card details saved securely!');
  };

  const handleDeleteSavedCard = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete saved.card;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    setSavedCardProfile(null);
    setCardSaved(false);
    setCardHolderName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    showTempMessage('Saved card deleted');
  };

  const validatePaymentDetails = () => {
    setFormError('');

    if (!codName.trim()) {
      setFormError('Please enter your full name in delivery details');
      return false;
    }
    if (!codPhone.trim() || !/^03\d{9}$/.test(codPhone.replace(/-/g, ''))) {
      setFormError('Please enter a valid delivery phone number (03XXXXXXXXX)');
      return false;
    }
    if (!codAddress.trim()) {
      setFormError('Please enter your delivery address');
      return false;
    }
    if (!codCity.trim()) {
      setFormError('Please select your delivery city');
      return false;
    }

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
      if (!senderAccountNumber.trim()) {
        setFormError('Please enter your account number');
        return false;
      }
      if (!bankTransactionId.trim()) {
        setFormError('Please enter transaction reference/ID');
        return false;
      }
    }

    if (selectedMethod === 'card') {
      const digits = cardNumberDigits;
      const hasSavedProfile = hasSavedCard;
      if (!cardHolderName.trim() && !hasSavedProfile) {
        setFormError('Please enter card holder name');
        return false;
      }
      if (!hasSavedProfile && !isValidLuhn(digits)) {
        setFormError('Please enter a valid Visa or Mastercard number');
        return false;
      }
      const expiryToValidate = cardExpiryValue || savedCardProfile?.expiry || '';
      if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiryToValidate)) {
        setFormError('Please enter expiry as MM/YY');
        return false;
      }
      if (!/^\d{3,4}$/.test(cvcDigits)) {
        setFormError('Please enter valid CVC');
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

  const handlePlaceOrder = async () => {
    if (!validatePaymentDetails()) return;

    if (!session?.user?.email || !session?.user?.user_id) {
      setFormError('Please sign in again to place your order.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const normalizedItems = items.map((item) => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        quantity: item.quantity,
        size: item.size || 'N/A',
        color: item.color || 'Default',
        price: item.price,
      }));

      let paymentDetails: any = {
        cod: {
          name: codName,
          phone: codPhone,
          address: codAddress,
          city: codCity,
        },
      };

      if (selectedMethod === 'jazzcash') {
        paymentDetails = {
          ...paymentDetails,
          jazzcash: {
            senderNumber: jazzCashNumber,
            transactionId: jazzCashTransactionId,
            receiverNumber: STORE_JAZZCASH.number,
            receiverName: STORE_JAZZCASH.name,
          },
        };
      }

      if (selectedMethod === 'bank') {
        paymentDetails = {
          ...paymentDetails,
          bank: {
            bankName: STORE_BANK_ACCOUNT.name,
            receiverAccountNumber: STORE_BANK_ACCOUNT.account,
            receiverTitle: STORE_BANK_ACCOUNT.title,
            senderAccountNumber,
            transactionId: bankTransactionId,
          },
        };
      }

      if (selectedMethod === 'card') {
        const cardDigits = cardNumberDigits;
        const hasSavedProfile = Boolean(savedCardProfile && !cardDigits);
        const finalHolder = hasSavedProfile ? savedCardProfile?.cardHolderName || cardHolderName : cardHolderName;
        const finalExpiry = hasSavedProfile
          ? savedCardProfile?.expiry || cardExpiryValue
          : cardExpiryValue;
        const [expiryMonth = '', expiryYear = ''] = finalExpiry.split('/');
        const finalBrand = hasSavedProfile
          ? (savedCardProfile?.cardBrand || 'Card')
          : (preferredCardBrand || detectCardBrand(cardDigits));
        const finalLast4 = hasSavedProfile ? savedCardProfile?.cardLast4 || '' : cardDigits.slice(-4);
        const finalMasked = hasSavedProfile ? savedCardProfile?.cardMasked || `**** **** **** ${finalLast4}` : maskCardNumber(cardDigits);

        paymentDetails = {
          ...paymentDetails,
          card: {
            cardHolderName: finalHolder,
            cardBrand: finalBrand,
            cardLast4: finalLast4,
            cardMasked: finalMasked,
            expiryMonth,
            expiryYear: expiryYear.length === 2 ? `20${expiryYear}` : expiryYear,
            transactionId: `CARD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          },
        };
      }

      const payload = {
        user_id: session.user.user_id,
        customerName: codName || session.user.name || 'Customer',
        customerEmail: session.user.email,
        customerPhone: codPhone,
        customerAddress: `${codAddress}${codCity ? `, ${codCity}` : ''}`,
        items: normalizedItems,
        subtotal: totalPrice,
        shippingFee: deliveryFee,
        total: orderTotal,
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === 'cod' ? 'pending' : 'paid',
        paymentDetails,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result.success) {
        const message = result?.message || `Failed to place order (HTTP ${response.status}). Please try again.`;
        throw new Error(message);
      }

      const placedOrderId = result.data?.orderId || result.data?.id || `ORD-${Date.now()}`;

      setShowSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push(`/my-orders?placed=${encodeURIComponent(placedOrderId)}&t=${Date.now()}`);
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      setFormError(message);
    } finally {
      setIsPlacingOrder(false);
    }
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
                            {method.id === 'card' && cardSaved && (
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
                          <div className="bg-white rounded-lg p-4 space-y-4 border border-[#D4AF37]/35 shadow-[0_14px_30px_-20px_rgba(7,10,15,0.45)]" onClick={(e) => e.stopPropagation()}>

                            {/* Store bank accounts */}
                            <div>
                              <p className="text-xs text-[#F7EBC0] uppercase tracking-wider mb-3">Admin Bank Account (Transfer Here)</p>
                              <div className="bg-[#D4AF37]/12 border border-[#D4AF37]/30 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-sm text-[#111827]">{STORE_BANK_ACCOUNT.name}</p>
                                    <p className="text-xs text-[#4B5563]">{STORE_BANK_ACCOUNT.title}</p>
                                  </div>
                                  <p className="text-[#F5D77A] font-mono text-sm">{STORE_BANK_ACCOUNT.account}</p>
                                </div>
                              </div>
                            </div>

                            {/* User bank details */}
                            <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                              <p className="text-sm font-semibold text-[#D4AF37]">Your Bank Details:</p>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Your Account Number *</label>
                                <input
                                  type="text"
                                  placeholder="Enter your account number"
                                  value={senderAccountNumber}
                                  onChange={(e) => { setSenderAccountNumber(e.target.value); setBankSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
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

                              <div className="pt-2 border-t border-[#E5E7EB]">
                                <label className="block text-sm font-semibold mb-2">Transaction Reference / ID *</label>
                                <input
                                  type="text"
                                  placeholder="Enter transaction reference number"
                                  value={bankTransactionId}
                                  onChange={(e) => setBankTransactionId(e.target.value)}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-[#6B7280] mt-1">Enter the reference number from your bank transfer receipt</p>
                              </div>
                            </div>

                            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                              <p className="text-xs text-yellow-300">Complete transfer to Meezan account, then enter your account and transaction ID.</p>
                            </div>
                          </div>
                        )}

                        {/* ── Card Payment Form ── */}
                        {method.id === 'card' && isSelected && (
                          <div className="bg-white rounded-lg p-4 space-y-4 border border-[#D4AF37]/35 shadow-[0_14px_30px_-20px_rgba(7,10,15,0.45)]" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                              <p className="text-xs text-emerald-700">Secure Card Checkout (Visa / Mastercard). Card is processed securely and only masked details are stored.</p>
                            </div>

                            {savedCardProfile && (
                              <div className="bg-[#F8F5EB] border border-[#D8CDAE] rounded-lg p-3 flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">Saved Card</p>
                                  <p className="text-sm text-[#111827] font-semibold">{savedCardProfile.cardBrand} {savedCardProfile.cardMasked}</p>
                                  <p className="text-xs text-[#6B7280]">Expiry: {savedCardProfile.expiry}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteSavedCard(); }}
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold mb-2">Card Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setPreferredCardBrand('Visa'); }}
                                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                                      preferredCardBrand === 'Visa' ? 'border-[#D4AF37] bg-[#FFF7E3] text-[#111827]' : 'border-[#D1D5DB] bg-white text-[#4B5563]'
                                    }`}
                                  >
                                    Visa
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setPreferredCardBrand('Mastercard'); }}
                                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                                      preferredCardBrand === 'Mastercard' ? 'border-[#D4AF37] bg-[#FFF7E3] text-[#111827]' : 'border-[#D1D5DB] bg-white text-[#4B5563]'
                                    }`}
                                  >
                                    Mastercard
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Card Holder Name *</label>
                                <input
                                  type="text"
                                  placeholder="Name on card"
                                  value={cardHolderName}
                                  onChange={(e) => { setCardHolderName(e.target.value); setCardSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className={`text-xs mt-1 ${cardFieldState.holder.tone}`}>{cardFieldState.holder.text}</p>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Card Number *</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={19}
                                  placeholder={savedCardProfile ? 'Leave empty to use saved card' : 'XXXX XXXX XXXX XXXX'}
                                  value={cardNumber}
                                  onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setCardSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className={`text-xs mt-1 ${cardFieldState.number.tone}`}>{cardFieldState.number.text}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold mb-2">Expiry (MM/YY) *</label>
                                  <input
                                    type="text"
                                    maxLength={5}
                                    placeholder="MM/YY"
                                    value={cardExpiry}
                                    onChange={(e) => {
                                      setCardExpiry(formatExpiry(e.target.value));
                                      setCardSaved(false);
                                    }}
                                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                  />
                                  <p className={`text-xs mt-1 ${cardFieldState.expiry.tone}`}>{cardFieldState.expiry.text}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold mb-2">CVC *</label>
                                  <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="***"
                                    value={cardCvc}
                                    onChange={(e) => { setCardCvc(toNumeric(e.target.value).slice(0, 4)); setCardSaved(false); }}
                                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                  />
                                  <p className={`text-xs mt-1 ${cardFieldState.cvc.tone}`}>{cardFieldState.cvc.text}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSaveCard(); }}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    cardSaved
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-[#D4AF37] text-black hover:bg-[#F4CE5C]'
                                  }`}
                                >
                                  {cardSaved ? <><CheckCircle2 className="w-4 h-4" /> Card Saved</> : <><Save className="w-4 h-4" /> Save Card Details</>}
                                </button>
                                {cardSaved && <span className="text-xs text-green-400">✓ Saved to device</span>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── JazzCash Form ── */}
                        {method.id === 'jazzcash' && isSelected && method.details && (
                          <div className="bg-white rounded-lg p-4 space-y-4 border border-[#D4AF37]/35 shadow-[0_14px_30px_-20px_rgba(7,10,15,0.45)]" onClick={(e) => e.stopPropagation()}>
                            <div>
                              <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Send Payment To:</p>
                              <p className="text-2xl font-bold text-[#D4AF37] mb-1">{method.details.number}</p>
                              <p className="text-sm text-[#4B5563] mb-4">Account Title: {method.details.name}</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                              <p className="text-sm font-semibold text-[#D4AF37]">Your JazzCash Details:</p>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Your JazzCash Number *</label>
                                <input
                                  type="text"
                                  placeholder="03XX-XXXXXXX"
                                  value={jazzCashNumber}
                                  maxLength={11}
                                  onChange={(e) => { setJazzCashNumber(e.target.value); setJazzCashSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-[#6B7280] mt-1">The number you are sending from</p>
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

                              <div className="pt-2 border-t border-[#E5E7EB]">
                                <label className="block text-sm font-semibold mb-2">Transaction ID *</label>
                                <input
                                  type="text"
                                  placeholder="Enter JazzCash transaction ID"
                                  value={jazzCashTransactionId}
                                  onChange={(e) => setJazzCashTransactionId(e.target.value)}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-[#6B7280] mt-1">Transaction ID received after sending payment</p>
                              </div>
                            </div>

                            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                              <p className="text-xs text-yellow-300">Send payment to JazzCash first, then enter sender number and transaction ID.</p>
                            </div>
                          </div>
                        )}

                        {/* ── Cash on Delivery Form ── */}
                        {method.id === 'cod' && isSelected && (
                          <div className="bg-white rounded-lg p-4 space-y-4 border border-[#D4AF37]/35 shadow-[0_14px_30px_-20px_rgba(7,10,15,0.45)]" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
                              <p className="text-sm text-blue-700">Pay in cash when your order is delivered to your door</p>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter your full name"
                                  value={codName}
                                  onChange={(e) => { setCodName(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
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
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                                <textarea
                                  placeholder="House/Flat #, Street, Area"
                                  value={codAddress}
                                  rows={3}
                                  onChange={(e) => { setCodAddress(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold mb-2">City *</label>
                                <select
                                  value={codCity}
                                  onChange={(e) => { setCodCity(e.target.value); setCodSaved(false); }}
                                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] focus:border-[#D4AF37] focus:outline-none transition-colors"
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

              {/* Delivery details are required for every payment method */}
              <div className="bg-gradient-to-r from-[#1A2435] to-[#0F1825] rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Delivery Details</h3>
                <p className="text-sm text-gray-400 mb-4">Used for shipping regardless of payment method.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={codName}
                      onChange={(e) => { setCodName(e.target.value); setCodSaved(false); }}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="text"
                      placeholder="03XXXXXXXXX"
                      value={codPhone}
                      maxLength={11}
                      onChange={(e) => { setCodPhone(e.target.value); setCodSaved(false); }}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                    <textarea
                      placeholder="House/Flat #, Street, Area"
                      value={codAddress}
                      rows={3}
                      onChange={(e) => { setCodAddress(e.target.value); setCodSaved(false); }}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <select
                      value={codCity}
                      onChange={(e) => { setCodCity(e.target.value); setCodSaved(false); }}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] focus:border-[#D4AF37] focus:outline-none transition-colors"
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
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleSaveCod}
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
                    <span className="font-semibold text-[#D4AF37]">
                      {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Free delivery on orders above PKR 4,000</p>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">PKR {orderTotal.toLocaleString()}</span>
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
                  disabled={items.length === 0 || isPlacingOrder || status !== 'authenticated'}
                  className="w-full bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (selectedMethod === 'card' ? 'Processing Payment...' : 'Placing Order...') : (selectedMethod === 'card' ? 'Pay Now' : 'Place Order')}
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
