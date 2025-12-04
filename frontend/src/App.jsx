import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TestAuth from "./TestAuth";

import AdminLayout from "./pages/admin/AdminLayout";
import PenggunaPage from "./pages/admin/master/PenggunaPage";

// halaman dummy guru
function GuruPage() {
  return <h2>Halaman Guru</h2>;
}

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
        <Route index element={<Navigate to="/admin/master/pengguna" />} />
        <Route path="master/pengguna" element={<PenggunaPage />} />
      </Route>

      {/* GURU */}
      <Route
        path="/guru"
        element={
          <ProtectedRoute roles={["guru"]}>
            <GuruPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
