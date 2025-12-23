import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spin, Button, Card, Typography, Space, Divider } from "antd";
import {
  ArrowLeftOutlined,
  LoginOutlined,
  LockOutlined,
  UserOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

type PrivateRouteProps = {
  children: React.ReactElement;
  requiredPermission?: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { user, hasPermission, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
        }}
      >
        <Card
          style={{
            width: 400,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
            border: "none",
            textAlign: "center",
            padding: 40,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                animation: "pulse 1.5s infinite",
              }}
            >
              <LoadingOutlined style={{ fontSize: 36, color: "#fff" }} />
            </div>
            <Title level={3} style={{ marginBottom: 8 }}>
              Đang kiểm tra
            </Title>
            <Text type="secondary">Đang xác thực thông tin đăng nhập...</Text>
          </div>
          <Spin
            size="large"
            indicator={
              <LoadingOutlined
                style={{ fontSize: 36, color: "#667eea" }}
                spin
              />
            }
          />
          <div style={{ marginTop: 24 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Vui lòng đợi trong giây lát
            </Text>
          </div>
        </Card>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          padding: 20,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
            border: "none",
          }}
          bodyStyle={{ padding: 40 }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 100,
                height: 100,
                background:
                  "linear-gradient(135deg, #ffaa0015 0%, #ffaa0040 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                border: "3px solid #ffaa00",
              }}
            >
              <UserOutlined style={{ fontSize: 48, color: "#faad14" }} />
            </div>

            <Title level={2} style={{ marginBottom: 16 }}>
              Yêu cầu đăng nhập
            </Title>

            <Text
              type="secondary"
              style={{ fontSize: 16, display: "block", marginBottom: 32 }}
            >
              Bạn cần đăng nhập để truy cập trang này. Vui lòng đăng nhập để
              tiếp tục.
            </Text>

            <Divider style={{ margin: "32px 0" }} />

            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <div
                style={{ display: "flex", justifyContent: "center", gap: 24 }}
              >
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    padding: "0 32px",
                  }}
                >
                  Quay lại
                </Button>

                <Button
                  type="primary"
                  size="large"
                  icon={<LoginOutlined />}
                  onClick={() => navigate("/login")}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    padding: "0 32px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  Đăng nhập ngay
                </Button>
              </div>

              <div
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Space align="start">
                  <SafetyCertificateOutlined
                    style={{ color: "#52c41a", fontSize: 20 }}
                  />
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 4 }}>
                      Lưu ý bảo mật
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Đảm bảo bạn đang truy cập từ thiết bị an toàn và mạng
                      riêng tư.
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff4d4f15 0%, #ff787515 100%)",
          padding: 20,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(255, 77, 79, 0.1)",
            border: "none",
          }}
          bodyStyle={{ padding: 40 }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 100,
                height: 100,
                background:
                  "linear-gradient(135deg, #ff4d4f15 0%, #ff787540 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                border: "3px solid #ff4d4f",
              }}
            >
              <LockOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
            </div>

            <Title level={2} style={{ marginBottom: 8, color: "#ff4d4f" }}>
              Truy cập bị từ chối
            </Title>

            <Text
              type="secondary"
              style={{ fontSize: 16, display: "block", marginBottom: 8 }}
            >
              Tài khoản của bạn không có quyền truy cập trang này.
            </Text>

            <Text
              strong
              style={{ display: "block", marginBottom: 32, color: "#ff4d4f" }}
            >
              Yêu cầu quyền: {requiredPermission}
            </Text>

            <Divider style={{ margin: "32px 0" }}>
              <Text type="secondary">Các lựa chọn của bạn</Text>
            </Divider>

            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <div
                style={{ display: "flex", justifyContent: "center", gap: 24 }}
              >
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    padding: "0 32px",
                  }}
                >
                  Quay lại trang trước
                </Button>

                <Button
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/dashboard")}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    padding: "0 32px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  Về trang chính
                </Button>
              </div>

              <div
                style={{
                  background: "#fff7e6",
                  border: "1px solid #ffd591",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Space align="start">
                  <SafetyCertificateOutlined
                    style={{ color: "#fa8c16", fontSize: 20 }}
                  />
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 4 }}>
                      Cần quyền truy cập?
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Liên hệ quản trị viên hệ thống nếu bạn cần quyền truy cập
                      vào chức năng này.
                    </Text>
                  </div>
                </Space>
              </div>

              <div
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Space>
                  <UserOutlined style={{ color: "#52c41a" }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Đăng nhập với tư cách: <Text strong>{user.email}</Text> •
                    Vai trò: <Text strong>{user.roles?.[0] || "User"}</Text>
                  </Text>
                </Space>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
