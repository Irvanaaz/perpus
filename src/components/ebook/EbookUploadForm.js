// src/components/ebook/EbookUploadForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadEbook } from "../../services/api";
import "./EbookUploadForm.css"; // File CSS baru

function EbookUploadForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !pdfFile || !coverImage) {
      setError("Judul, Penulis, File PDF, dan Gambar Sampul wajib diisi.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    // Kita gunakan FormData karena ada file yang diunggah
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("publication_year", publicationYear);
    formData.append("pdf_file", pdfFile);
    formData.append("cover_image", coverImage);

    try {
      await uploadEbook(formData);
      setSuccess("E-book berhasil diunggah! Anda akan diarahkan kembali.");
      setTimeout(() => {
        navigate("/admin/ebooks"); // Kembali ke halaman manajemen
      }, 2000);
    } catch (err) {
      setError("Gagal mengunggah e-book. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Unggah E-book Baru</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="form-group">
        <label>Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Penulis</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Tahun Terbit</label>
        <input
          type="number"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        ></textarea>
      </div>
      <div className="form-group">
        <label>File PDF</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, setPdfFile)}
          required
        />
      </div>
      <div className="form-group">
        <label>Gambar Sampul</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setCoverImage)}
          required
        />
      </div>

      <button type="submit" disabled={isUploading}>
        {isUploading ? "Mengunggah..." : "Unggah E-book"}
      </button>
    </form>
  );
}

export default EbookUploadForm;
