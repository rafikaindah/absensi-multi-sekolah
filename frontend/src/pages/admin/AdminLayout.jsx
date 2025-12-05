import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"; // import komponen navigasi dari React Router
import { useEffect, useState } from "react"; // import React hook untuk state dan efek
import "./AdminLayout.css"; // import file CSS layout admin

export default function AdminLayout() {
  const navigate = useNavigate(); // hook untuk perpindahan halaman (redirect)

  const location = useLocation(); // hook untuk mendapatkan info lokasi (path URL) saat ini

  const [openMaster, setOpenMaster] = useState(false); // state untuk mengatur dropdown Master Data (buka/tutup)

  // useEffect: otomatis buka dropdown saat berada di route /admin/master/...
  useEffect(() => {
    // Jika path URL diawali "/admin/master", maka buka dropdown
    if (location.pathname.startsWith("/admin/master")) {
      setOpenMaster(true);
    }
  }, [location.pathname]); // dijalankan setiap path berubah

  // fungsi logout: menghapus token + user lalu redirect ke login
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");  
    navigate("/login");               
  };

  return (
    // wrapper layout seluruh halaman admin (sidebar + konten)
    <div className="admin-shell">

      {/* sidebar sebelah kiri */}
      <aside className="admin-sidebar">

        {/* bagian judul sidebar (Admin Panel + Sistem Absensi) */}
        <div className="brand">
          <div className="brand-title">Admin Panel</div>   
          <div className="brand-sub">Sistem Absensi</div>  
        </div>

        {/* menu utama : tombol dropdown Master Data */}
        <button
          className={`nav-parent ${openMaster ? "open" : ""}`} 
          onClick={() => setOpenMaster((p) => !p)}              
          type="button"
        >
          <span>Master Data</span>                              
          <span className="chev">{openMaster ? "▾" : "▸"}</span> 
        </button>

        {/* sub menu: tampil hanya jika openMaster = true */}
        {openMaster && (
          <div className="nav-sub">
            {/* link menuju halaman Master -> Pengguna */}
            <NavLink
              to="/admin/master/pengguna"
              className={({ isActive }) => 
                `nav-item sub ${isActive ? "active" : ""}`      
              }
            >
              Pengguna
            </NavLink>
            
            {/* link menuju halaman Master -> Sekolah */}
            <NavLink
              to="/admin/master/sekolah"
              className={({ isActive }) => `nav-item sub ${isActive ? "active" : ""}`}
    >
              Sekolah
              </NavLink>
          </div>
        )}

        {/* tombol logout */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </aside>

      {/* area konten utama di kanan */}
      <main className="admin-content">
        <Outlet /> 
      </main>
    </div>
  );
}
