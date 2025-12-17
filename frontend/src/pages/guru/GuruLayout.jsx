import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./GuruLayout.css";

export default function GuruLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // state buka/tutup sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  useEffect(() => {
  }, [location.pathname]);

  const handleLogout = () => {
    // hapus info login dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // hapus data sekolah & sesi guru agar login ulang mulai dari nol
    localStorage.removeItem("guru_sesi_by_school");
    navigate("/login");
  };

  return (
    <div className="guru-shell">
      {/* overlay gelap di belakang sidebar */}
      <div
        className={`guru-overlay ${sidebarOpen ? "is-open" : ""}`}
        onClick={closeSidebar}
      />
      {/* sidebar kiri (tampil kalau sidebarOpen = true) */}
      <aside className={`guru-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        {/* tombol X (khusus mobile) */}
        <button
          type="button"
          className="guru-sidebar-close"
          onClick={closeSidebar}
          aria-label="Tutup menu"
        >
          ✕
        </button>

        {/* bagian brand/judul sidebar */}
        <div className="guru-brand">
          <div className="guru-brand-title">Dashboard Guru</div>
          <div className="guru-brand-sub">Multi Sekolah</div>
        </div>

        {/* menu navigasi */}
        <nav className="guru-nav">
          <NavLink to="/guru" end className={({ isActive }) => `guru-item ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
        </nav>

         {/* tombol logout  */}
        <button className="guru-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* area konten kanan */}
      <main className="guru-content">
        <Outlet context={{ openSidebar, closeSidebar, toggleSidebar }} />
      </main>
    </div>
  );
}
