import React from "react";
import { Layout, Menu, Spin, Avatar, Dropdown, Button, theme } from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation } from "react-router-dom";
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
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { logout, user, hasPermission, loading } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
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
    location.pathname.startsWith("/artifacts")
      ? "/artifacts"
      : location.pathname.startsWith("/categories")
      ? "/categories"
      : location.pathname.startsWith("/departments")
      ? "/departments"
      : location.pathname.startsWith("/users")
      ? "/users"
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
        key: "/roles",
        icon: <SafetyCertificateOutlined />,
        label: <Link to="/roles">Vai trò & Quyền</Link>,
      }
    );
  }

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
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
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
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
              <Avatar>{user?.fullName?.[0] || user?.email?.[0] || "U"}</Avatar>

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
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <div style={{ fontSize: 18, fontWeight: 600, color: colorPrimary }}>
              {menuItems.find((item) => item.key === selectedKeys[0])?.label ||
                "Dashboard"}
            </div>
          </div>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 999,
                transition: "background 0.2s",
              }}
            >
              <div style={{ textAlign: "right", lineHeight: 1.2 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}
                >
                  {user?.fullName || "Người dùng"}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {user?.roles?.[0] || "User"}
                </div>
              </div>

              <Avatar
                size={36}
                style={{
                  background: "#6366f1",
                  fontWeight: 600,
                }}
              >
                {user?.fullName?.[0] || user?.email?.[0] || "U"}
              </Avatar>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          {children}
        </Content>

        <div
          style={{
            textAlign: "center",
            padding: "16px 0",
            color: "#999",
            fontSize: 12,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          © {new Date().getFullYear()} MuseumPro - Hệ thống quản lý hiện vật bảo
          tàng
        </div>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
