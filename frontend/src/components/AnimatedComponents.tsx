import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Rocket, Bell, BarChart3, TrendingUp, Package, Leaf, Clock, AlertTriangle, ChefHat, Trash2, User, LogOut, Search, Filter, Plus, Home, Calendar } from 'lucide-react';
import { AIBrainIcon, FoodPreservationIcon, AnalyticsIcon, SustainabilityIcon, SmartStorageIcon, RecipeSuggestionIcon } from './AIIcons';

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animated Button Component
export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false,
  ...props 
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500",
    secondary: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500",
    outline: "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 focus:ring-emerald-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Animated Card Component
export const AnimatedCard = ({ 
  children, 
  className = '',
  delay = 0,
  ...props 
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  [key: string]: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      className={`bg-white/40 backdrop-blur-xl rounded-3xl shadow-modern border border-white/30 p-8 hover:shadow-modern-lg transition-all duration-300 group ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// AI Processing Pulse Component
export const AIPulse = () => (
  <div className="relative flex items-center justify-center w-4 h-4">
    <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75"></div>
    <div className="relative w-2 h-2 bg-emerald-600 rounded-full"></div>
  </div>
);

// Floating AI Badge
export const AIBadge = ({ children }: { children: ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider">
    <AIPulse />
    {children}
  </div>
);

// Glass Section
export const GlassSection = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden bg-white/30 backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-modern ${className}`}>
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-float" />
    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Animated Modal Component
export const AnimatedModal = ({ 
  isOpen, 
  onClose, 
  children,
  title
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Animated Input Component
export const AnimatedInput = ({ 
  label,
  error,
  className = '',
  ...props
}: {
  label?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </motion.label>
      )}
      <motion.input
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
          error 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-gray-200 focus:border-emerald-500'
        }`}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Animated Stat Card
export const StatCard = ({ 
  title, 
  value, 
  icon,
  color = 'emerald',
  delay = 0
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  delay?: number;
}) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-pink-500'
  };

  // Map titles to appropriate icons if no icon is provided
  const getIconByTitle = (title: string) => {
    if (icon) return icon;
    
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total') || lowerTitle.includes('item')) return <Package className="w-6 h-6" />;
    if (lowerTitle.includes('fresh')) return <Leaf className="w-6 h-6" />;
    if (lowerTitle.includes('expiring') || lowerTitle.includes('soon')) return <Clock className="w-6 h-6" />;
    if (lowerTitle.includes('expired')) return <AlertTriangle className="w-6 h-6" />;
    if (lowerTitle.includes('saved') || lowerTitle.includes('waste')) return <FoodPreservationIcon className="w-6 h-6" />;
    if (lowerTitle.includes('alert') || lowerTitle.includes('notification')) return <Bell className="w-6 h-6" />;
    if (lowerTitle.includes('analytics') || lowerTitle.includes('trend')) return <AnalyticsIcon className="w-6 h-6" />;
    if (lowerTitle.includes('impact') || lowerTitle.includes('eco')) return <SustainabilityIcon className="w-6 h-6" />;
    if (lowerTitle.includes('ai') || lowerTitle.includes('predict') || lowerTitle.includes('smart')) return <AIBrainIcon className="w-6 h-6" />;
    if (lowerTitle.includes('recipe') || lowerTitle.includes('suggest')) return <RecipeSuggestionIcon className="w-6 h-6" />;
    if (lowerTitle.includes('storage') || lowerTitle.includes('fridge') || lowerTitle.includes('freezer')) return <SmartStorageIcon className="w-6 h-6" />;
    
    // Default icon
    return <Package className="w-6 h-6" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-3xl font-bold text-gray-800 mt-2"
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white shadow-lg`}
        >
          {getIconByTitle(title)}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Animated Page Transition
export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);