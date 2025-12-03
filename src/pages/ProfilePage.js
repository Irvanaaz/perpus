// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { getMe, getMyHistory } from "../services/api";
import "./ProfilePage.css"; // File CSS baru

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data profil dan riwayat secara bersamaan
        const [userResponse, historyResponse] = await Promise.all([
          getMe(),
          getMyHistory(),
        ]);
        setUser(userResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Memuat profil...</p>;
  }

  if (!user) {
    return <p>Gagal memuat informasi pengguna.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profil Saya</h2>
        <p>
          <strong>Nama:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <div className="profile-history">
        <h3>Riwayat Aktivitas</h3>
        {history.length > 0 ? (
          <ul>
            {history.map((log) => (
              <li key={log.id}>
                Anda melakukan aksi <strong>{log.action}</strong> pada buku "
                {log.ebook.title}" -{" "}
                <small>{new Date(log.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada aktivitas.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
