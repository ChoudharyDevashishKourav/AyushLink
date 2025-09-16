// src/components/LogoutButton.tsx
import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('JWTS_TOKEN');
    
    // Force app to re-render by reloading
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className=" top-5 right-5 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      title="Logout"
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16 17V14H9V10H16V7L21 12L16 17ZM14 2C14.55 2 15 2.45 15 3S14.55 4 14 4H5V20H14C14.55 20 15 20.45 15 21S14.55 22 14 22H5C3.9 22 3 21.1 3 20V4C3 2.9 3.9 2 5 2H14Z"/>
      </svg>
    </button>
  );
};

export default LogoutButton;
