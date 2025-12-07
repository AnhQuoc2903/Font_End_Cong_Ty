/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ResetPasswordPage.tsx
import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authApi } from "../api/authApi";

const passwordRules = [
  { required: true, message: "Nhập mật khẩu mới" },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số",
  },
];

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card style={{ width: 400 }} title="Đặt lại mật khẩu">
          <p>Token không hợp lệ hoặc đã hết hạn.</p>
          <Link to="/forgot-password">Quay lại Quên mật khẩu</Link>
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
      const res = await authApi.resetPassword({
        token,
        password: values.password,
      });
      message.success(res.data?.message || "Đặt lại mật khẩu thành công");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      message.error(
        err?.response?.data?.message ||
          "Không thể đặt lại mật khẩu. Token có thể đã hết hạn."
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
      <Card title="Đặt lại mật khẩu" style={{ width: 400 }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={passwordRules}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
