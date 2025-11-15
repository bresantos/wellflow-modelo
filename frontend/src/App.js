import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import GestorLayout from './layouts/GestorLayout';
import FuncionarioLayout from './layouts/FuncionarioLayout';
import GestorHome from './pages/gestor/Home';
import GestorEmployees from './pages/gestor/Employees';
import GestorReports from './pages/gestor/Reports';
import GestorEnvironment from './pages/gestor/Environment';
import GestorActions from './pages/gestor/Actions';
import FuncionarioHome from './pages/funcionario/Home';
import FuncionarioForm from './pages/funcionario/Form';
import FuncionarioEnvironment from './pages/funcionario/Environment';
import FuncionarioTips from './pages/funcionario/Tips';
import { Toaster } from './components/ui/sonner';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // Initialize database
      try {
        await axios.post(`${API}/init-db`);
      } catch (error) {
        console.error('DB init error:', error);
      }

      // Check token
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initApp();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#f5f2e7' }}>
        <div className="text-xl" style={{ color: '#B23FE6' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'gestor' ? '/gestor' : '/funcionario'} />} />
          
          {/* Gestor Routes */}
          <Route path="/gestor" element={user?.role === 'gestor' ? <GestorLayout /> : <Navigate to="/login" />}>
            <Route index element={<GestorHome />} />
            <Route path="employees" element={<GestorEmployees />} />
            <Route path="reports" element={<GestorReports />} />
            <Route path="environment" element={<GestorEnvironment />} />
            <Route path="actions" element={<GestorActions />} />
          </Route>

          {/* Funcionario Routes */}
          <Route path="/funcionario" element={user?.role === 'funcionario' ? <FuncionarioLayout /> : <Navigate to="/login" />}>
            <Route index element={<FuncionarioHome />} />
            <Route path="form" element={<FuncionarioForm />} />
            <Route path="environment" element={<FuncionarioEnvironment />} />
            <Route path="tips" element={<FuncionarioTips />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
}

export default App;
