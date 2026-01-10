/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Button, Form, Input, Card, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

 const onFinish = async (values: { email: string; password: string }) => {
  try {
    setSubmitting(true);
    await login(values.email, values.password);

    // ✅ CHỈ SỬA DÒNG NÀY
    navigate("/", { replace: true });

  } catch (err: any) {
    console.error(err);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 32,
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <UserOutlined style={{ fontSize: 36, color: "#fff" }} />
          </div>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            MuseumPro
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)" }}>
            Hệ thống quản lý hiện vật bảo tàng
          </Text>
        </div>

        <Card
          style={{
            width: "100%",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: "none",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              Đăng nhập tài khoản
            </Title>
            <Text type="secondary">Nhập thông tin đăng nhập để tiếp tục</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
              style={{ marginBottom: 20 }}
            >
              <Input
                size="large"
                placeholder="Email của bạn"
                prefix={<MailOutlined style={{ color: "#999" }} />}
                style={{
                  height: 48,
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              style={{ marginBottom: 8 }}
            >
              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined style={{ color: "#999" }} />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{
                  height: 48,
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 14,
                  color: "#667eea",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                size="large"
                style={{
                  height: 48,
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                }}
              >
                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
          }}
        >
          <Text>
            © {new Date().getFullYear()} MuseumPro. Bản quyền thuộc Bảo tàng
            Lịch sử Quốc gia.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
