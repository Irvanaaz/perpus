// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import EbookDetailPage from "./pages/EbookDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminManageEbooksPage from "./pages/AdminManageEbooksPage";
import Layout from "./components/common/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import AdminUploadEbookPage from "./pages/AdminUploadEbookPage";
import AdminEditEbookPage from "./pages/AdminEditEbookPage";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* 🔹 Rute user biasa */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/ebook/:ebookId" element={<EbookDetailPage />} />

              {/* 🔹 Rute khusus admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/ebooks"
                element={
                  <AdminRoute>
                    <AdminManageEbooksPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/ebooks/new"
                element={
                  <AdminRoute>
                    <AdminUploadEbookPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/ebooks/edit/:ebookId"
                element={
                  <AdminRoute>
                    <AdminEditEbookPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
