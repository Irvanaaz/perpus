// src/pages/AdminManageEbooksPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 🔹 Impor Link
import { getAllEbooks, deleteEbookById } from "../services/api";
import "./AdminDashboardPage.css"; // Pakai ulang CSS dasbor

function AdminManageEbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await getAllEbooks();
        setEbooks(response.data);
      } catch (error) {
        console.error("Gagal mengambil data e-book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  const handleDelete = async (ebookId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteEbookById(ebookId);
        setEbooks(ebooks.filter((book) => book.id !== ebookId));
        alert("Buku berhasil dihapus!");
      } catch (error) {
        console.error("Gagal menghapus buku:", error);
        alert("Gagal menghapus buku.");
      }
    }
  };

  if (loading) return <p>Memuat daftar buku...</p>;

  return (
    <div className="admin-dashboard">
      {/* 🔹 Header halaman + tombol tambah buku */}
      <div className="page-header">
        <h1>Manajemen E-book</h1>
        <Link to="/admin/ebooks/new" className="add-btn">
          Tambah Buku Baru
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {ebooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                {/* 🔹 Ubah tombol Edit jadi Link dinamis */}
                <Link to={`/admin/ebooks/edit/${book.id}`} className="edit-btn">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="delete-btn"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminManageEbooksPage;
