// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllEbooks = (searchQuery) => {
  // Siapkan parameter URL
  const params = {};
  if (searchQuery) {
    params.search = searchQuery;
  }

  // Kirim request dengan parameter
  return apiClient.get("/ebooks", { params });
};

export const login = (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  // Hapus header content-type dari sini karena sudah dihandle interceptor
  return apiClient.post("/auth/login", formData);
};

export const register = (name, email, password) => {
  return apiClient.post("/auth/register", { name, email, password });
};

export const downloadEbookFile = async (ebookId, ebookTitle) => {
  try {
    const response = await apiClient.get(`/ebooks/${ebookId}/download`, {
      responseType: "blob", // Penting: minta respons sebagai data biner (file)
    });

    // Buat URL sementara untuk file blob yang diterima
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    // Atur nama file yang akan diunduh
    link.setAttribute("download", `${ebookTitle}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Hapus link setelah selesai
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal mengunduh file:", error);
    throw error; // Lemparkan error agar bisa ditangani komponen
  }
};

// --- FUNGSI BARU UNTUK PROFIL ---
// Mengambil data pengguna yang sedang login
export const getMe = () => {
  return apiClient.get("/users/me");
};

// Mengambil riwayat aktivitas pengguna
export const getMyHistory = () => {
  return apiClient.get("/users/me/history");
};

// Mengambil detail satu e-book berdasarkan ID
export const getEbookById = (ebookId) => {
  return apiClient.get(`/ebooks/${ebookId}`);
};

// Mengambil ulasan untuk sebuah e-book
export const getReviewsForEbook = (ebookId) => {
  return apiClient.get(`/ebooks/${ebookId}/reviews`);
};

// Menambahkan ulasan baru untuk sebuah e-book
export const addReviewForEbook = (ebookId, reviewData) => {
  return apiClient.post(`/ebooks/${ebookId}/reviews`, reviewData);
};

// Mengambil ringkasan statistik untuk dasbor admin
export const getAdminSummary = () => {
  return apiClient.get("/admin/stats/summary");
};

// Menghapus e-book berdasarkan ID (hanya admin)
export const deleteEbookById = (ebookId) => {
  return apiClient.delete(`/ebooks/${ebookId}`);
};

// Mengunggah e-book baru (hanya admin)
export const uploadEbook = (formData) => {
  // Saat mengirim FormData, browser akan otomatis mengatur Content-Type
  // menjadi 'multipart/form-data', jadi JANGAN di-set manual.
  return apiClient.post("/ebooks/", formData);
};

// Mengedit/memperbarui e-book berdasarkan ID (hanya admin)
export const updateEbook = (ebookId, ebookData) => {
  // ebookData adalah objek { title, author, dll. }
  return apiClient.put(`/ebooks/${ebookId}`, ebookData);
};
