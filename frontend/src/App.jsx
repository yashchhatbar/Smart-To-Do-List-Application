import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminPublicRoute from "./components/AdminPublicRoute";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useAuth } from "./hooks/useAuth";
import ActivityLogsPage from "./pages/admin/ActivityLogsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import UsersPage from "./pages/admin/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const { initializing } = useAuth();
  const { initializing: adminInitializing } = useAdminAuth();

  if (initializing || adminInitializing) {
    return <Loader fullScreen label="Restoring your session..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/login"
        element={
          <AdminPublicRoute>
            <AdminLoginPage />
          </AdminPublicRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="activity-logs" element={<ActivityLogsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
