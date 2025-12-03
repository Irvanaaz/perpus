// src/components/common/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Jika tidak login, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  return children; // Jika login, tampilkan halaman yang diminta
}

export default ProtectedRoute;
