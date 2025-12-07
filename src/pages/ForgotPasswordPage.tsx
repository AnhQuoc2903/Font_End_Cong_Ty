/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";

const { Text } = Typography;

const COOLDOWN_SECONDS = 60; // 1 phút

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0); // số giây còn lại

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

      // ✅ message mới đúng yêu cầu
      message.success("Vui lòng kiểm tra email để được hướng dẫn");

      // ✅ bắt đầu khóa nút 1 phút
      startCooldown();
    } catch (err: any) {
      console.error(err);
      message.error(
        err?.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại sau."
      );
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
        background: "#f0f2f5",
      }}
    >
      <Card title="Quên mật khẩu" style={{ width: 400 }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Email đăng ký"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="nhapemail@domain.com"
              disabled={cooldown > 0}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
              disabled={cooldown > 0}
            >
              {cooldown > 0
                ? `Vui lòng chờ ${cooldown}s`
                : "Gửi link đặt lại mật khẩu"}
            </Button>
          </Form.Item>
        </Form>

        {cooldown > 0 && (
          <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
            Bạn có thể gửi lại sau {cooldown} giây
          </Text>
        )}

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
