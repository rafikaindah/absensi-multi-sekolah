import { useState, useContext } from 'react'; //mengimpor hook react
import { useNavigate } from 'react-router-dom'; //pindah halaman setelah login
import { AuthContext } from '../context/AuthContext'; //akses fungsi login dari AuthContext
import './LoginPage.css'; //mengimpor file CSS untuk tampilan halaman login

export default function LoginPage() { //komponen halaman login
  const { login } = useContext(AuthContext); //mengambil fungsi login dari AuthContext
  const navigate = useNavigate(); //hook untuk navigasi halaman
  const [email, setEmail] = useState(''); //state untuk menyimpan email input
  const [password, setPassword] = useState(''); //state untuk menyimpan password input
  const [error, setError] = useState(''); //state untuk pesan error jika login gagal

  const handleSubmit = async (e) => { //fungsi yang berjalan saat form disubmit
    e.preventDefault(); //mencegah refresh halaman bawaan form
    try {
      await login(email, password); //memanggil fungsi login dari AuthContext
      const user = JSON.parse(localStorage.getItem('user')); //mengambil data user dari localStorage
      if (user.peran === 'admin') navigate('/admin');//masuk ke halaman admin
      else navigate('/guru');//masuk ke halaman guru
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login Sistem Absensi Multi Sekolah</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Masukkan email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Masukkan password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
