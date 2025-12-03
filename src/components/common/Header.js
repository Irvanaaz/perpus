// src/components/common/Header.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // 🔹 Tambahkan useTheme
import ThemeToggleButton from "./ThemeToggleButton"; // 🔹 Import tombol
import logo from "../../assets/images/logo.png";
import "./Layout.css";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // 🔹 Ambil state tema

  return (
    <header className="app-header">
      <div className="header-container">
        {/* 🔹 Logo sebagai link ke homepage */}
        <a href="/" className="logo-link">
          <img src={logo} alt="Perpusdig Logo" className="logo-img" />
        </a>

        <div className="nav-wrapper"> {/* 🔹 Wrapper untuk nav + tombol tema */}
          <nav className="main-nav">
            <a href="/">Beranda</a>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <a href="/admin/dashboard">Dasbor</a>
                )}
                <a href="/profile">Profil</a>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <a href="/login">Login</a>
            )}
          </nav>

          {/* 🔹 Tombol Toggle Tema */}
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

export default Header;
