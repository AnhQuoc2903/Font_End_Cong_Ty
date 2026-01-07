import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import CategoriesPage from "./pages/categories/CategoriesPage";
import UsersPage from "./pages/user/UsersPage";
import RolesPage from "./pages/role/RolesPage";

import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ArtifactsPage from "./pages/artifact/ArtifactsPage";
import DepartmentPage from "./pages/department/DepartmentPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ActivityLogPage from "./pages/activity-logs/ActivityLogPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute requiredPermission="VIEW_ARTIFACT">
                <Navigate to="/dashboard" replace />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute requiredPermission="VIEW_ARTIFACT">
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/artifacts"
            element={
              <PrivateRoute requiredPermission="VIEW_ARTIFACT">
                <MainLayout>
                  <ArtifactsPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute requiredPermission="VIEW_ARTIFACT">
                <MainLayout>
                  <CategoriesPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/activity-logs"
            element={
              <PrivateRoute requiredPermission="ADMIN_PANEL">
                <MainLayout>
                  <ActivityLogPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/departments"
            element={
              <PrivateRoute requiredPermission="ADMIN_PANEL">
                <MainLayout>
                  <DepartmentPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute requiredPermission="ADMIN_PANEL">
                <MainLayout>
                  <UsersPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <PrivateRoute requiredPermission="ADMIN_PANEL">
                <MainLayout>
                  <RolesPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* 🚨 ALWAYS LAST */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
