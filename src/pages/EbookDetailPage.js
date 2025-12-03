// src/pages/EbookDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEbookById,
  getReviewsForEbook,
  downloadEbookFile,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddReviewForm from "../components/reviews/AddReviewForm";
import "./EbookDetailPage.css";

function EbookDetailPage() {
  const { ebookId } = useParams();
  const navigate = useNavigate(); // ✅ dipakai untuk tombol kembali
  const { isAuthenticated } = useAuth();
  const [ebook, setEbook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const API_URL = "http://localhost:8000"; // ✅ Base URL backend

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [ebookResponse, reviewsResponse] = await Promise.all([
          getEbookById(ebookId),
          getReviewsForEbook(ebookId),
        ]);
        setEbook(ebookResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Gagal mengambil detail e-book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [ebookId]);

  // ✅ Callback tambah ulasan
  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  // ✅ Handle download
  const handleDownloadClick = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { message: "Anda harus login terlebih dahulu untuk mengunduh." },
      });
    } else {
      setIsDownloading(true);
      try {
        await downloadEbookFile(ebookId, ebook.title);
      } catch (error) {
        alert("Gagal mengunduh file. Mungkin Anda tidak memiliki akses.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // ✅ Handle baca online
  const handleReadOnlineClick = () => {
    const readUrl = `${API_URL}/ebooks/${ebookId}/read`;
    window.open(readUrl, "_blank");
  };

  if (loading) {
    return <p>Memuat detail buku...</p>;
  }

  if (!ebook) {
    return <p>Buku tidak ditemukan.</p>;
  }

  const coverImageUrl = ebook.cover_image_path
    ? `${API_URL}/${ebook.cover_image_path}`
    : "https://via.placeholder.com/300x400.png?text=No+Cover";

  return (
    <div className="detail-container">
      {/* ✅ Tombol Kembali */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Kembali
      </button>

      <div className="detail-main">
        <img src={coverImageUrl} alt={ebook.title} className="detail-cover" />
        <div className="detail-info">
          <h1>{ebook.title}</h1>
          <p className="author">oleh {ebook.author}</p>
          <p className="year">Tahun Terbit: {ebook.publication_year}</p>
          <h3>Deskripsi</h3>
          <p>{ebook.description || "Tidak ada deskripsi."}</p>

          {/* ✅ Tombol aksi */}
          <div className="action-buttons">
            <button onClick={handleReadOnlineClick} className="read-btn">
              Baca Online
            </button>
            <button
              onClick={handleDownloadClick}
              className="download-btn"
              disabled={isDownloading}
            >
              {isDownloading ? "Mengunduh..." : "Download"}
            </button>
          </div>
        </div>
      </div>

      <div className="detail-reviews">
        <h2>Ulasan Pengguna</h2>

        {isAuthenticated && (
          <AddReviewForm ebookId={ebookId} onReviewAdded={handleReviewAdded} />
        )}

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p className="review-comment">"{review.comment}"</p>
              <p className="review-meta">
                <strong>Rating: {review.rating}/5</strong> - oleh{" "}
                {review.user.name}
              </p>
            </div>
          ))
        ) : (
          <p>Belum ada ulasan untuk buku ini.</p>
        )}
      </div>
    </div>
  );
}

export default EbookDetailPage;
