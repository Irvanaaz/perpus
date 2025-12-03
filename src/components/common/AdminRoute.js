// src/components/common/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth(); // <-- Ambil status loading

  // Jika kita masih dalam proses memeriksa autentikasi, tampilkan pesan.
  if (loading) {
    return <div>Memeriksa otorisasi...</div>;
  }

  // Setelah loading selesai, baru lakukan pengecekan
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
