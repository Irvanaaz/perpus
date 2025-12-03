// src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 🔹 Tambah Link
import { getAdminSummary } from "../services/api";
import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getAdminSummary();
        setSummary(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dasbor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p>Memuat statistik...</p>;
  if (!summary) return <p>Gagal memuat data.</p>;

  return (
    <div className="admin-dashboard">
      <h1>Dasbor Admin</h1>

      {/* 🔹 Navigasi admin */}
      <div className="admin-nav">
        <Link to="/admin/ebooks" className="admin-nav-link">
          Manajemen E-book
        </Link>
        {/* Tambahkan link lain di sini nanti */}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Pengguna</h2>
          <p>{summary.total_users}</p>
        </div>
        <div className="stat-card">
          <h2>Buku Terpopuler</h2>
          <ul>
            {summary.most_downloaded_ebooks.map((item) => (
              <li key={item.ebook.id}>
                {item.ebook.title} <span>({item.download_count} unduhan)</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="stat-card">
          <h2>Pengguna Teraktif</h2>
          <ul>
            {summary.top_active_users.map((item) => (
              <li key={item.user.id}>
                {item.user.name} <span>({item.activity_count} aktivitas)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
