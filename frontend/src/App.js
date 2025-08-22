import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Import components
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SolarCalculator from './components/calculators/SolarCalculator';
import AfforestationCalculator from './components/calculators/AfforestationCalculator';
import WaterCalculator from './components/calculators/WaterCalculator';
import TransportCalculator from './components/calculators/TransportCalculator';
import ElectricityCalculator from './components/calculators/ElectricityCalculator';
import History from './components/History';
import Education from './components/Education';
import Layout from './components/Layout';

// Import API services
import { authAPI, userAPI } from './services/api';
import { useToast } from './hooks/use-toast';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    total_saved: 0,
    total_co2_reduced: 0,
    total_points: 0,
    calculation_count: 0
  });
  const { toast } = useToast();

  // Check for existing auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user_data');
      
      if (token && savedUser) {
        try {
          // Verify token is still valid
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          await loadUserStats();
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await userAPI.getStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authAPI.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('auth_token', result.access_token);
      localStorage.setItem('user_data', JSON.stringify(result.user));
      
      setUser(result.user);
      await loadUserStats();
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.detail || "Please check your credentials and try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await authAPI.register({ email, password, name });
      
      // Store token and user data
      localStorage.setItem('auth_token', result.access_token);
      localStorage.setItem('user_data', JSON.stringify(result.user));
      
      setUser(result.user);
      await loadUserStats();
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error.response?.data?.detail || "Please check your information and try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setUserStats({
      total_saved: 0,
      total_co2_reduced: 0,
      total_points: 0,
      calculation_count: 0
    });
  };

  const refreshStats = async () => {
    await loadUserStats();
  };

  const authValue = {
    user,
    userStats,
    login,
    register,
    logout,
    refreshStats,
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading GreenWallet...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            <Route 
              path="/auth" 
              element={!user ? <AuthPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/solar" 
              element={user ? <Layout><SolarCalculator /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/afforestation" 
              element={user ? <Layout><AfforestationCalculator /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/water" 
              element={user ? <Layout><WaterCalculator /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/transport" 
              element={user ? <Layout><TransportCalculator /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/electricity" 
              element={user ? <Layout><ElectricityCalculator /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/history" 
              element={user ? <Layout><History /></Layout> : <Navigate to="/auth" />} 
              }
            />
            <Route 
              path="/education" 
              element={user ? <Layout><Education /></Layout> : <Navigate to="/auth" />} 
              }
            />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;