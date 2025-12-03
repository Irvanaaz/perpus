// src/components/ebook/EbookList.js
import React from 'react';
import EbookCard from './EbookCard'; // Impor komponen kartu
import './EbookList.css'; // Kita akan buat file CSS ini nanti

// Komponen ini menerima 'ebooks' sebagai prop
function EbookList({ ebooks }) {
  return (
    <div className="ebook-list">
      {ebooks.map((book) => (
        // Berikan data 'book' ke setiap EbookCard
        <EbookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default EbookList;