import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PrivateRouteProps = {
  children: React.ReactElement;
  requiredPermission?: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { user, hasPermission, loading } = useAuth();

  if (loading) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  return children;
};

export default PrivateRoute;
