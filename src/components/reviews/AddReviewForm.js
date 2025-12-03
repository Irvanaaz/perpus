// src/components/reviews/AddReviewForm.js
import React, { useState } from "react";
import { addReviewForEbook } from "../../services/api";
import "./AddReviewForm.css"; // File CSS baru

function AddReviewForm({ ebookId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!comment) {
      setError("Komentar tidak boleh kosong.");
      return;
    }

    try {
      const newReview = await addReviewForEbook(ebookId, { rating, comment });
      setSuccess("Ulasan Anda berhasil ditambahkan!");
      setComment(""); // Kosongkan form setelah berhasil
      setRating(5);
      onReviewAdded(newReview.data); // Panggil fungsi untuk update daftar ulasan
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Gagal menambahkan ulasan.";
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Tulis Ulasan Anda</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="form-group">
        <label>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>5 - Sempurna</option>
          <option value={4}>4 - Bagus</option>
          <option value={3}>3 - Cukup</option>
          <option value={2}>2 - Kurang</option>
          <option value={1}>1 - Buruk</option>
        </select>
      </div>
      <div className="form-group">
        <label>Komentar</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagaimana pendapat Anda tentang buku ini?"
          rows="4"
        />
      </div>
      <button type="submit">Kirim Ulasan</button>
    </form>
  );
}

export default AddReviewForm;
