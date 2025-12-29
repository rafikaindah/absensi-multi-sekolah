import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TestAuth from "./TestAuth";

import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";

import AdminLayout from "./pages/admin/AdminLayout";
import PenggunaPage from "./pages/admin/master/pengguna/PenggunaPage";
import SekolahPage from "./pages/admin/master/sekolah/SekolahPage";
import KelasPage from "./pages/admin/master/kelas/KelasPage";
import SiswaPage from "./pages/admin/master/siswa/SiswaPage";
import MapelPage from "./pages/admin/master/mapel/MapelPage";
import PendaftaranGuruPage from "./pages/admin/master/pendaftaran-guru/PendaftaranGuruPage";
import JadwalMengajarPage from "./pages/admin/master/jadwal-mengajar/JadwalMengajarPage";
import AdminReportGuruPage from "./pages/admin/report/report-guru/AdminReportGuruPage";
import AdminReportSiswaPage from "./pages/admin/report/report-siswa/AdminReportSiswaPage";
import AdminQrSekolahPage from "./pages/admin/qr-sekolah/AdminQrSekolahPage";

import GuruLayout from "./pages/guru/GuruLayout"; 
import GuruDashboardPage from "./pages/guru/dashboard/GuruDashboardPage"; 
import MulaiMengajarPage from "./pages/guru/mulai-mengajar/MulaiMengajarPage";
import ReportGuruPage from "./pages/guru/report-guru/ReportGuruPage";
import ReportSiswaPage from "./pages/guru/report-siswa/ReportSiswaPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/test-auth" element={<TestAuth />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />

        <Route path="dashboard" element={<AdminDashboardPage />} />

        <Route path="master/pengguna" element={<PenggunaPage />} />
        <Route path="master/sekolah" element={<SekolahPage />} />
        <Route path="master/kelas" element={<KelasPage />} />
        <Route path="master/siswa" element={<SiswaPage />} />
        <Route path="master/mapel" element={<MapelPage />} />
        <Route path="master/pendaftaran-guru" element={<PendaftaranGuruPage />} />
        <Route path="master/jadwal-mengajar" element={<JadwalMengajarPage />} />
        <Route path="report/report-guru" element={<AdminReportGuruPage />} />
        <Route path="report/report-siswa" element={<AdminReportSiswaPage />} />
        <Route path="qr-sekolah" element={<AdminQrSekolahPage />} />

      </Route>

      {/* GURU */}
      <Route
        path="/guru"
        element={
          <ProtectedRoute roles={["guru"]}>
            <GuruLayout />
          </ProtectedRoute>
        } 
      >
        <Route index element={<GuruDashboardPage />} /> 
        <Route path="mulai/:id_jadwal" element={<MulaiMengajarPage />} /> 
        <Route path="report-guru" element={<ReportGuruPage />} />
        <Route path="report-siswa" element={<ReportSiswaPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
