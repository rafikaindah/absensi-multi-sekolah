import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TestAuth from "./TestAuth";

// halaman dummy admin & guru
function AdminPage() {
  return <h2>Halaman Admin</h2>;
}

function GuruPage() {
  return <h2>Halaman Guru</h2>;
}

function App() { 
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} /> 

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/guru"
        element={
          <ProtectedRoute roles={["guru"]}>
            <GuruPage />
          </ProtectedRoute>
        }
      />

      <Route path="/test-auth" element={<TestAuth />} />
    </Routes>
  );
}

export default App;
