import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Leaf, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { AIBrainIcon } from '../components/AIIcons';
import { AnimatedButton, AIBadge, GlassSection, PageTransition } from '../components/AnimatedComponents';

const LoginPage = ({ onLogin, onNavigate }: { onLogin: (username: string, password: string) => Promise<void>; onNavigate: (view: 'home' | 'register' | 'dashboard' | 'login') => void }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Identity signature required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Access key required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onLogin(formData.username, formData.password);
    } catch (error) {
      console.error('Authentication failure:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onLogin]);

  return ( 
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-[#fafafa] flex items-center justify-center p-6">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div 
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GlassSection className="p-12 shadow-2xl shadow-emerald-900/10">
            <div className="text-center mb-10">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-[2rem] shadow-xl mb-6"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 1, type: "spring" }}
              >
                <AIBrainIcon className="w-12 h-12 text-white" />
              </motion.div>
              <AIBadge>Secure Neural Access</AIBadge>
              <h2 className="text-4xl font-black mt-4 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Re-synchronize with your AI assistant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Signature</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs font-bold ml-1">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs font-bold ml-1">{errors.password}</p>}
              </div>

              <AnimatedButton
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 mt-10"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-lg font-bold">Authorize Access</span>
                  </>
                )}
              </AnimatedButton>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium mb-4">New to the network?</p>
              <button
                onClick={() => onNavigate('register')}
                className="text-emerald-600 font-black hover:text-emerald-700 transition-colors flex items-center justify-center gap-2 mx-auto group"
              >
                Initialize New Account
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </GlassSection>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;