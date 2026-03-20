'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Hash, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'password-reset' }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('We have sent a 6-digit verification code to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Password reset successfully! Redirecting to vault...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B101E] relative flex flex-col items-center justify-center overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* --- Cinematic Background Effects --- */}
      {/* Grid Texture */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      {/* Massive Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#121A2F] blur-[120px] rounded-full pointer-events-none" />

      {/* --- Floating Top Navigation --- */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <svg width="34" height="22" viewBox="0 0 52 36" fill="none" className="group-hover:scale-105 transition-transform duration-500">
            <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28 L48 26 L4 26 Z" fill="#D4AF37"/>
            <path d="M4 26 L4 16 Q4 10 10 8 L24 7 Q30 7 34 10 L48 26 Z" fill="#D4AF37"/>
            <path d="M12 18 C16 15 22 15 26 17" stroke="#0B101E" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-white text-lg font-bold tracking-widest leading-none group-hover:text-[#D4AF37] transition-colors">B&B SHOES</span>
            <span className="text-[#D4AF37]/50 text-[8px] tracking-[0.3em] uppercase mt-1 font-bold">The Vault</span>
          </div>
        </Link>
      </nav>

      {/* --- Main Recovery Portal --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10 px-6 pt-20"
      >
        <div className="text-center mb-10">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
            {step === 1 ? 'Account Recovery' : 'Security Protocol'}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-tight mb-2">
            {step === 1 ? (
              <>Reset <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">Access</span></>
            ) : (
              <>New <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">Key</span></>
            )}
          </h1>
          <p className="text-white/40 text-xs mt-4 px-4 leading-relaxed">
            {step === 1 
              ? "Provide your registered email address and we will dispatch a secure recovery code." 
              : `Enter the authorization code dispatched to ${email}.`}
          </p>
        </div>

        {/* The Glass Card */}
        <div className="bg-[#121A2F]/40 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Animated Error/Success Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                  <p className="text-red-400 text-xs tracking-wide text-center">{error}</p>
                </div>
              </motion.div>
            )}
            {message && (
              <motion.div 
                key="message"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center">
                  <p className="text-[#D4AF37] text-xs tracking-wide text-center font-bold">{message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10">
            {/* STEP 1 FORM */}
            {step === 1 && (
              <motion.form 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold ml-1">
                    Identity (Email)
                  </label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@luxury.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative bg-[#D4AF37] text-[#0B101E] font-black py-4 rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[10px] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-white overflow-hidden mt-4"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#0B101E]/20 border-t-[#0B101E] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Dispatch Code</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </motion.form>
            )}

            {/* STEP 2 FORM */}
            {step === 2 && (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleResetPassword} 
                className="space-y-5"
              >
                {/* OTP Field */}
                <div className="space-y-2">
                  <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold ml-1">
                    Verification Code
                  </label>
                  <div className="relative group">
                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all duration-300 tracking-[0.5em] font-mono"
                      required
                    />
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold ml-1">
                    New Security Key
                  </label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={8}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all duration-300"
                      required
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || message.includes('success')}
                    className="w-full group relative bg-[#D4AF37] text-[#0B101E] font-black py-4 rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[10px] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-white overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-[#0B101E]/20 border-t-[#0B101E] rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Confirm Update</span>
                          <Lock size={14} className="group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                      setMessage('');
                    }}
                    className="text-[10px] tracking-[0.1em] text-white/50 hover:text-[#D4AF37] transition-colors uppercase font-bold flex items-center justify-center gap-2 mx-auto"
                  >
                    <ArrowLeft size={12} />
                    Change Email Address
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>

        {/* Footer / Login Link */}
        <div className="mt-8 text-center relative z-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white font-bold tracking-wide transition-colors text-xs">
            <ArrowLeft size={14} />
            Return to Vault Login
          </Link>
        </div>
      </motion.div>

      {/* Floating Copyright */}
      <div className="absolute bottom-6 text-center w-full z-10 pointer-events-none hidden md:block">
        <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} B&B Luxury Footwear
        </p>
      </div>

    </div>
  );
}