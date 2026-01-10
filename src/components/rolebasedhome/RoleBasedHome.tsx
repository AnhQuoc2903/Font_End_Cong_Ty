import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleBasedHome = () => {
  const { hasPermission, loading } = useAuth();

  if (loading) return null;

  if (hasPermission("ADMIN_PANEL")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/artifacts" replace />;
};

export default RoleBasedHome;
