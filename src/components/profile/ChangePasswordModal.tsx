/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
  Card,
  Progress,
  Badge,
  Tooltip,
} from "antd";
import {
  LockOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  IeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { authApi } from "../../api/authApi";
import "./Profile.css";

const { Text, Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const [passwordStrength, setPasswordStrength] = React.useState({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const vibrantColors = {
    primary: "#7c3aed", 
    success: "#10b981",
    warning: "#f59e0b", 
    error: "#ef4444", 
    info: "#3b82f6",
    gradientStart: "#8b5cf6",
    gradientEnd: "#3b82f6",
  };

  const calculatePasswordStrength = (password: string) => {
    const checks = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    return {
      ...checks,
      score,
    };
  };

  const getPasswordStrengthInfo = () => {
    const { score } = passwordStrength;

    if (score === 0)
      return {
        color: "#9ca3af",
        text: "Chưa nhập",
        level: 0,
        badgeColor: "default",
      };
    if (score <= 2)
      return {
        color: vibrantColors.error,
        text: "Yếu",
        level: 25,
        badgeColor: "error",
      };
    if (score === 3)
      return {
        color: vibrantColors.warning,
        text: "Trung bình",
        level: 50,
        badgeColor: "warning",
      };
    if (score === 4)
      return {
        color: vibrantColors.info,
        text: "Mạnh",
        level: 75,
        badgeColor: "processing",
      };
    return {
      color: vibrantColors.success,
      text: "Rất mạnh",
      level: 100,
      badgeColor: "success",
    };
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      await authApi.changePassword(payload);
      message.success({
        content: (
          <Space>
            <CheckCircleOutlined
              style={{
                color: vibrantColors.success,
                fontSize: 18,
              }}
            />
            <Text strong style={{ color: vibrantColors.success }}>
              Đổi mật khẩu thành công!
            </Text>
          </Space>
        ),
        style: {
          marginTop: 50,
          background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.success}08)`,
          border: `1px solid ${vibrantColors.success}30`,
          borderRadius: 12,
        },
      });
      form.resetFields();
      setPasswordStrength({
        score: 0,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
      onClose();
    } catch (err: any) {
      message.error({
        content: (
          <Space>
            <Text
              strong
              style={{
                color: vibrantColors.error,
              }}
            >
              {err?.response?.data?.message || "Đổi mật khẩu thất bại"}
            </Text>
          </Space>
        ),
        style: {
          marginTop: 50,
          background: `linear-gradient(135deg, ${vibrantColors.error}15, ${vibrantColors.error}08)`,
          border: `1px solid ${vibrantColors.error}30`,
          borderRadius: 12,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const strength = calculatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <Modal
      open={open}
      title={
        <Space
          align="center"
          style={{
            width: "100%",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
              boxShadow: `0 4px 20px ${vibrantColors.primary}40`,
              position: "relative",
            }}
          >
            <KeyOutlined
              style={{
                fontSize: 28,
                color: "white",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: vibrantColors.success,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
              }}
            >
              <IeOutlined
                style={{
                  fontSize: 10,
                  color: "white",
                }}
              />
            </div>
          </div>
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
                background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Đổi mật khẩu
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: 14,
                display: "block",
                color: vibrantColors.primary,
                fontWeight: 500,
              }}
            >
              <SyncOutlined spin style={{ marginRight: 8 }} />
              Nâng cấp bảo mật tài khoản
            </Text>
          </div>
        </Space>
      }
      okText={
        <Space>
          <LockOutlined />
          <span
            style={{
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Cập nhật mật khẩu
          </span>
        </Space>
      }
      cancelText={
        <span
          style={{
            color: vibrantColors.primary,
            fontWeight: 500,
          }}
        >
          Hủy
        </span>
      }
      confirmLoading={loading}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={700}

      className="change-password-modal"
      styles={{
        body: { padding: "24px 0" },
        header: {
          borderBottom: `2px solid ${vibrantColors.primary}20`,
          padding: "24px 24px 16px",
          background: `linear-gradient(135deg, ${vibrantColors.primary}08, transparent)`,
        },
        footer: {
          borderTop: `2px solid ${vibrantColors.primary}20`,
          padding: "16px 24px",
          background: `linear-gradient(135deg, transparent, ${vibrantColors.primary}05)`,
        },
      }}
      okButtonProps={{
        size: "large",
        style: {
          background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
          fontWeight: 600,
          borderRadius: 10,
          padding: "8px 28px",
          height: "auto",
          border: "none",
          boxShadow: `0 4px 12px ${vibrantColors.primary}40`,
          transition: "all 0.3s",
        },
        icon: <LockOutlined />,
        onMouseEnter: (e) => {
          e.currentTarget.style.boxShadow = `0 6px 20px ${vibrantColors.primary}60`;
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.boxShadow = `0 4px 12px ${vibrantColors.primary}40`;
          e.currentTarget.style.transform = "translateY(0)";
        },
      }}
      cancelButtonProps={{
        size: "large",
        style: {
          fontWeight: 500,
          borderRadius: 10,
          padding: "8px 28px",
          height: "auto",
          border: `2px solid ${vibrantColors.primary}30`,
          color: vibrantColors.primary,
          background: "transparent",
          transition: "all 0.3s",
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = `${vibrantColors.primary}10`;
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "translateY(0)";
        },
      }}
      destroyOnClose
    >
      <Card
        bordered={false}
        style={{
          background: `linear-gradient(135deg, ${vibrantColors.primary}08, ${vibrantColors.info}08)`,
          border: `2px dashed ${vibrantColors.primary}30`,
          marginBottom: 24,
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${vibrantColors.warning}20, ${vibrantColors.error}20)`,
            opacity: 0.3,
          }}
        />
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Space align="start">
            <SafetyCertificateOutlined
              style={{
                fontSize: 20,
                color: vibrantColors.success,
                marginTop: 2,
              }}
            />
            <Text
              strong
              style={{
                fontSize: 15,
                color: vibrantColors.primary,
              }}
            >
              Mẹo bảo mật quan trọng
            </Text>
          </Space>
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            {[
              {
                text: "Không sử dụng lại mật khẩu cũ",
                color: vibrantColors.error,
                icon: "🔒",
              },
              {
                text: "Không chia sẻ mật khẩu với người khác",
                color: vibrantColors.warning,
                icon: "👤",
              },
              {
                text: "Đổi mật khẩu định kỳ 3-6 tháng",
                color: vibrantColors.success,
                icon: "🔄",
              },
            ].map((item, index) => (
              <Space
                key={index}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}20`,
                  width: "100%",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <Text
                  style={{
                    fontSize: 13,
                    color: item.color,
                    fontWeight: 500,
                  }}
                >
                  {item.text}
                </Text>
              </Space>
            ))}
          </Space>
        </Space>
      </Card>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        size="large"
      >
        <Form.Item
          label={
            <Space size={6}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: `${vibrantColors.info}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockOutlined
                  style={{
                    fontSize: 12,
                    color: vibrantColors.info,
                  }}
                />
              </div>
              <Text
                strong
                style={{
                  color: vibrantColors.primary,
                  fontSize: 15,
                }}
              >
                Mật khẩu hiện tại
              </Text>
            </Space>
          }
          name="currentPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu hiện tại"
            autoComplete="current-password"
            style={{
              borderRadius: 12,
              height: 48,
              fontSize: 15,
              border: `2px solid ${vibrantColors.primary}20`,
              padding: "12px 16px",
              transition: "all 0.3s",
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined
                  style={{
                    color: vibrantColors.success,
                    fontSize: 18,
                  }}
                />
              ) : (
                <EyeInvisibleOutlined
                  style={{
                    color: vibrantColors.primary,
                    fontSize: 18,
                  }}
                />
              )
            }
            onFocus={(e) => {
              e.target.style.borderColor = vibrantColors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${vibrantColors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${vibrantColors.primary}20`;
              e.target.style.boxShadow = "none";
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space size={6}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: `${vibrantColors.success}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockOutlined
                  style={{
                    fontSize: 12,
                    color: vibrantColors.success,
                  }}
                />
              </div>
              <Text
                strong
                style={{
                  color: vibrantColors.primary,
                  fontSize: 15,
                }}
              >
                Mật khẩu mới
              </Text>
              <Badge
                status={strengthInfo.badgeColor as any}
                text={
                  <Text
                    style={{
                      fontSize: 12,
                      color: strengthInfo.color,
                      fontWeight: 600,
                    }}
                  >
                    {strengthInfo.text}
                  </Text>
                }
              />
            </Space>
          }
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/,
              message: "Mật khẩu phải đáp ứng tất cả yêu cầu bên dưới",
            },
          ]}
          extra={
            <div style={{ marginTop: 16 }}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: 13,
                        color: vibrantColors.primary,
                      }}
                    >
                      <InfoCircleOutlined
                        style={{ marginRight: 8, color: vibrantColors.info }}
                      />
                      Độ mạnh mật khẩu
                    </Text>
                    <Tooltip title="Điểm: {passwordStrength.score}/5">
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${strengthInfo.color}20, ${strengthInfo.color}08)`,
                          border: `2px solid ${strengthInfo.color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            color: strengthInfo.color,
                            fontSize: 14,
                          }}
                        >
                          {passwordStrength.score}
                        </Text>
                      </div>
                    </Tooltip>
                  </div>
                  <Progress
                    percent={strengthInfo.level}
                    size="small"
                    strokeColor={{
                      "0%": vibrantColors.error,
                      "50%": vibrantColors.warning,
                      "100%": vibrantColors.success,
                    }}
                    trailColor={`${vibrantColors.primary}10`}
                    showInfo={false}
                    style={{ margin: 0 }}
                  />
                </div>

                <Space wrap size={[12, 10]} style={{ width: "100%" }}>
                  {[
                    {
                      key: "hasMinLength",
                      label: "8+ ký tự",
                      color: vibrantColors.success,
                      icon: "📏",
                    },
                    {
                      key: "hasUpperCase",
                      label: "Chữ in hoa",
                      color: vibrantColors.info,
                      icon: "⬆️",
                    },
                    {
                      key: "hasLowerCase",
                      label: "Chữ thường",
                      color: vibrantColors.warning,
                      icon: "⬇️",
                    },
                    {
                      key: "hasNumber",
                      label: "Số",
                      color: vibrantColors.error,
                      icon: "🔢",
                    },
                    {
                      key: "hasSpecialChar",
                      label: "Ký tự đặc biệt",
                      color: vibrantColors.primary,
                      icon: "⭐",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: passwordStrength[item.key as keyof typeof passwordStrength]
                          ? `${item.color}15`
                          : "#f3f4f6",
                        border: `2px solid ${
                          passwordStrength[item.key as keyof typeof passwordStrength]
                            ? item.color
                            : "#e5e7eb"
                        }`,
                        transition: "all 0.3s",
                        transform: passwordStrength[item.key as keyof typeof passwordStrength]
                          ? "translateY(-2px)"
                          : "none",
                        boxShadow: passwordStrength[item.key as keyof typeof passwordStrength]
                          ? `0 4px 12px ${item.color}30`
                          : "none",
                      }}
                    >
                      <span style={{ fontSize: 16, marginRight: 8 }}>
                        {item.icon}
                      </span>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: passwordStrength[item.key as keyof typeof passwordStrength]
                            ? item.color
                            : "#9ca3af",
                        }}
                      >
                        {item.label}
                      </Text>
                    </div>
                  ))}
                </Space>
              </Space>
            </div>
          }
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            autoComplete="new-password"
            style={{
              borderRadius: 12,
              height: 48,
              fontSize: 15,
              border: `2px solid ${vibrantColors.primary}20`,
              padding: "12px 16px",
              transition: "all 0.3s",
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined
                  style={{
                    color: vibrantColors.success,
                    fontSize: 18,
                  }}
                />
              ) : (
                <EyeInvisibleOutlined
                  style={{
                    color: vibrantColors.primary,
                    fontSize: 18,
                  }}
                />
              )
            }
            onChange={handlePasswordChange}
            onFocus={(e) => {
              e.target.style.borderColor = vibrantColors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${vibrantColors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${vibrantColors.primary}20`;
              e.target.style.boxShadow = "none";
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space size={6}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: `${vibrantColors.warning}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockOutlined
                  style={{
                    fontSize: 12,
                    color: vibrantColors.warning,
                  }}
                />
              </div>
              <Text
                strong
                style={{
                  color: vibrantColors.primary,
                  fontSize: 15,
                }}
              >
                Xác nhận mật khẩu mới
              </Text>
            </Space>
          }
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
            style={{
              borderRadius: 12,
              height: 48,
              fontSize: 15,
              border: `2px solid ${vibrantColors.primary}20`,
              padding: "12px 16px",
              transition: "all 0.3s",
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined
                  style={{
                    color: vibrantColors.success,
                    fontSize: 18,
                  }}
                />
              ) : (
                <EyeInvisibleOutlined
                  style={{
                    color: vibrantColors.primary,
                    fontSize: 18,
                  }}
                />
              )
            }
            onFocus={(e) => {
              e.target.style.borderColor = vibrantColors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${vibrantColors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${vibrantColors.primary}20`;
              e.target.style.boxShadow = "none";
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;