// src/pages/AdminUploadEbookPage.js
import React from 'react';
import EbookUploadForm from '../components/ebook/EbookUploadForm';
import './AdminDashboardPage.css';

function AdminUploadEbookPage() {
  return (
    <div className="admin-dashboard">
      <EbookUploadForm />
    </div>
  );
}

export default AdminUploadEbookPage;