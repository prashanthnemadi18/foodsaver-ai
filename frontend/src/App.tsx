import { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8000';

type View = 'home' | 'register' | 'login' | 'dashboard';

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

  const handleLogin = useCallback(async (user: string, pass: string) => {
    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, you would make an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsername(user);
      setUserId('user-' + Date.now());
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUsername('Guest');
    setUserId('guest-' + Date.now());
    setCurrentView('home');
  }, []);

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
    if (view === 'dashboard' && userId.startsWith('guest-')) {
      setUsername('Guest');
      setUserId('guest-' + Date.now());
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-center" toastOptions={{
        className: 'font-bold',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      }} />
      <main className="relative z-10">
        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentView === 'register' && <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />}
        {currentView === 'login' && <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />}
        {currentView === 'dashboard' && <Dashboard username={username} userId={userId} onLogout={handleLogout} />}
      </main>
    </div>
  );
}

export default App;
