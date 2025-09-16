// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/Layout';
import { SearchPage } from './pages/SearchPage';
import { ConditionsPage } from './pages/ConditionsPage';
import { AboutPage } from './pages/AboutPage';
import AuthManager from "./components/AuthManager";
import HomePage from "./components/HomePage"
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          return status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('JWTS_TOKEN');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {!isAuthenticated ? (
          // Show only auth page when not logged in
          <Routes>
            <Route path="/auth" element={<AuthManager />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        ) : (
          // Show main app with layout when logged in
          <Layout>
            <Routes>
              {/* <Route path="/home" element={<HomePage />} /> */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/conditions" element={<ConditionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<SearchPage />} /> {/* Default to home */}
            </Routes>
          </Layout>
        )}
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
