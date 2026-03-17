import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Leaf, 
  Clock, 
  AlertTriangle,
  ChefHat,
  Trash2,
  User,
  LogOut,
  TrendingUp,
  Award,
  Calendar,
  Home,
  Sparkles,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { AnimatedButton, AnimatedCard, AnimatedModal, StatCard, PageTransition, AIBadge, GlassSection, AIPulse } from '../components/AnimatedComponents';
import { AIBrainIcon } from '../components/AIIcons';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8000';

type StorageType = 'fridge' | 'freezer' | 'pantry';

interface Item {
  id: string;
  name: string;
  category: string | null;
  storage_condition: StorageType;
  purchase_date: string;
  predicted_expiry: string;
  status: 'fresh' | 'expiring soon' | 'expired';
  daysUntilExpiry?: number;
}

const Dashboard = ({ username, userId, onLogout }: { username: string; userId: string; onLogout: () => void }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    category: '', 
    storage: 'fridge' as StorageType, 
    date: '' 
  });
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/items`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category || null,
          storage_condition: newItem.storage,
          purchase_date: newItem.date || new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        setNewItem({ name: '', category: '', storage: 'fridge', date: '' });
        setIsAddModalOpen(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  }, [newItem, userId, fetchItems]);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/items/${itemId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [userId, fetchItems]);

  const getAISuggestion = useCallback(async (item: Item) => {
    try {
      const response = await fetch(`${API_BASE}/ai-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: item.name,
          category: item.category || 'Food',
          status: item.status,
          storage_condition: item.storage_condition
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    }
  }, []);

  const stats = {
    total: items.length,
    fresh: items.filter(i => i.status === 'fresh').length,
    expiring: items.filter(i => i.status === 'expiring soon').length,
    expired: items.filter(i => i.status === 'expired').length
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <Leaf className="w-5 h-5" />;
      case 'expiring soon': return <Clock className="w-5 h-5" />;
      case 'expired': return <AlertTriangle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'expiring soon': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'expired': return 'bg-gradient-to-r from-red-500 to-pink-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-100">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <motion.header 
          className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
                  <AIBrainIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    FoodSaver <span className="text-emerald-600">AI</span>
                  </h1>
                  <div className="flex items-center gap-2">
                    <AIPulse />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Online</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-slate-900 font-bold text-sm">{username}</span>
                </div>
                <AnimatedButton
                  onClick={onLogout}
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-500 hover:text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-bold">Disconnect</span>
                </AnimatedButton>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-[1600px] mx-auto px-6 py-10">
          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8">
              <GlassSection className="p-10 h-full flex flex-col justify-center">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <AIBadge>Real-time Intelligence</AIBadge>
                    <h2 className="text-5xl font-black mt-4 mb-2 tracking-tight">
                      Welcome back, <span className="text-emerald-600">{username}</span>
                    </h2>
                    <p className="text-slate-500 text-xl font-light">
                      Your AI assistant has analyzed your inventory. You have <span className="text-slate-900 font-bold">{stats.expiring} items</span> that need immediate attention.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Load</p>
                      <p className="text-2xl font-black">2.4ms</p>
                    </div>
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <Activity className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </GlassSection>
            </div>
            
            <div className="lg:col-span-4">
              <AnimatedCard className="h-full bg-slate-900 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Quick Actions</h3>
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <AnimatedButton
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg font-bold">Sync New Item</span>
                  </AnimatedButton>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Cpu className="w-5 h-5" />
                    <span className="text-sm font-medium">Neural Engine v4.2 Active</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Inventory', value: stats.total, icon: Package, color: 'slate' },
              { label: 'Optimal', value: stats.fresh, icon: Leaf, color: 'emerald' },
              { label: 'Attention', value: stats.expiring, icon: Clock, color: 'amber' },
              { label: 'Critical', value: stats.expired, icon: AlertTriangle, color: 'red' }
            ].map((stat, i) => (
              <AnimatedCard key={i} delay={i * 0.1} className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Inventory Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-3xl font-black tracking-tight">Inventory Neural-Map</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm font-bold text-slate-600"
              >
                <option value="all">All Clusters</option>
                <option value="fresh">Optimal Status</option>
                <option value="expiring soon">Attention Required</option>
                <option value="expired">Critical Status</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <AnimatedCard 
                  key={item.id} 
                  delay={index * 0.05}
                  className="group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${
                      item.status === 'fresh' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'expiring soon' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {getStatusIcon(item.status)}
                    </div>
                    <AIBadge>{item.storage_condition}</AIBadge>
                  </div>

                  <h4 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">{item.name}</h4>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">{item.category || 'Uncategorized'}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Predicted Expiry</span>
                      <span className="font-bold">{new Date(item.predicted_expiry).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, (item.daysUntilExpiry || 0) * 10))}%` }}
                        className={`h-full ${getStatusColor(item.status)}`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <AnimatedButton
                      onClick={() => getAISuggestion(item)}
                      variant="outline"
                      className="flex-1 py-3 border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span className="text-xs font-bold">AI Recipe</span>
                    </AnimatedButton>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </AnimatedCard>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="text-emerald-500 mb-6 flex justify-center"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sprout className="w-24 h-24" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No items found!</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first food item to get started with smart food management'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <AnimatedButton
                  onClick={() => setIsAddModalOpen(true)}
                  variant="primary"
                  className="text-lg px-8 py-4"
                >
                  Add Your First Item <Rocket className="w-5 h-5 ml-2" />
                </AnimatedButton>
              )}
            </motion.div>
          )}

          {/* AI Suggestion Panel */}
          <AnimatePresence>
            {aiSuggestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12"
              >
                <GlassSection className="p-8 border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 flex-shrink-0">
                      <ChefHat className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <AIBadge>Culinary AI Engine</AIBadge>
                        <button 
                          onClick={() => setAiSuggestion('')}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Plus className="w-6 h-6 rotate-45" />
                        </button>
                      </div>
                      <h4 className="text-2xl font-black mb-4 tracking-tight">AI Chef Recommendations</h4>
                      <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{aiSuggestion}</p>
                    </div>
                  </div>
                </GlassSection>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Add Item Modal */}
        <AnimatedModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Sync New Inventory Node"
        >
          <form onSubmit={addItem} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Node Name</label>
              <input
                type="text"
                placeholder="e.g. Organic Tomatoes"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cluster</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetables"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Storage Zone</label>
                <select
                  value={newItem.storage}
                  onChange={(e) => setNewItem({ ...newItem, storage: e.target.value as StorageType })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                >
                  <option value="fridge">Fridge Zone</option>
                  <option value="freezer">Freezer Zone</option>
                  <option value="pantry">Pantry Zone</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Purchase Timestamp</label>
              <input
                type="date"
                value={newItem.date}
                onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
              />
            </div>

            <AnimatedButton
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Cpu className="w-6 h-6" />
                  <span className="text-lg font-bold">Initialize Node Sync</span>
                </>
              )}
            </AnimatedButton>
          </form>
        </AnimatedModal>

        {/* AI Suggestion Modal */}
        <AnimatedModal
          isOpen={!!aiSuggestion}
          onClose={() => setAiSuggestion('')}
          title="AI Recipe Suggestions"
        >
          <div className="prose max-w-none">
            <div className="flex items-start gap-4 mb-6 p-4 bg-emerald-50 rounded-xl">
              <ChefHat className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-800 mb-2">Smart Recipe Ideas</h4>
                <p className="text-emerald-700 whitespace-pre-line">{aiSuggestion}</p>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              <p>💡 These suggestions help you reduce food waste and discover new recipes!</p>
            </div>
          </div>
        </AnimatedModal>
      </div>
    </PageTransition>
  );
};

export default Dashboard;