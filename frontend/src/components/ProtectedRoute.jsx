import { Navigate } from 'react-router-dom'; //komponen untuk redirect halaman  

export default function ProtectedRoute({ children, roles }) {
  // ambil data user dari localStorage sesuai rolenya
  const role = roles?.[0];

  // tentukan key localStorage berdasarkan role
  const tokenKey = role === "admin" ? "token_admin" : "token_guru";
  const userKey  = role === "admin" ? "user_admin"  : "user_guru";

  // ambil token dan user dari localStorage
  const token = localStorage.getItem(tokenKey);
  const userRaw = localStorage.getItem(userKey);
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!token || !user) return <Navigate to="/login" />; //jika user belum login, redirect ke /login

  if (roles && !roles.includes(user.peran)) { //jika halaman butuh role tertentu dan user tidak cocok
    return <div>Akses ditolak</div>; //tampilkan pesan bahwa akses tidak diizinkan
  }

  return children; //jika lolos semua pengecekan, tampilkan halaman
}
 