/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
  Alert,
  Progress,
} from "antd";
import { Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./auth.css"

const { Title, Text } = Typography;

const COOLDOWN_SECONDS = 60; // 1 phút

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onFinish = async (values: { email: string }) => {
    try {
      setSubmitting(true);
      await authApi.forgotPassword(values.email);

      message.success({
        content: "Đã gửi email khôi phục! Vui lòng kiểm tra hộp thư.",
        icon: <CheckCircleOutlined />,
      });

      setSentEmail(values.email);
      setEmailSent(true);
      startCooldown();
    } catch (err: any) {
      console.error(err);
      message.error({
        content:
          err?.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại sau.",
        duration: 5,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = () => {
    form.submit();
  };

  const progressPercent =
    ((COOLDOWN_SECONDS - cooldown) / COOLDOWN_SECONDS) * 100;

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
          <div
            style={{
              width: 72,
              height: 72,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <SafetyCertificateOutlined
              style={{ fontSize: 32, color: "#fff" }}
            />
          </div>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Khôi phục mật khẩu
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)" }}>
            Nhập email để nhận liên kết đặt lại mật khẩu
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
          {emailSent ? (
            <div>
              {/* Success State */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background:
                      "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <CheckCircleOutlined
                    style={{ fontSize: 32, color: "#fff" }}
                  />
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  Email đã được gửi!
                </Title>
                <Text
                  type="secondary"
                  style={{ textAlign: "center", display: "block" }}
                >
                  Chúng tôi đã gửi liên kết đặt lại mật khẩu đến:
                </Text>
                <Text
                  strong
                  style={{ display: "block", margin: "8px 0", fontSize: 16 }}
                >
                  {sentEmail}
                </Text>
                <Text
                  type="secondary"
                  style={{ textAlign: "center", display: "block" }}
                >
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                </Text>
              </div>

              <Alert
                message="Không nhận được email?"
                description={
                  <Space direction="vertical" size={8}>
                    <Text type="secondary">
                      • Kiểm tra thư mục spam hoặc junk mail
                    </Text>
                    <Text type="secondary">
                      • Đảm bảo bạn nhập đúng địa chỉ email
                    </Text>
                  </Space>
                }
                type="info"
                showIcon
                style={{ marginBottom: 24, borderRadius: 10 }}
              />

              {/* Cooldown Timer */}
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text>Gửi lại email sau:</Text>
                  <Text
                    strong
                    style={{ color: cooldown > 0 ? "#ff4d4f" : "#52c41a" }}
                  >
                    {cooldown > 0 ? `${cooldown}s` : "Sẵn sàng"}
                  </Text>
                </div>
                <Progress
                  percent={progressPercent}
                  showInfo={false}
                  strokeColor={{
                    "0%": "#52c41a",
                    "100%": "#ff4d4f",
                  }}
                  size="small"
                  style={{ marginBottom: 16 }}
                />
              </div>

              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleResend}
                  loading={submitting}
                  disabled={cooldown > 0}
                  icon={
                    cooldown > 0 ? <ClockCircleOutlined /> : <MailOutlined />
                  }
                  style={{
                    height: 48,
                    borderRadius: 10,
                    background:
                      cooldown > 0
                        ? "#f5f5f5"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: cooldown > 0 ? "#999" : "#fff",
                  }}
                >
                  {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại email"}
                </Button>

                <Link to="/login">
                  <Button
                    block
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    style={{
                      height: 48,
                      borderRadius: 10,
                    }}
                  >
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </Space>
            </div>
          ) : (
            <div>
              {/* Email Input Form */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title level={4} style={{ marginBottom: 8 }}>
                  Nhập email đăng ký
                </Title>
                <Text type="secondary">
                  Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn
                </Text>
              </div>

              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                  style={{ marginBottom: 24 }}
                >
                  <Input
                    size="large"
                    placeholder="email@domain.com"
                    prefix={<MailOutlined style={{ color: "#999" }} />}
                    disabled={cooldown > 0}
                    style={{
                      height: 48,
                      borderRadius: 10,
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={submitting}
                    disabled={cooldown > 0}
                    icon={<MailOutlined />}
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
                    {cooldown > 0
                      ? `Vui lòng chờ ${cooldown}s`
                      : "Gửi liên kết đặt lại"}
                  </Button>
                </Form.Item>

                {cooldown > 0 && (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Progress
                      percent={progressPercent}
                      showInfo={false}
                      size="small"
                      strokeColor="#667eea"
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Có thể gửi lại sau {cooldown} giây
                    </Text>
                  </div>
                )}
              </Form>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ArrowLeftOutlined />
                  Quay lại trang đăng nhập
                </Link>
              </div>
            </div>
          )}
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
            Cần hỗ trợ? Liên hệ{" "}
            <Text>
              Cần hỗ trợ? Liên hệ{" "}
              <a
                href="mailto:support@museumpro.vn"
                className="forgot-footer-link"
              >
                support@museumpro.vn
              </a>
            </Text>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
