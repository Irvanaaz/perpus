// src/pages/AdminEditEbookPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEbookById, updateEbook } from "../services/api";
import "../components/ebook/EbookUploadForm.css"; // Pakai ulang CSS form unggah

function AdminEditEbookPage() {
  const { ebookId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    publication_year: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Ambil data buku saat komponen dimuat
    const fetchEbookData = async () => {
      try {
        const response = await getEbookById(ebookId);
        const { title, author, description, publication_year } = response.data;
        setFormData({
          title,
          author,
          description: description || "",
          publication_year: publication_year || "",
        });
      } catch (err) {
        setError("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };
    fetchEbookData();
  }, [ebookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateEbook(ebookId, formData);
      setSuccess("Data buku berhasil diperbarui!");
      setTimeout(() => navigate("/admin/ebooks"), 1500);
    } catch (err) {
      setError("Gagal memperbarui data.");
    }
  };

  if (loading) return <p>Memuat data buku...</p>;

  return (
    <div className="admin-dashboard">
      <form onSubmit={handleSubmit} className="upload-form">
        <h2>Edit E-book</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-group">
          <label>Judul</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Penulis</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tahun Terbit</label>
          <input
            type="number"
            name="publication_year"
            value={formData.publication_year}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
}

export default AdminEditEbookPage;
