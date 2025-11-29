import { createContext, useState, useEffect } from 'react'; //mengimpor tools React
import api from '../api/axiosClient'; //mengimpor axios client yang sudah ada token interceptor

export const AuthContext = createContext(); //membuat context untuk autentikasi

export function AuthProvider({ children }) { //provider untuk membungkus seluruh aplikasi
  const [user, setUser] = useState(null); //state untuk menyimpan data user yang login

  useEffect(() => { //mengecek user tersimpan saat komponen pertama kali dimuat
    const savedUser = localStorage.getItem('user'); //mengambil user dari localStorage
    if (savedUser) setUser(JSON.parse(savedUser)); //jika ada, set user ke state
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
