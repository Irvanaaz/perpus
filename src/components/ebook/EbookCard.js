// src/components/ebook/EbookCard.js
import React from "react";
import { Link } from "react-router-dom"; // <-- Impor Link
import "./EbookCard.css";

function EbookCard({ book }) {
  const defaultCover = "https://via.placeholder.com/150x200.png?text=No+Cover";
  const coverImageUrl = book.cover_image_path
    ? `http://localhost:8000/${book.cover_image_path}`
    : defaultCover;

  return (
    // Bungkus seluruh kartu dengan komponen Link
    <Link to={`/ebook/${book.id}`} className="ebook-card-link">
      <div className="ebook-card">
        <img
          src={coverImageUrl}
          alt={`Cover of ${book.title}`}
          className="ebook-card-cover"
        />
        <div className="ebook-card-body">
          <h3 className="ebook-card-title">{book.title}</h3>
          <p className="ebook-card-author">{book.author}</p>
        </div>
      </div>
    </Link>
  );
}

export default EbookCard;
