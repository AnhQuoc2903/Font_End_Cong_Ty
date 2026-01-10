import React from "react";
import {
  Layout,
  Menu,
  Spin,
  Avatar,
  Dropdown,
  Button,
  theme,
  Badge,
} from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation } from "react-router-dom";
import ProfileModal from "../components/profile/ProfileModal";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";

import { useAuth } from "../context/AuthContext";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TrophyOutlined,
  AppstoreOutlined,
  ApartmentOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  HistoryOutlined,
  KeyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";
import "./MainLayout.css";

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { logout, user, hasPermission, loading } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [profilechangpasswordOpen, setProfileChangPassWordOpen] =
    React.useState(false);

  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Spin
          size="large"
          tip="Đang tải ứng dụng..."
          style={{ color: "#fff" }}
        />
      </div>
    );
  }

  const selectedKeys = [
    location.pathname.startsWith("/dashboard")
      ? "/dashboard"
      : location.pathname.startsWith("/artifacts")
      ? "/artifacts"
      : location.pathname.startsWith("/categories")
      ? "/categories"
      : location.pathname.startsWith("/departments")
      ? "/departments"
      : location.pathname.startsWith("/users")
      ? "/users"
      : location.pathname.startsWith("/activity-logs")
      ? "/activity-logs"
      : location.pathname.startsWith("/roles")
      ? "/roles"
      : location.pathname,
  ];

  const menuItems = [
    {
      key: "/artifacts",
      icon: <TrophyOutlined />,
      label: <Link to="/artifacts">Hiện vật</Link>,
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Danh mục</Link>,
    },
  ];

  if (hasPermission("ADMIN_PANEL")) {
    menuItems.unshift({
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    });
    menuItems.push(
      {
        key: "/departments",
        icon: <ApartmentOutlined />,
        label: <Link to="/departments">Phòng ban</Link>,
      },
      {
        key: "/users",
        icon: <TeamOutlined />,
        label: <Link to="/users">Người dùng</Link>,
      },
      {
        key: "/activity-logs",
        icon: <HistoryOutlined />,
        label: <Link to="/activity-logs">Lịch sử thao tác</Link>,
      },
      {
        key: "/roles",
        icon: <SafetyCertificateOutlined />,
        label: <Link to="/roles">Vai trò & Quyền</Link>,
      }
    );
  }

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(124, 58, 237, 0.2)",
            }}
          >
            <UserOutlined
              style={{
                fontSize: 16,
                color: "#7c3aed",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: 2,
              }}
            >
              Thông tin cá nhân
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Xem và chỉnh sửa hồ sơ
            </div>
          </div>
        </div>
      ),
      onClick: () => setProfileOpen(true),
    },
    {
      key: "change-password",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <KeyOutlined
              style={{
                fontSize: 16,
                color: "#10b981",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: 2,
              }}
            >
              Đổi mật khẩu
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Cập nhật bảo mật tài khoản
            </div>
          </div>
        </div>
      ),
      onClick: () => setProfileChangPassWordOpen(true),
    },
    {
      type: "divider",
      style: {
        margin: "12px 0",
        borderColor: "rgba(124, 58, 237, 0.1)",
      },
    },
    {
      key: "logout",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
            borderRadius: 8,
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <LogoutOutlined
              style={{
                fontSize: 16,
                color: "#ef4444",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#ef4444",
                marginBottom: 2,
              }}
            >
              Đăng xuất
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#ef4444",
                opacity: 0.7,
              }}
            >
              Thoát khỏi hệ thống
            </div>
          </div>
        </div>
      ),
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={260}
          style={{
            background: "linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)",
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          }}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={80}
        >
          <div
            style={{
              padding: collapsed ? "20px 16px" : "24px",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {collapsed ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}
                >
                  M
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  <span
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}
                  >
                    M
                  </span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}
                  >
                    MuseumPro
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                    Quản lý hiện vật
                  </div>
                </div>
              </div>
            )}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={["/artifacts", "/categories"]}
            items={menuItems}
            style={{
              background: "transparent",
              borderRight: "none",
              padding: collapsed ? "16px 8px" : "16px",
              marginTop: 8,
            }}
            inlineIndent={collapsed ? 0 : 24}
          />

          {!collapsed && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px 24px",
                background: "rgba(0,0,0,0.2)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar src={user?.avatar}>
                  {user?.fullName?.[0] || user?.email?.[0] || "U"}
                </Avatar>

                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 500 }}>
                    {user?.fullName || "Người dùng"}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0 32px",
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              height: 72,
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: 18,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5f6368",
                  borderRadius: 10,
                  transition: "all 0.2s ease",
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                }}
                className="menu-toggle-btn"
              />

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  letterSpacing: "-0.01em",
                  position: "relative",
                  paddingLeft: 16,
                  borderLeft: "2px solid #e5e7eb",
                }}
              >
                {menuItems.find((item) => item.key === selectedKeys[0])
                  ?.label || "Dashboard"}
              </div>
            </div>

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
              overlayStyle={{
                minWidth: 260,

                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                className="user-dropdown-trigger"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",

                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  border: "1px solid transparent",
                }}
              >
                <div style={{ textAlign: "right", lineHeight: 1.4 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1a1a",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {user?.fullName || "Người dùng"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                    }}
                  >
                    <Badge
                      status="success"
                      size="small"
                      style={{
                        marginRight: 4,
                        boxShadow: "0 0 0 2px #fff",
                      }}
                    />
                    {typeof user?.roles?.[0] === "string"
                      ? user.roles[0]
                      : user?.roles?.[0]?.name || "User"}
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <Avatar
                    src={user?.avatar}
                    size={40}
                    style={{
                      background: `linear-gradient(135deg, ${colorPrimary} 0%, ${colorPrimary}AA 100%)`,
                      fontWeight: 700,
                      fontSize: 16,
                      border: "3px solid #fff",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    {user?.fullName?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "U"}
                  </Avatar>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      backgroundColor: "#10b981",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </div>
              </div>
            </Dropdown>
          </Header>

          <Content
            style={{
              margin: "24px 32px",
              padding: 28,
              minHeight: "calc(100vh - 180px)",
              background: colorBgContainer,
              borderRadius: 16,
              overflow: "auto",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            {children}
          </Content>

          <Footer
            style={{
              textAlign: "center",
              padding: "20px 0",
              color: "#6b7280",
              fontSize: 14,
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f8fafc",
              fontWeight: 500,
              letterSpacing: "0.01em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span style={{ opacity: 0.8 }}>© {new Date().getFullYear()}</span>
            <span
              style={{
                color: "#1a1a1a",
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MuseumPro
            </span>
            <span style={{ opacity: 0.8 }}>
              - Hệ thống quản lý hiện vật bảo tàng
            </span>
          </Footer>
        </Layout>
      </Layout>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <ChangePasswordModal
        open={profilechangpasswordOpen}
        onClose={() => setProfileChangPassWordOpen(false)}
      />
    </>
  );
};

export default MainLayout;
