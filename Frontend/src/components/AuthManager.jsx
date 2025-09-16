import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import LogoutButton from './LogoutButton';

const AuthManager = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('JWTS_TOKEN');
    if (token) {
      setIsLoggedIn(true);
      // You can decode the token here to get user info if needed
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LogoutButton onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
                <p className="text-gray-600">You are successfully logged in to your account.</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Dashboard</h2>
                <p className="text-blue-700">Your main application content would go here...</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Profile</h3>
                  <p className="text-sm opacity-90">Manage your account settings</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm opacity-90">View your activity reports</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Settings</h3>
                  <p className="text-sm opacity-90">Configure your preferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentView === 'login' ? (
        <Login
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register
          onSwitchToLogin={handleSwitchToLogin}
          onRegisterSuccess={() => {
            console.log('Registration successful');
          }}
        />
      )}
    </div>
  );
};

export default AuthManager;
