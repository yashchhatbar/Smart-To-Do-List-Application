import { Navigate } from "react-router-dom";

import { useAdminAuth } from "../hooks/useAdminAuth";

function AdminPublicRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default AdminPublicRoute;
