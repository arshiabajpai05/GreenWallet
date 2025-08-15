import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Import components
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SolarCalculator from './components/calculators/SolarCalculator';
import WaterCalculator from './components/calculators/WaterCalculator';
import TransportCalculator from './components/calculators/TransportCalculator';
import ElectricityCalculator from './components/calculators/ElectricityCalculator';
import History from './components/History';
import Layout from './components/Layout';

// Mock data
import { mockUser, mockCalculations } from './mock';

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
  const [calculations, setCalculations] = useState(mockCalculations);

  const login = (email, password) => {
    // Mock login - in real app, this would call API
    if (email && password) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const register = (email, password, name) => {
    // Mock register - in real app, this would call API
    if (email && password && name) {
      const newUser = { ...mockUser, email, name };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addCalculation = (calculation) => {
    const newCalc = {
      ...calculation,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setCalculations(prev => [newCalc, ...prev]);
    
    // Update user totals (mock calculation)
    setUser(prev => ({
      ...prev,
      totalSaved: prev.totalSaved + calculation.moneySaved,
      totalCO2Reduced: prev.totalCO2Reduced + calculation.co2Reduced,
      totalPoints: prev.totalPoints + calculation.points
    }));
  };

  const deleteCalculation = (id) => {
    const calcToDelete = calculations.find(c => c.id === id);
    if (calcToDelete) {
      setCalculations(prev => prev.filter(c => c.id !== id));
      // Update user totals
      setUser(prev => ({
        ...prev,
        totalSaved: prev.totalSaved - calcToDelete.moneySaved,
        totalCO2Reduced: prev.totalCO2Reduced - calcToDelete.co2Reduced,
        totalPoints: prev.totalPoints - calcToDelete.points
      }));
    }
  };

  const authValue = {
    user,
    calculations,
    login,
    register,
    logout,
    addCalculation,
    deleteCalculation
  };

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
            />
            <Route 
              path="/solar" 
              element={user ? <Layout><SolarCalculator /></Layout> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/water" 
              element={user ? <Layout><WaterCalculator /></Layout> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/transport" 
              element={user ? <Layout><TransportCalculator /></Layout> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/electricity" 
              element={user ? <Layout><ElectricityCalculator /></Layout> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/history" 
              element={user ? <Layout><History /></Layout> : <Navigate to="/auth" />} 
            />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;