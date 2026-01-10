/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Space,
  Typography,
  theme,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import { 
  UserOutlined, 
  PhoneOutlined, 
  SaveOutlined, 
  MailOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CheckCircleOutlined,
  IeOutlined,
  CrownOutlined,
  StarOutlined 
} from "@ant-design/icons";
import { ProfileAvatar } from "../../components/profile/ProfileAvatar";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const { Title, Text } = Typography;
const { useToken } = theme;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const { token } = useToken();
  const [loading, setLoading] = useState(false);

  const vibrantColors = {
    primary: "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    gradientStart: "#8b5cf6",
    gradientEnd: "#3b82f6",
    gold: "#fbbf24",
    purple: "#a855f7",
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await userApi.updateMyProfile(values);

      updateUser({
        fullName: values.fullName,
        phone: values.phone,
      });

      message.success({
        content: (
          <Space>
            <Text strong style={{ color: vibrantColors.success, fontSize: 15 }}>
              Cập nhật thông tin thành công!
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
    } catch {
      message.error({
        content: (
          <Space>
            <Text strong style={{ color: vibrantColors.error }}>
              Cập nhật thất bại
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

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${vibrantColors.primary}05 0%, ${vibrantColors.info}05 100%)`,
        minHeight: "100vh",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorations */}
      <div style={{
        position: "absolute",
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${vibrantColors.primary}10 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: -150,
        left: -150,
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${vibrantColors.info}10 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1600, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            boxShadow: `0 20px 60px ${vibrantColors.primary}15`,
            overflow: "hidden",
            background: token.colorBgContainer,
            border: `2px solid ${vibrantColors.primary}20`,
          }}
          bodyStyle={{ padding: 40 }}
        >
          <Row gutter={[48, 32]} align="top">
            {/* Left Panel - Profile Info */}
            <Col xs={24} md={8}>
              <div
                style={{
                  position: "sticky",
                  top: 32,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 32, position: "relative" }}>
                  <div style={{ 
                    position: "relative", 
                    display: "inline-block",
                    padding: 8,
                    background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                    borderRadius: 24,
                  }}>
                    <div style={{
                      position: "relative",
                      padding: 8,
                      background: "white",
                      borderRadius: 20,
                    }}>
                      <ProfileAvatar avatar={user?.avatar} onChange={() => {}} />
                    </div>
                    
                    <Badge
                      count={
                        <Tooltip title="Verified Account">
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${vibrantColors.success}, ${vibrantColors.info})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid white",
                            boxShadow: `0 4px 12px ${vibrantColors.success}50`,
                          }}>
                            <CheckCircleOutlined style={{ 
                              fontSize: 12, 
                              color: "white",
                            }} />
                          </div>
                        </Tooltip>
                      }
                      offset={[-10, 10]}
                    />
                  </div>
                  
                  <div style={{ marginTop: 24 }}>
                    <Title level={3} style={{ 
                      margin: 0, 
                      color: vibrantColors.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}>
                      {user?.fullName || "Chưa cập nhật"}
                      <CrownOutlined style={{ 
                        color: vibrantColors.gold,
                        fontSize: 20,
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }} />
                    </Title>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ 
                        fontSize: 15,
                        color: vibrantColors.primary,
                        fontWeight: 500,
                      }}>
                        {user?.email}
                      </Text>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 16,
                    padding: "8px 16px",
                    background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.info}15)`,
                    borderRadius: 20,
                    border: `1px solid ${vibrantColors.success}40`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <IeOutlined style={{ color: vibrantColors.success }} />
                    <Text strong style={{ 
                      fontSize: 13,
                      color: vibrantColors.success,
                      letterSpacing: "0.5px",
                    }}>
                      Premium Member
                    </Text>
                  </div>
                </div>

                <Divider style={{ 
                  margin: "32px 0",
                  borderColor: `${vibrantColors.primary}20`,
                }} />

                <div
                  style={{
                    background: `linear-gradient(135deg, ${vibrantColors.primary}08, ${vibrantColors.info}08)`,
                    borderRadius: 20,
                    padding: 28,
                    border: `2px solid ${vibrantColors.primary}20`,
                    boxShadow: `0 8px 32px ${vibrantColors.primary}10`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    background: `radial-gradient(circle, ${vibrantColors.purple}20, transparent 70%)`,
                    borderRadius: "50%",
                    transform: "translate(30%, -30%)",
                  }} />
                  
                  <Title level={5} style={{ 
                    marginBottom: 24, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12,
                    color: vibrantColors.primary,
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${vibrantColors.primary}20, ${vibrantColors.info}20)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <InfoCircleOutlined style={{ 
                        fontSize: 18,
                        color: vibrantColors.primary,
                      }} />
                    </div>
                    Thông tin cá nhân
                  </Title>
                  
                  <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    <div>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 16,
                        padding: 16,
                        borderRadius: 16,
                        background: token.colorBgContainer,
                        border: `1px solid ${vibrantColors.primary}15`,
                        transition: "all 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 8px 24px ${vibrantColors.primary}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${vibrantColors.primary}15, ${vibrantColors.primary}05)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UserOutlined style={{ 
                            fontSize: 20, 
                            color: vibrantColors.primary,
                          }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text type="secondary" style={{ 
                            fontSize: 12, 
                            fontWeight: 600,
                            color: vibrantColors.primary,
                            opacity: 0.7,
                          }}>
                            Họ tên
                          </Text>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: token.colorTextHeading,
                              marginTop: 4,
                            }}
                          >
                            {user?.fullName || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 16,
                        padding: 16,
                        borderRadius: 16,
                        background: token.colorBgContainer,
                        border: `1px solid ${vibrantColors.info}15`,
                        transition: "all 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 8px 24px ${vibrantColors.info}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${vibrantColors.info}15, ${vibrantColors.info}05)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MailOutlined style={{ 
                            fontSize: 20, 
                            color: vibrantColors.info,
                          }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text type="secondary" style={{ 
                            fontSize: 12, 
                            fontWeight: 600,
                            color: vibrantColors.info,
                            opacity: 0.7,
                          }}>
                            Email
                          </Text>
                          <div
                            style={{
                              fontSize: 14,
                              color: token.colorText,
                              marginTop: 4,
                              wordBreak: "break-all",
                            }}
                          >
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 16,
                        padding: 16,
                        borderRadius: 16,
                        background: token.colorBgContainer,
                        border: `1px solid ${vibrantColors.success}15`,
                        transition: "all 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 8px 24px ${vibrantColors.success}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.success}05)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PhoneOutlined style={{ 
                            fontSize: 20, 
                            color: vibrantColors.success,
                          }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text type="secondary" style={{ 
                            fontSize: 12, 
                            fontWeight: 600,
                            color: vibrantColors.success,
                            opacity: 0.7,
                          }}>
                            Số điện thoại
                          </Text>
                          <div
                            style={{
                              fontSize: 15,
                              color: token.colorText,
                              marginTop: 4,
                            }}
                          >
                            {user?.phone || "Chưa cập nhật"}
                          </div>
                        </div>
                        {!user?.phone && (
                          <EditOutlined style={{ 
                            color: vibrantColors.warning,
                            fontSize: 16,
                          }} />
                        )}
                      </div>
                    </div>
                  </Space>
                </div>
              </div>
            </Col>

            {/* Right Panel - Edit Form */}
            <Col xs={24} md={16}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${token.colorBgContainer}, ${vibrantColors.primary}02)`,
                  borderRadius: 24,
                  padding: 40,
                  border: `2px solid ${vibrantColors.primary}20`,
                  boxShadow: `0 8px 40px ${vibrantColors.primary}10`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: `radial-gradient(circle, ${vibrantColors.gold}10, transparent 70%)`,
                  borderRadius: "50%",
                  pointerEvents: "none",
                }} />

                <div style={{ marginBottom: 40, position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 8px 24px ${vibrantColors.primary}30`,
                      }}
                    >
                      <EditOutlined style={{ 
                        fontSize: 24, 
                        color: "white",
                      }} />
                    </div>
                    <div>
                      <Title
                        level={2}
                        style={{ 
                          margin: 0, 
                          color: token.colorTextHeading,
                          background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Chỉnh sửa thông tin
                      </Title>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <StarOutlined style={{ 
                          color: vibrantColors.gold,
                          fontSize: 16,
                        }} />
                        <Text type="secondary" style={{ fontSize: 15 }}>
                          Cập nhật thông tin cá nhân của bạn tại đây
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                <Form
                  key={user?._id}
                  form={form}
                  layout="vertical"
                  initialValues={{
                    fullName: user?.fullName,
                    phone: user?.phone,
                  }}
                  onFinish={onFinish}
                >
                  <Row gutter={[32, 24]}>
                    <Col xs={24}>
                      <Form.Item
                        label={
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                background: `linear-gradient(135deg, ${vibrantColors.primary}15, ${vibrantColors.primary}05)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <UserOutlined style={{ 
                                fontSize: 20, 
                                color: vibrantColors.primary,
                              }} />
                            </div>
                            <div>
                              <Text
                                strong
                                style={{
                                  fontSize: 15,
                                  color: vibrantColors.primary,
                                  display: "block",
                                  marginBottom: 4,
                                }}
                              >
                                Họ tên
                              </Text>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                Nhập họ tên đầy đủ của bạn
                              </Text>
                            </div>
                          </div>
                        }
                        name="fullName"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Nhập họ tên của bạn"
                          style={{
                            borderRadius: 16,
                            border: `2px solid ${vibrantColors.primary}30`,
                            padding: "16px 20px",
                            fontSize: 16,
                            height: 56,
                            transition: "all 0.3s",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = vibrantColors.primary;
                            e.target.style.boxShadow = `0 0 0 4px ${vibrantColors.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${vibrantColors.primary}30`;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label={
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.success}05)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <PhoneOutlined style={{ 
                                fontSize: 20, 
                                color: vibrantColors.success,
                              }} />
                            </div>
                            <div>
                              <Text
                                strong
                                style={{
                                  fontSize: 15,
                                  color: vibrantColors.success,
                                  display: "block",
                                  marginBottom: 4,
                                }}
                              >
                                Số điện thoại
                              </Text>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                Nhập số điện thoại liên lạc
                              </Text>
                            </div>
                          </div>
                        }
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                          {
                            pattern: /^\d{9,11}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Nhập số điện thoại"
                          style={{
                            borderRadius: 16,
                            border: `2px solid ${vibrantColors.success}30`,
                            padding: "16px 20px",
                            fontSize: 16,
                            height: 56,
                            transition: "all 0.3s",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = vibrantColors.success;
                            e.target.style.boxShadow = `0 0 0 4px ${vibrantColors.success}20`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${vibrantColors.success}30`;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item style={{ marginTop: 60 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 20,
                      }}
                    >
                      <div>
                        <Text type="secondary" style={{ 
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}>
                          <CheckCircleOutlined style={{ color: vibrantColors.success }} />
                          Sau khi lưu, thông tin sẽ được cập nhật ngay lập tức
                        </Text>
                      </div>
                      
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        icon={<SaveOutlined />}
                        style={{
                          minWidth: 200,
                          height: 56,
                          borderRadius: 16,
                          fontWeight: 700,
                          fontSize: 16,
                          background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                          border: "none",
                          boxShadow: `0 8px 32px ${vibrantColors.primary}40`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 12,
                          padding: "0 32px",
                          letterSpacing: "0.5px",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = `0 12px 40px ${vibrantColors.primary}60`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = `0 8px 32px ${vibrantColors.primary}40`;
                        }}
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}