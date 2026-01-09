/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { message } from "antd";

export interface Department {
  _id: string;
  name: string;
  description?: string;
}

type Role = {
  _id: string;
  name: string;
};

type User = {
  _id: string; // ✅ ĐÚNG
  email: string;
  fullName?: string;
  avatar?: string; // ✅ THÊM
  phone?: string;
  roles?: Role[]; // ✅ backend populate role
  permissions?: string[];
  department?: Department; // ✅ đã có
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================
   * RESTORE SESSION (F5)
   * =========================
   * Chỉ restore accessToken + user
   * refreshToken nằm trong HttpOnly cookie → browser tự lo
   */
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



  /**
   * =========================
   * LOGIN
   * =========================
   * Backend tự set refreshToken cookie
   */
  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password });

      const { accessToken, user } = res.data;

      // ✅ CHỈ LƯU accessToken + user
      localStorage.setItem("accessToken", accessToken);
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

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, ...data };

      // 🔥 sync localStorage để F5 không mất avatar
      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  };

  /**
   * =========================
   * LOGOUT
   * =========================
   * Backend xoá refreshToken cookie
   */
  const logout = async () => {
    try {
      await authApi.logout(); // 🔥 KHÔNG GỬI refreshToken
    } catch (e) {
      console.warn("logout api failed", e);
    } finally {
      // ✅ XOÁ STATE FRONTEND
      localStorage.removeItem("accessToken");
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
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        hasPermission,
        updateUser,
      }}
    >
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
