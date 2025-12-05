import React from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spin, Result, Button } from "antd";
import { ArrowLeftOutlined, LoginOutlined } from "@ant-design/icons";

type PrivateRouteProps = {
  children: React.ReactElement;
  requiredPermission?: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredPermission }) => {
  const { user, hasPermission, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <div className="text-sm text-gray-600">Đang kiểm tra đăng nhập...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <Result
          status="warning"
          title="Bạn chưa đăng nhập"
          subTitle="Vui lòng đăng nhập để truy cập trang này."
          extra={[
            <Button
              key="login"
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate("/login")}
            >
              Đi đến đăng nhập
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <Result
          status="403"
          title="Không có quyền"
          subTitle="Bạn không có quyền truy cập trang này."
          extra={[
            <Button
              key="back"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>,
            <Button
              key="home"
              type="primary"
              onClick={() => navigate("/")}
            >
              Về trang chính
            </Button>,
          ]}
        />
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
