import { createContext, useState, useEffect } from 'react'; //mengimpor tools React
import api from '../api/axiosClient'; //mengimpor axios client yang sudah ada token interceptor

export const AuthContext = createContext(); //membuat context untuk autentikasi

export function AuthProvider({ children }) { //provider untuk membungkus seluruh aplikasi
  const [user, setUser] = useState(() => {
    //mengambil data user dari localStorage saat inisialisasi state (agar tidak null saat refresh)
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null; //jika ada data, parse JSON jadi object; jika tidak ada, set null
  }); 

  const [authReady, setAuthReady] = useState(false); //mengecek autentikasi awal sudah selesai atau belum

  useEffect(() => { 
    //sinkronisasi ulang state user dari localStorage saat pertama kali app dijalankan
    const saved = localStorage.getItem("user");
    setUser(saved ? JSON.parse(saved) : null); //set user sesuai data tersimpan/null
    setAuthReady(true);
  }, []);

  const login = async (email, password) => { //fungsi login pengguna
    const res = await api.post('/auth/login', { email, password }); //mengirim request login ke API
    localStorage.setItem('token', res.data.token); //menyimpan token ke localStorage
    localStorage.setItem('user', JSON.stringify(res.data.user)); //menyimpan data user ke localStorage
    setUser(res.data.user); //memasukkan data user ke state AuthContext
  };

  const logout = () => { //fungsi logout user
    localStorage.removeItem('token'); //menghapus token dari localStorage
    localStorage.removeItem('user'); //menghapus data user dari localStorage
    setUser(null); //mengosongkan user di state
  };

  return (
    <AuthContext.Provider value={{ user, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
