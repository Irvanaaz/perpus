// src/pages/LoginPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import "./LoginPage.css"; // <-- CSS untuk styling halaman

function LoginPage() {
  const location = useLocation(); // <-- Dapatkan data lokasi
  const message = location.state?.message; // <-- Ambil pesan dari state

  return (
    <div className="login-page-container">
      {/* Tampilkan pesan jika ada */}
      {message && <p className="info-message">{message}</p>}
      <LoginForm />
    </div>
  );
}

export default LoginPage;
