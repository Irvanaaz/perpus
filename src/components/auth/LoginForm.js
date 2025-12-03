// src/components/auth/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // login dari AuthContext
  const navigate = useNavigate(); // untuk redirect

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validasi input kosong
    if (!email || !password) {
      setError("Email dan password tidak boleh kosong.");
      return;
    }

    try {
      await login(email, password); // login via context (sudah handle API + token)
      navigate("/"); // redirect ke homepage
    } catch (err) {
      console.error("Login gagal:", err);
      setError("Email atau password salah.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-btn">
        Login
      </button>
      <p className="redirect-link">
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </form>
  );
}

export default LoginForm;
