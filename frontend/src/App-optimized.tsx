import React, { useState, useEffect, useMemo, useCallback } from 'react'
import './App.css'
import { Home, Package, Sparkles, LogOut, Menu, X, Leaf, Plus, Search, Trash2 } from 'lucide-react'

type View = 'home' | 'register' | 'dashboard' | 'items' | 'ai' | 'sustainability'
type Item = {
  id: string
  name: string
  category?: string
  storage_condition?: string
  opened?: boolean
  status?: string
  predicted_expiry?: string
  purchase_date?: string
}

const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || 'http://127.0.0.1:8000'

// ============================================
// SEPARATE COMPONENTS (Outside main App)
// ============================================

// Home Page Component
const HomePage = React.memo<{ 
  onNavigate: (view: View) => void
  onGuestLogin: () => void 
}>(({ onNavigate, onGuestLogin }) => (
  <div className="home-container">
    <nav className="home-nav">
      <div className="home-logo">
        <Leaf size={32} />
        <span>FoodSaver AI</span>
      </div>
      <div className="home-nav-buttons">
        <button className="btn-white" onClick={() => onNavigate('register')}>
          Get Started
        </button>
      </div>
    </nav>

    <div className="home-hero">
      <div className="home-content">
        <h1 className="home-title">
          Reduce Food Waste,<br />Save Money & Planet
        </h1>
        <p className="home-subtitle">
          Smart AI-powered food management system that helps you track inventory,
          reduce waste, and make sustainable choices for a better tomorrow.
        </p>

        <div className="home-features">
          <div className="home-feature">
            <div className="home-feature-icon">🤖</div>
            <div className="home-feature-title">AI Suggestions</div>
            <div className="home-feature-desc">Get creative recipe ideas for any food item</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">📊</div>
            <div className="home-feature-title">Smart Tracking</div>
            <div className="home-feature-desc">Automatic expiry tracking and alerts</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">🌱</div>
            <div className="home-feature-title">Sustainability</div>
            <div className="home-feature-desc">Track your environmental impact</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">💰</div>
            <div className="home-feature-title">Save Money</div>
            <div className="home-feature-desc">Reduce waste and grocery bills</div>
          </div>
        </div>

        <div className="home-cta">
          <button className="btn-large btn-primary-large" onClick={() => onNavigate('register')}>
            Start Free Today
          </button>
          <button className="btn-large btn-secondary-large" onClick={onGuestLogin}>
            Try as Guest
          </button>
        </div>
      </div>
    </div>
  </div>
))


// Register Page Component
const RegisterPage = React.memo<{
  username: string
  password: string
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onGuestLogin: () => void
  loading: boolean
  error: string | null
  success: string | null
}>(({ username, password, onUsernameChange, onPasswordChange, onSubmit, onGuestLogin, loading, error, success }) => (
  <div className="auth-container">
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">
          <Leaf size={28} />
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start your journey to zero food waste</p>
      </div>

      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} autoComplete="off">
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            name="reg-username"
            type="text"
            className="form-input"
            placeholder="Choose a username"
            value={username}
            onChange={onUsernameChange}
            autoComplete="off"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            name="reg-password"
            type="password"
            className="form-input"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={onPasswordChange}
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="auth-divider">or</div>

        <button type="button" className="btn-guest" onClick={onGuestLogin}>
          Continue as Guest
        </button>

        <div className="auth-footer">
          Already have an account?{' '}
          <span className="auth-link" onClick={onGuestLogin}>
            Continue as Guest
          </span>
        </div>
      </form>
    </div>
  </div>
))


// Dashboard Stats Component
const DashboardStats = React.memo<{ stats: { total: number; fresh: number; expiring: number; expired: number } }>(
  ({ stats }) => (
    <div className="stats-grid">
      <div className="stat-card total">
        <div className="stat-header">
          <div className="stat-icon">📦</div>
        </div>
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total Items</div>
      </div>

      <div className="stat-card fresh">
        <div className="stat-header">
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-value">{stats.fresh}</div>
        <div className="stat-label">Fresh Items</div>
      </div>

      <div className="stat-card expiring">
        <div className="stat-header">
          <div className="stat-icon">⚠️</div>
        </div>
        <div className="stat-value">{stats.expiring}</div>
        <div className="stat-label">Expiring Soon</div>
      </div>

      <div className="stat-card expired">
        <div className="stat-header">
          <div className="stat-icon">❌</div>
        </div>
        <div className="stat-value">{stats.expired}</div>
        <div className="stat-label">Expired</div>
      </div>
    </div>
  )
)

// Add Item Form Component
const AddItemForm = React.memo<{
  name: string
  category: string
  storage: string
  date: string
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStorageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  creating: boolean
}>(({ name, category, storage, date, onNameChange, onCategoryChange, onStorageChange, onDateChange, onSubmit, creating }) => (
  <div className="card">
    <h2 className="card-title">
      <Plus size={20} />
      Add New Item
    </h2>
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label>Item Name *</label>
        <input
          className="form-input"
          value={name}
          onChange={onNameChange}
          placeholder="e.g., Apple, Milk, Bread"
          required
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <input
          className="form-input"
          value={category}
          onChange={onCategoryChange}
          placeholder="e.g., Fruit, Dairy"
        />
      </div>
      <div className="form-group">
        <label>Storage</label>
        <select
          className="form-input"
          value={storage}
          onChange={onStorageChange}
        >
          <option value="fridge">🧊 Fridge</option>
          <option value="pantry">🏺 Pantry</option>
          <option value="freezer">❄️ Freezer</option>
        </select>
      </div>
      <div className="form-group">
        <label>Purchase Date</label>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={onDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <button type="submit" className="btn btn-success" disabled={creating}>
        {creating ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  </div>
))


// Main App Component
export function App() {
  // State
  const [currentView, setCurrentView] = useState<View>('home')
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [authForm, setAuthForm] = useState({ username: '', password: '' })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    category: '',
    storage_condition: 'fridge',
    opened: false,
    purchase_date: ''
  })
  const [creating, setCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [aiSuggestions, setAiSuggestions] = useState<{ [itemId: string]: string }>({})
  const [loadingAiSuggestion, setLoadingAiSuggestion] = useState<string | null>(null)

  // Memoized handlers
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthForm(prev => ({ ...prev, username: e.target.value }))
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthForm(prev => ({ ...prev, password: e.target.value }))
  }, [])

  const handleItemNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, name: e.target.value }))
  }, [])

  const handleItemCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, category: e.target.value }))
  }, [])

  const handleItemStorageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, storage_condition: e.target.value }))
  }, [])

  const handleItemDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, purchase_date: e.target.value }))
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value)
  }, [])

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view)
  }, [])

  const handleGuestLogin = useCallback(() => {
    setUser({ id: 'demo-user', username: 'Guest' })
    setCurrentView('dashboard')
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    setItems([])
    setCurrentView('home')
    setAuthForm({ username: '', password: '' })
  }, [])

  // Fetch items
  useEffect(() => {
    if (user?.id) {
      fetchItems()
    }
  }, [user])

  const fetchItems = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}/items`)
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (e) {
      console.error('Failed to fetch items:', e)
    } finally {
      setLoading(false)
    }
  }

  const addItem = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !form.name.trim()) return
    
    setCreating(true)
    try {
      const payload: any = {
        name: form.name.trim(),
        category: form.category || undefined,
        storage_condition: form.storage_condition,
        opened: form.opened,
      }
      if (form.purchase_date) payload.purchase_date = form.purchase_date

      const res = await fetch(`${API_BASE}/users/${user.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (res.ok) {
        setForm({ name: '', category: '', storage_condition: 'fridge', opened: false, purchase_date: '' })
        await fetchItems()
      } else {
        alert('Failed to add item. Please try again.')
      }
    } catch (e) {
      console.error('Failed to add item:', e)
      alert('Failed to add item. Please check your connection.')
    } finally {
      setCreating(false)
    }
  }, [user, form])

  const deleteItem = useCallback(async (itemId: string) => {
    if (!user?.id || !confirm('Delete this item?')) return
    
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}/items/${itemId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await fetchItems()
      }
    } catch (e) {
      console.error('Failed to delete item:', e)
    }
  }, [user])

  const getAiSuggestion = useCallback(async (item: Item) => {
    if (!item.id) return
    
    setLoadingAiSuggestion(item.id)
    try {
      const res = await fetch(`${API_BASE}/ai-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: item.name,
          category: item.category || 'Food',
          status: item.status || 'Fresh',
          storage_condition: item.storage_condition || 'fridge'
        }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setAiSuggestions(prev => ({ ...prev, [item.id]: data.suggestion }))
      }
    } catch (e) {
      console.error('Failed to get AI suggestion:', e)
    } finally {
      setLoadingAiSuggestion(null)
    }
  }, [])

  const handleRegister = useCallback(async () => {
    setAuthError(null)
    setAuthSuccess(null)
    
    if (!authForm.username.trim() || !authForm.password.trim()) {
      setAuthError('Please enter both username and password')
      return
    }
    
    if (authForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters')
      return
    }
    
    setAuthLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Registration failed')
      }
      
      const data = await res.json()
      setUser({ id: data.user_id, username: data.username })
      setAuthSuccess('Account created successfully!')
      setAuthForm({ username: '', password: '' })
      
      setTimeout(() => {
        setCurrentView('dashboard')
      }, 500)
    } catch (e: any) {
      setAuthError(e.message || 'Registration failed')
    } finally {
      setAuthLoading(false)
    }
  }, [authForm])

  const stats = useMemo(() => {
    const total = items.length
    const fresh = items.filter(i => i.status?.toLowerCase() === 'fresh').length
    const expiring = items.filter(i => i.status?.toLowerCase() === 'expiring soon').length
    const expired = items.filter(i => i.status?.toLowerCase() === 'expired').length
    return { total, fresh, expiring, expired }
  }, [items])

  const filteredItems = useMemo(() => {
    let result = items
    
    if (filterStatus !== 'all') {
      result = result.filter(item => item.status?.toLowerCase() === filterStatus.toLowerCase())
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category?.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [items, filterStatus, searchQuery])

  // Render based on view
  if (currentView === 'home') {
    return <HomePage onNavigate={handleNavigate} onGuestLogin={handleGuestLogin} />
  }

  if (currentView === 'register') {
    return (
      <RegisterPage
        username={authForm.username}
        password={authForm.password}
        onUsernameChange={handleUsernameChange}
        onPasswordChange={handlePasswordChange}
        onSubmit={handleRegister}
        onGuestLogin={handleGuestLogin}
        loading={authLoading}
        error={authError}
        success={authSuccess}
      />
    )
  }

  if (user) {
    return (
      <div className="app-layout">
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <Leaf size={28} />
              <span>FoodSaver AI</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${currentView === 'items' ? 'active' : ''}`}
              onClick={() => setCurrentView('items')}
            >
              <Package size={20} />
              <span>My Items</span>
            </button>
            <button
              className={`nav-item ${currentView === 'ai' ? 'active' : ''}`}
              onClick={() => setCurrentView('ai')}
            >
              <Sparkles size={20} />
              <span>AI Suggestions</span>
            </button>
            <button
              className={`nav-item ${currentView === 'sustainability' ? 'active' : ''}`}
              onClick={() => setCurrentView('sustainability')}
            >
              <Leaf size={20} />
              <span>Sustainability</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="nav-item" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <div className="top-bar">
            <div className="top-bar-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="page-title">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'items' && 'My Items'}
                {currentView === 'ai' && 'AI Suggestions'}
                {currentView === 'sustainability' && 'Sustainability'}
              </h1>
            </div>
            <div className="user-info">
              <div className="user-avatar">
                {user?.username.charAt(0).toUpperCase() || 'G'}
              </div>
            </div>
          </div>

          <div className="content-area">
            {currentView === 'dashboard' && (
              <>
                <DashboardStats stats={stats} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="card">
                    <h2 className="card-title">
                      <Package size={20} />
                      Recent Items
                    </h2>
                    {loading ? (
                      <div className="empty-state">Loading...</div>
                    ) : items.length === 0 ? (
                      <div className="empty-state">
                        <Package size={64} />
                        <p>No items yet. Add your first food item!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.slice(0, 5).map(item => (
                          <div key={item.id} style={{ 
                            padding: '0.75rem', 
                            background: 'var(--bg-secondary)', 
                            borderRadius: 'var(--radius)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{item.name}</div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {item.category || 'Uncategorized'}
                              </div>
                            </div>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: item.status?.toLowerCase() === 'fresh' ? 'var(--primary-light)' :
                                         item.status?.toLowerCase() === 'expiring soon' ? '#fef3c7' :
                                         '#fee2e2',
                              color: item.status?.toLowerCase() === 'fresh' ? 'var(--primary)' :
                                     item.status?.toLowerCase() === 'expiring soon' ? '#f59e0b' :
                                     '#dc2626'
                            }}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <AddItemForm
                    name={form.name}
                    category={form.category}
                    storage={form.storage_condition}
                    date={form.purchase_date}
                    onNameChange={handleItemNameChange}
                    onCategoryChange={handleItemCategoryChange}
                    onStorageChange={handleItemStorageChange}
                    onDateChange={handleItemDateChange}
                    onSubmit={addItem}
                    creating={creating}
                  />
                </div>
              </>
            )}

            {currentView === 'items' && (
              <>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{ paddingLeft: '3rem' }}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={filterStatus}
                    onChange={handleFilterChange}
                    style={{ width: '200px' }}
                  >
                    <option value="all">All Status</option>
                    <option value="fresh">Fresh</option>
                    <option value="expiring soon">Expiring Soon</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {filteredItems.map(item => (
                    <div key={item.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{item.name}</h3>
                        <button
                          onClick={() => deleteItem(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div><strong>Category:</strong> {item.category || 'N/A'}</div>
                        <div><strong>Storage:</strong> {item.storage_condition || 'N/A'}</div>
                        <div><strong>Expiry:</strong> {item.predicted_expiry || 'N/A'}</div>
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: item.status?.toLowerCase() === 'fresh' ? 'var(--primary-light)' :
                                     item.status?.toLowerCase() === 'expiring soon' ? '#fef3c7' :
                                     '#fee2e2',
                          color: item.status?.toLowerCase() === 'fresh' ? 'var(--primary)' :
                                 item.status?.toLowerCase() === 'expiring soon' ? '#f59e0b' :
                                 '#dc2626'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="empty-state">
                    <Package size={64} />
                    <p>No items found</p>
                  </div>
                )}
              </>
            )}

            {currentView === 'ai' && (
              <>
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h2 className="card-title">
                    <Sparkles size={20} />
                    AI-Powered Suggestions
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Get creative recipe ideas and preservation tips for your food items
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {items.map(item => (
                    <div key={item.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{item.name}</h3>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {item.category} • {item.status}
                          </p>
                        </div>
                        {!aiSuggestions[item.id] && (
                          <button
                            className="btn btn-success"
                            onClick={() => getAiSuggestion(item)}
                            disabled={loadingAiSuggestion === item.id}
                          >
                            {loadingAiSuggestion === item.id ? '⏳ Loading...' : '💡 Get Ideas'}
                          </button>
                        )}
                      </div>
                      {aiSuggestions[item.id] && (
                        <div style={{
                          padding: '1rem',
                          background: 'var(--primary-light)',
                          borderRadius: 'var(--radius)',
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.875rem',
                          lineHeight: 1.6
                        }}>
                          {aiSuggestions[item.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {items.length === 0 && (
                  <div className="empty-state">
                    <Sparkles size={64} />
                    <p>No items yet. Add some items to get AI suggestions!</p>
                  </div>
                )}
              </>
            )}

            {currentView === 'sustainability' && (
              <div className="card">
                <h2 className="card-title">
                  <Leaf size={20} />
                  Sustainability Metrics
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Track your environmental impact and waste reduction
                </p>
                <div className="empty-state">
                  <Leaf size={64} />
                  <p>Sustainability features coming soon!</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  return <HomePage onNavigate={handleNavigate} onGuestLogin={handleGuestLogin} />
}
