import { useContext } from 'react'; //mengimpor useContext untuk membaca AuthContext
import { Navigate } from 'react-router-dom'; //komponen untuk redirect halaman
import { AuthContext } from '../context/AuthContext'; //mengimpor AuthContext untuk akses data user

export default function ProtectedRoute({ children, roles }) { //komponen untuk proteksi route
  const { user, authReady } = useContext(AuthContext); //mengambil data user dan status auth siap dari Auth Context

  if (!authReady) return null; //menunggu AuthContext selesai load

  if (!user) return <Navigate to="/login" />; //jika user belum login, redirect ke /login

  if (roles && !roles.includes(user.peran)) { //jika halaman butuh role tertentu dan user tidak cocok
    return <div>Akses ditolak</div>; //tampilkan pesan bahwa akses tidak diizinkan
  }

  return children; //jika lolos semua pengecekan, tampilkan halaman
}
