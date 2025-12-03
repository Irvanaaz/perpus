// src/components/common/ThemeToggleButton.js
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggleButton.css'; // File CSS baru

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggleButton;