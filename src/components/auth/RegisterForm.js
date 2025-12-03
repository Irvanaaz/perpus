// src/components/auth/RegisterForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- untuk redirect ke login
import { register } from "../../services/api"; // <-- import fungsi register dari API
import "./LoginForm.css"; // pakai ulang CSS login

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Semua field wajib diisi.");
      return;
    }

    try {
      await register(name, email, password); // kirim data ke backend
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login"); // redirect ke halaman login
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Terjadi kesalahan saat registrasi.";
      setError(errorMessage);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="name">Nama Lengkap</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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
          minLength="8"
          required
        />
      </div>

      <button type="submit" className="submit-btn">
        Daftar
      </button>
    </form>
  );
}

export default RegisterForm;
