/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ResetPasswordPage.tsx
import React, { useState } from "react";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Typography, 
  Alert,
  Progress,
  Space
} from "antd";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { 
  LockOutlined, 
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
  SafetyOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const passwordRules = [
  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số",
  },
];

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getStrength(password);
  const percent = (strength / 5) * 100;
  
  const getColor = () => {
    if (percent < 40) return '#ff4d4f';
    if (percent < 70) return '#faad14';
    return '#52c41a';
  };

  const getText = () => {
    if (!password) return 'Chưa nhập mật khẩu';
    if (percent < 40) return 'Rất yếu';
    if (percent < 70) return 'Trung bình';
    return 'Mạnh';
  };

  if (!password) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Độ mạnh mật khẩu</Text>
        <Text strong style={{ fontSize: 12, color: getColor() }}>{getText()}</Text>
      </div>
      <Progress 
        percent={percent} 
        showInfo={false} 
        strokeColor={getColor()}
        size="small"
      />
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (!token) {
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
        <Card
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: "none",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              width: 64,
              height: 64,
              background: "#ff4d4f",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <SafetyOutlined style={{ fontSize: 28, color: "#fff" }} />
            </div>
            <Title level={3} style={{ marginBottom: 8 }}>
              Token không hợp lệ
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
              Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.
            </Text>
            <Alert
              message="Hướng dẫn"
              description="Vui lòng yêu cầu gửi lại email đặt lại mật khẩu từ trang Quên mật khẩu."
              type="warning"
              showIcon
              style={{ marginBottom: 24, borderRadius: 10 }}
            />
            <Link to="/forgot-password">
              <Button 
                type="primary" 
                size="large"
                style={{
                  height: 48,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                Quay lại Quên mật khẩu
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const onFinish = async (values: { password: string; confirm: string }) => {
    if (values.password !== values.confirm) {
      message.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setSubmitting(true);
      await authApi.resetPassword({
        token,
        password: values.password,
      });
      
      message.success({
        content: "Đặt lại mật khẩu thành công!",
        icon: <CheckCircleOutlined />,
      });
      setResetSuccess(true);
      
      // Redirect sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err?.response?.data?.message ||
          "Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu link mới.",
        duration: 5,
      });
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
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32, color: "#fff" }}>
          <div style={{
            width: 72,
            height: 72,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            backdropFilter: "blur(10px)",
          }}>
            <LockOutlined style={{ fontSize: 32, color: "#fff" }} />
          </div>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            {resetSuccess ? "Thành công!" : "Đặt lại mật khẩu"}
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)" }}>
            {resetSuccess 
              ? "Mật khẩu đã được thay đổi thành công" 
              : "Tạo mật khẩu mới cho tài khoản của bạn"}
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
          {resetSuccess ? (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <CheckCircleOutlined style={{ fontSize: 40, color: "#fff" }} />
              </div>
              <Title level={3} style={{ marginBottom: 16 }}>
                Đặt lại mật khẩu thành công!
              </Title>
              <Text type="secondary" style={{ display: "block", marginBottom: 32 }}>
                Mật khẩu của bạn đã được thay đổi. Bạn sẽ được chuyển hướng đến trang đăng nhập sau 3 giây.
              </Text>
              <Progress
                percent={100}
                status="active"
                strokeColor={{
                  '0%': '#52c41a',
                  '100%': '#73d13d',
                }}
                style={{ marginBottom: 32 }}
              />
              <Link to="/login">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  Đi đến đăng nhập ngay
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title level={4} style={{ marginBottom: 8 }}>
                  Tạo mật khẩu mới
                </Title>
                <Text type="secondary">
                  Vui lòng nhập mật khẩu mới đủ mạnh cho tài khoản của bạn
                </Text>
              </div>

              <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                <Form.Item
                  name="password"
                  rules={passwordRules}
                  style={{ marginBottom: 16 }}
                >
                  <Input.Password
                    size="large"
                    placeholder="Mật khẩu mới"
                    prefix={<LockOutlined style={{ color: "#999" }} />}
                    iconRender={(visible) => 
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    onChange={handlePasswordChange}
                    style={{
                      height: 48,
                      borderRadius: 10,
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>
                
                <PasswordStrengthIndicator password={password} />

                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                      },
                    }),
                  ]}
                  style={{ marginBottom: 24 }}
                >
                  <Input.Password
                    size="large"
                    placeholder="Xác nhận mật khẩu"
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

                <Alert
                  message="Yêu cầu mật khẩu"
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">• Ít nhất 8 ký tự</Text>
                      <Text type="secondary">• Có chữ hoa và chữ thường</Text>
                      <Text type="secondary">• Có ít nhất một chữ số</Text>
                    </Space>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 24, borderRadius: 10 }}
                />

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={submitting}
                    style={{
                      height: 48,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      fontSize: 16,
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                    }}
                  >
                    {submitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ 
                textAlign: "center", 
                marginTop: 24,
                paddingTop: 24,
                borderTop: "1px solid #f0f0f0"
              }}>
                <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <ArrowLeftOutlined />
                  Quay lại trang đăng nhập
                </Link>
              </div>
            </>
          )}
        </Card>

        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          marginTop: 24,
          color: "rgba(255,255,255,0.7)",
          fontSize: 12
        }}>
          <Text>
            Liên kết này sẽ hết hạn sau 1 giờ
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;