// src/pages/RegisterPage.js
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import './LoginPage.css'; // Kita bisa pakai ulang CSS dari halaman login

function RegisterPage() {
  return (
    <div className="login-page-container">
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;