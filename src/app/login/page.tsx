'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, MoreVertical, ArrowRight } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDotsMenu, setShowDotsMenu] = useState(false);
  const dotsMenuRef = useRef<HTMLDivElement>(null);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dotsMenuRef.current && !dotsMenuRef.current.contains(e.target as Node)) {
        setShowDotsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
      router.refresh();
    }
  }, [status, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Login failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error: any) {
      const message = error?.message || 'An error occurred. Please try again.';
      setError(message.includes('Invalid URL') ? 'Login configuration issue fixed. Please try again.' : message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';
      await signIn('google', { callbackUrl });
    } catch (error: any) {
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B101E] relative flex flex-col items-center justify-center overflow-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* --- Cinematic Background Effects --- */}
      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      {/* Massive Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#121A2F] blur-[120px] rounded-full pointer-events-none" />

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

        {/* Admin Dots Menu */}
        <div className="relative" ref={dotsMenuRef}>
          <button
            onClick={() => setShowDotsMenu(!showDotsMenu)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showDotsMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[#0B101E]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-5 py-4 text-white/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors group"
                >
                  <Lock size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Admin Access</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* --- Main Login Portal --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10 px-6 pt-20"
      >
        <div className="text-center mb-10">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
            Client Authentication
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-tight mb-2">
            Welcome <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">Back</span>
          </h1>
        </div>

        {/* The Glass Card */}
        <div className="bg-[#121A2F]/40 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
          
          {/* Subtle inner card gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Animated Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
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
          </AnimatePresence>

          <form onSubmit={handleSignIn} className="space-y-5 relative z-10">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-white/50 text-[10px] tracking-[0.2em] uppercase font-bold ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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

            {/* Utilities */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-[#D4AF37] transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute opacity-0 cursor-pointer"
                  />
                  {rememberMe && <div className="w-2 h-2 bg-[#D4AF37] rounded-sm" />}
                </div>
                <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link href="/forgot-password" className="text-[10px] tracking-[0.1em] text-white/50 hover:text-[#D4AF37] transition-colors uppercase font-bold">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative bg-[#D4AF37] text-[#0B101E] font-black py-4 rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[10px] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-white overflow-hidden mt-6"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#0B101E]/20 border-t-[#0B101E] rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-[9px] text-white/30 bg-[#151D2F] uppercase tracking-[0.3em] font-bold">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full relative z-10 border border-white/10 hover:border-white/30 bg-white/5 text-white py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.49 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Google
            </span>
          </button>
        </div>

        {/* Footer / Register Link */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-xs text-white/50">
            New to B&B?{' '}
            <Link href="/register" className="text-[#D4AF37] hover:text-white font-bold tracking-wide transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Floating Copyright */}
      <div className="absolute bottom-6 text-center w-full z-10 pointer-events-none">
        <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} B&B Luxury Footwear
        </p>
      </div>

    </div>
  );
}