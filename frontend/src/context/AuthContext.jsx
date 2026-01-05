import { createContext, useState, useEffect } from 'react'; //mengimpor tools React
import apiAdmin from '../api/axiosAdmin'; //mengimpor axios client yang sudah ada token interceptor

export const AuthContext = createContext(); //membuat context untuk autentikasi

// helper untuk menentukan key di localStorage
const keyToken = (role) => (role === "admin" ? "token_admin" : "token_guru");
const keyUser  = (role) => (role === "admin" ? "user_admin"  : "user_guru");

// menentukan role berdasarkan path URL
const roleFromPath = () => {
  const p = window.location.pathname || "";
  if (p.startsWith("/admin")) return "admin";
  if (p.startsWith("/guru")) return "guru";
  return null; 
};

export function AuthProvider({ children }) { //provider untuk membungkus seluruh aplikasi
  //state simpan data user admin dan guru
  const [adminUser, setAdminUser] = useState(null);
  const [guruUser, setGuruUser] = useState(null);

  //state simpan user aktif di tab ini
  const [user, setUser] = useState(null);

  const [authReady, setAuthReady] = useState(false); //mengecek autentikasi awal sudah selesai atau belum

  useEffect(() => {
    //bersihkan semua data login di localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("sekolahId");

    //mengambil data user admin dan guru dari localStorage
    const auRaw = localStorage.getItem("user_admin");
    const guRaw = localStorage.getItem("user_guru");

    //parse data user dari JSON string ke objek
    const au = auRaw ? JSON.parse(auRaw) : null;
    const gu = guRaw ? JSON.parse(guRaw) : null;

    //set state user admin dan guru
    setAdminUser(au);
    setGuruUser(gu);

    //tentukan user aktif berdasarkan path URL
    const r = roleFromPath();
    setUser(r === "admin" ? au : r === "guru" ? gu : (au || gu));
    setAuthReady(true);
  }, []);

  const login = async (email, password) => { //fungsi login pengguna
     //kirim request login ke server
    const res = await apiAdmin.post("/auth/login", { email, password });

    //simpan data user dan token ke localStorage sesuai rolenya
    const u = res.data.user;
    const t = res.data.token;

    //simpan di localStorage
    localStorage.setItem(keyToken(u.peran), t);
    localStorage.setItem(keyUser(u.peran), JSON.stringify(u));

    //set state user admin atau guru
    if (u.peran === "admin") setAdminUser(u);
    else setGuruUser(u);

    //set user aktif di tab ini
    setUser(u);
    // kembalikan data user
    return u;
  };

  const logout = (role) => { //fungsi logout user
    const r = role || user?.peran;
    if (!r) return;
    //hapus data token dan user dari localStorage
    localStorage.removeItem(keyToken(r));
    localStorage.removeItem(keyUser(r));

    //hapus state user admin atau guru
    if (r === "admin") setAdminUser(null);
    if (r === "guru") setGuruUser(null);

    setUser(null); //mengosongkan user di state
  };

  return (
    <AuthContext.Provider value={{ user, adminUser, guruUser, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
