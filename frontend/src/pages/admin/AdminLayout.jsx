import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState, useCallback } from "react"; 
import "./AdminLayout.css"; 

export default function AdminLayout() {
  
  //navigasi dan cek URL
  const navigate = useNavigate(); 
  const location = useLocation(); 

  //state buka/tutup master data
  const [openMaster, setOpenMaster] = useState(false); 

  //state buka/tutup sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);


  useEffect(() => {
    
    if (location.pathname.startsWith("/admin/master")) {
      setOpenMaster(true);
    }
  }, [location.pathname]); 

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");  
    navigate("/login");               
  };

  return (
    // wrapper layout seluruh halaman admin (sidebar + konten)
    <div className="admin-shell">
      {/* overlay untuk mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "is-open" : ""}`}
        onClick={closeSidebar}
      />

      {/* sidebar sebelah kiri */}
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        {/* tombol X di dalam sidebar (mobile) */}
        <button
          type="button"
          className="sidebar-close"
          onClick={closeSidebar}
          aria-label="Tutup menu"
        >
          ✕
        </button>

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

            {/* link menuju halaman Master -> Kelas */}
            <NavLink
              to="/admin/master/kelas"
              className={({ isActive }) => `nav-item sub ${isActive ? "active" : ""}`}
>
              Kelas
              </NavLink>
              
            {/* link menuju halaman Master -> Siswa */}
            <NavLink
            to="/admin/master/siswa"
            className={({ isActive }) => `nav-item sub ${isActive ? "active" : ""}`}
>
            Siswa
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
        <Outlet context={{ openSidebar, closeSidebar, toggleSidebar }} /> 
      </main>
    </div>
  );
}
