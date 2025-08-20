import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PublicDashboard from './components/PublicDashboard';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { authService } from './lib/supabase';

type AppState = 'public' | 'login' | 'admin';

function App() {
  const [appState, setAppState] = useState<AppState>('public');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAppState('admin');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        setAppState('admin');
      } else {
        setAppState('public');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminClick = () => {
    setAppState('login');
  };

  const handleLogin = () => {
    setAppState('admin');
  };

  const handleLogout = () => {
    setAppState('public');
    setUser(null);
  };

  const handleBackToPublic = () => {
    setAppState('public');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading festival dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        {appState === 'public' && (
          <PublicDashboard onAdminClick={handleAdminClick} />
        )}
        
        {appState === 'login' && (
          <AdminLogin onLogin={handleLogin} />
        )}
        
        {appState === 'admin' && user && (
          <AdminPanel onLogout={handleLogout} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;