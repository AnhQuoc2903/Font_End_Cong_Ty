/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Layout, Menu, Spin } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { logout, user, hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  const selectedKeys = [
    location.pathname.startsWith("/artifacts")
      ? "/artifacts"
      : location.pathname.startsWith("/categories")
      ? "/categories"
      : location.pathname.startsWith("/users")
      ? "/users"
      : location.pathname.startsWith("/roles")
      ? "/roles"
      : location.pathname,
  ];

  const items: any[] = [
    { key: "/artifacts", label: <Link to="/artifacts">Hiện vật</Link> },
    { key: "/categories", label: <Link to="/categories">Danh mục</Link> },
  ];

  if (hasPermission("ADMIN_PANEL")) {
    items.push({ key: "/users", label: <Link to="/users">Người dùng</Link> }, { key: "/roles", label: <Link to="/roles">Vai trò</Link> });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#fff", fontWeight: "bold" }}>Quản lý hiện vật</div>

        <div style={{ flex: 1, marginLeft: 24 }}>
          <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} items={items} />
        </div>

        <div style={{ color: "#fff" }}>
          {user && (
            <>
              <span style={{ marginRight: 16 }}>{user.fullName || user.email}</span>
              <a onClick={logout} style={{ color: "#fff", cursor: "pointer" }}>
                Đăng xuất
              </a>
            </>
          )}
        </div>
      </Header>

      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
};

export default MainLayout;
