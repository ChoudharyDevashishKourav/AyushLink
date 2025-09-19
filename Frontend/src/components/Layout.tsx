import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, FileText, Info, Activity, LogOut, LogOutIcon, Mic, Mic2 } from 'lucide-react';
import LogoutButton from './LogoutButton'
import logo from "../assets/LOGO.png"
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('JWTS_TOKEN');
    
    // Force app to re-render by reloading
    window.location.reload();
  };
  const location = useLocation();

  const navigation = [
    {
      name: 'Search',
      href: '/',
      icon: Search,
      description: 'Search medical terminology'
    },
    {
      name: 'Conditions',
      href: '/conditions',
      icon: FileText,
      description: 'View saved conditions'
    },
    {
      name: 'Speak',
      href: '/speak',
      icon: Mic,
      description: 'Generate EHR with AI',
      
    },
    {
      name: 'About',
      href: '/about',
      icon: Info,
      description: 'System information'
    }
    
    
  
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <img 
            src={logo} 
            alt="App Logo" 
            className="h-20 w-20 mx-auto" // adjust size as needed
          />
                <div className="w-1 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  
                </div> 
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    AyushLink
                  </h1>
                  <p className="text-xs text-gray-500">NAMASTE ↔ ICD-11</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              <button className= "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 hover:text-gray-900 hover:bg-red-100"
                    title="Terminate User"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    LOGOUT
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>AyushLink • Built for FHIR Compliance</p>
            <p className="mt-1">Bridging NAMASTE and ICD-11 for Indian Healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  );
};