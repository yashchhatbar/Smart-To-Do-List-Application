import { Navigate, useLocation } from "react-router-dom";

import { useAdminAuth } from "../hooks/useAdminAuth";

function AdminProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

export default AdminProtectedRoute;
