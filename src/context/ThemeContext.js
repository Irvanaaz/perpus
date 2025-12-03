// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Cek localStorage untuk tema yang tersimpan, atau default ke 'light'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // 2. Setiap kali tema berubah, update class di body dan simpan ke localStorage
    const body = document.body;
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(`${theme}-mode`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook untuk mempermudah penggunaan
export function useTheme() {
  return useContext(ThemeContext);
}
