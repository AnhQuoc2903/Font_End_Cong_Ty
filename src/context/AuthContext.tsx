/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { message } from "antd";

type User = {
  id: string;
  email: string;
  fullName?: string;
  roles?: string[];
  permissions?: string[];
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  // restore tokens/user from localStorage at startup
  useEffect(() => {
    const u = localStorage.getItem("user");
    const a = localStorage.getItem("accessToken");
    if (u && a) {
      setUser(JSON.parse(u));
      setAccessToken(a);
    } else {
      setUser(null);
      setAccessToken(null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password });
      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setAccessToken(accessToken);
      message.success("Đăng nhập thành công");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Đăng nhập thất bại");
      throw err;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await authApi.logout(refreshToken);
    } catch (e) {
      console.warn("logout api failed", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setAccessToken(null);
      window.location.href = "/login";
    }
  };

  const hasPermission = (perm: string) => {
    return user?.permissions?.includes(perm) || false;
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
