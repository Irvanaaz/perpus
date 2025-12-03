// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { getAllEbooks } from "../services/api";
import EbookList from "../components/ebook/EbookList";
import "./HomePage.css"; // File CSS baru

function HomePage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // <-- State untuk menyimpan query pencarian

  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true); // Mulai loading setiap kali pencarian berubah
      try {
        // Kirim searchTerm ke fungsi API
        const response = await getAllEbooks(searchTerm);
        setEbooks(response.data);
      } catch (error) {
        console.error("Gagal mengambil data e-book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, [searchTerm]); // <-- Jalankan ulang useEffect setiap kali searchTerm berubah

  return (
    <div>
      <header className="home-header">
        <h1>Koleksi E-Book</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau penulis..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <main>
        {loading ? (
          <p style={{ textAlign: "center" }}>Mencari buku...</p>
        ) : (
          <EbookList ebooks={ebooks} />
        )}
      </main>
    </div>
  );
}

export default HomePage;
