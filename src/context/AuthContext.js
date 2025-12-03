// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- State baru untuk loading

  useEffect(() => {
    // Efek ini hanya berjalan SEKALI saat aplikasi pertama kali dimuat
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decodedUser = jwtDecode(savedToken);
        setUser(decodedUser);
      } catch (error) {
        // Jika token tidak valid, hapus
        localStorage.removeItem('token');
      }
    }
    // Setelah selesai memeriksa, set loading menjadi false
    setLoading(false);
  }, []); // <-- Array kosong berarti hanya berjalan saat mount

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const newToken = response.data.access_token;
      localStorage.setItem('token', newToken);
      const decodedUser = jwtDecode(newToken);
      setToken(newToken);
      setUser(decodedUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading, // <-- Bagikan status loading
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}