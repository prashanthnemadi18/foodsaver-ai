import { useState, useEffect, useCallback, memo } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

type View = 'home' | 'register' | 'dashboard';
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

// Animated Background Component
const AnimatedBackground = memo(() => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="animated-bg absolute inset-0 opacity-20"></div>
    <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
  </div>
));

// Header Component
const Header = memo(({ currentView, onNavigate, username }: { currentView: View; onNavigate: (view: View) => void; username: string }) => (
  <header className="glass-dark backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 animate-slide-down">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 bg-gradient-agriculture rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">FoodSaver AI</h1>
        </div>
        
        {currentView === 'dashboard' && (
          <div className="flex items-center space-x-4">
            <div className="glass px-4 py-2 rounded-full flex items-center space-x-2">
              <span className="text-2xl">👤</span>
              <span className="text-white font-medium">{username}</span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="glass hover:bg-red-500/20 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
));

// Home Page Component
const HomePage = memo(({ onNavigate }: { onNavigate: (view: View) => void }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-4xl w-full text-center animate-fade-in">
      <div className="mb-8 animate-float">
        <span className="text-9xl">🌾</span>
      </div>
      
      <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text animate-slide-up">
        FoodSaver AI
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-700 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        Smart Food Management with AI-Powered Suggestions
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: '🤖', title: 'AI Suggestions', desc: 'Smart recipe ideas' },
          { icon: '📊', title: 'Analytics', desc: 'Track your waste' },
          { icon: '🌱', title: 'Sustainability', desc: 'Save the planet' }
        ].map((feature, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl card-hover animate-scale-in" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <button
          onClick={() => onNavigate('register')}
          className="btn-ripple bg-gradient-agriculture text-white px-8 py-4 rounded-full text-lg font-bold shadow-modern-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Get Started 🚀
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className="glass px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
));

// Register Page Component
const RegisterPage = memo(({ onRegister, onNavigate }: { onRegister: (username: string, password: string) => void; onNavigate: (view: View) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onRegister(username, password);
    }
  }, [username, password, onRegister]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-scale-in">
        <div className="glass p-8 rounded-3xl shadow-modern-lg">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-agriculture rounded-2xl mb-4 animate-pulse-slow">
              <span className="text-5xl">🌱</span>
            </div>
            <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
            <p className="text-gray-600 mt-2">Join FoodSaver AI today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-ripple bg-gradient-agriculture text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Register 🚀
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Dashboard Component
const Dashboard = memo(({ username, userId }: { username: string; userId: string }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', storage: 'fridge' as StorageType, date: '' });
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Items', value: stats.total, icon: '📦', color: 'from-blue-500 to-cyan-500' },
          { label: 'Fresh', value: stats.fresh, icon: '✨', color: 'from-green-500 to-emerald-500' },
          { label: 'Expiring Soon', value: stats.expiring, icon: '⚡', color: 'from-orange-500 to-yellow-500' },
          { label: 'Expired', value: stats.expired, icon: '⚠️', color: 'from-red-500 to-pink-500' }
        ].map((stat, idx) => (
          <div key={idx} className={`glass p-6 rounded-2xl card-hover animate-slide-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-4xl font-bold mt-2 gradient-text">{stat.value}</p>
              </div>
              <div className={`text-5xl bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Form */}
      <div className="glass p-8 rounded-3xl shadow-modern-lg mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
          <span className="text-3xl mr-3">➕</span>
          Add New Item
        </h2>
        
        <form onSubmit={addItem} className="grid md:grid-cols-5 gap-4">
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Item name (e.g., Apple)"
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all"
            required
          />
          
          <input
            type="text"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            placeholder="Category (e.g., Fruit)"
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all"
          />
          
          <select
            value={newItem.storage}
            onChange={(e) => setNewItem({ ...newItem, storage: e.target.value as StorageType })}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all"
          >
            <option value="fridge">🧊 Fridge</option>
            <option value="freezer">❄️ Freezer</option>
            <option value="pantry">🏺 Pantry</option>
          </select>
          
          <input
            type="date"
            value={newItem.date}
            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="btn-ripple bg-gradient-agriculture text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? '⏳' : '➕ Add'}
          </button>
        </form>
      </div>

      {/* Items Grid */}
      <div className="grid-responsive">
        {items.map((item, idx) => (
          <div key={item.id} className="glass p-6 rounded-2xl card-hover animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category || 'Uncategorized'}</p>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-500 hover:text-red-700 text-2xl transform hover:scale-125 transition-all"
              >
                🗑️
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📅</span>
                <span>Purchased: {item.purchase_date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">⏰</span>
                <span>Expires: {item.predicted_expiry}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">
                  {item.storage_condition === 'fridge' ? '🧊' : item.storage_condition === 'freezer' ? '❄️' : '🏺'}
                </span>
                <span className="capitalize">{item.storage_condition}</span>
              </div>
            </div>

            <div className={`status-${item.status.replace(' ', '-')} px-4 py-2 rounded-xl text-center font-bold mb-4`}>
              {item.status === 'fresh' ? '✨ Fresh' : item.status === 'expiring soon' ? '⚡ Expiring Soon' : '⚠️ Expired'}
            </div>

            <button
              onClick={() => getAISuggestion(item)}
              className="w-full glass hover:bg-green-500/20 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              🤖 Get AI Suggestions
            </button>
          </div>
        ))}
      </div>

      {/* AI Suggestion Modal */}
      {aiSuggestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setAiSuggestion('')}>
          <div className="glass-dark max-w-2xl w-full p-8 rounded-3xl shadow-modern-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">🤖</span>
                AI Suggestions
              </h3>
              <button onClick={() => setAiSuggestion('')} className="text-white text-3xl hover:scale-125 transition-transform">
                ✕
              </button>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl">
              <p className="text-white whitespace-pre-line text-lg leading-relaxed">{aiSuggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-8xl mb-6 animate-float">🌾</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No items yet!</h3>
          <p className="text-gray-600">Add your first food item to get started</p>
        </div>
      )}
    </div>
  );
});

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [username, setUsername] = useState('Guest');
  const [userId, setUserId] = useState('guest-' + Date.now());

  const handleRegister = useCallback(async (user: string, pass: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setUserId(data.userId);
        setCurrentView('dashboard');
      } else {
        alert('Registration failed. Username might already exist.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }, []);

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
    if (view === 'dashboard' && userId.startsWith('guest-')) {
      setUsername('Guest');
      setUserId('guest-' + Date.now());
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <AnimatedBackground />
      <Header currentView={currentView} onNavigate={handleNavigate} username={username} />
      
      <main>
        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentView === 'register' && <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />}
        {currentView === 'dashboard' && <Dashboard username={username} userId={userId} />}
      </main>
    </div>
  );
}

export default App;
