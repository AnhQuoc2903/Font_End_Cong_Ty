/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/dashboard/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Progress,
  List,
  Avatar,
  Spin,
  message,
  Empty,
  Alert,
  Divider,
} from "antd";
import {
  TrophyOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ApartmentOutlined,
  RiseOutlined,
  FallOutlined,
  DownloadOutlined,
  HistoryOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PieChartOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  NumberOutlined,
  FileTextOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { artifactApi } from "../../api/artifactApi";
import { categoryApi } from "../../api/categoryApi";
import { userApi } from "../../api/userApi";
import { departmentApi } from "../../api/departmentApi";
import { roleApi } from "../../api/roleApi";
import type { Category } from "../../api/categoryApi";
import { Link } from "react-router-dom";
import type { PieLabelRenderProps } from "recharts";
import { dashboardApi } from "../../api/dashboardApi";
import "./DashboardPage.css";

const { Title, Text } = Typography;

interface DashboardStats {
  totalArtifacts: number;
  totalCategories: number;
  totalUsers: number;
  totalDepartments: number;
  totalRoles: number;
  totalTransactions: number;
  lowStockArtifacts: number;
  totalValue: number;
  growthRate: number;
  importCount: number;
  exportCount: number;
}

interface ArtifactByCategory {
  category: string;
  count: number;
  value: number;
  categoryId: string;
  [key: string]: number | string;
}

interface RecentTransaction {
  _id: string;
  type: "IMPORT" | "EXPORT" | "ADJUST";
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  createdBy?: {
    _id: string;
    email?: string;
    fullName?: string;
  };

  artifact: {
    _id: string;
    name: string;
    code: string;
  };
  createdAt: string;
}

interface MonthlyData {
  month: string;
  imports: number;
  exports: number;
  adjustments: number;
}

interface LowStockItem {
  _id: string;
  name: string;
  code: string;
  quantity: number;
  minStockLevel: number;
  category?: Category;
}

interface PerformanceItem {
  name: string;
  value: number;
}

const DashboardPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalArtifacts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalDepartments: 0,
    totalRoles: 0,
    totalTransactions: 0,
    lowStockArtifacts: 0,
    totalValue: 0,
    growthRate: 0,
    importCount: 0,
    exportCount: 0,
  });
  const [artifactData, setArtifactData] = useState<ArtifactByCategory[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransaction[]
  >([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [performanceData] = useState<PerformanceItem[]>([
    { name: "Độ chính xác", value: 98 },
    { name: "Tốc độ xử lý", value: 85 },
    { name: "Độ tin cậy", value: 96 },
    { name: "Hiệu quả", value: 88 },
  ]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        artifactsRes,
        categoriesRes,
        usersRes,
        departmentsRes,
        rolesRes,
        monthlyRes,
        lowStockRes,
        summaryRes,
      ] = await Promise.all([
        artifactApi.getList(),
        categoryApi.getAll(),
        userApi.getAll(),

        departmentApi.getAll(),
        roleApi.getAll(),

        dashboardApi.getMonthlyStats(),
        dashboardApi.getLowStock(5),
        dashboardApi.getSummary(),
      ]);

      const artifacts = artifactsRes.data || [];
      const categories = categoriesRes.data || [];
      const users = usersRes.data || [];
      const departments = departmentsRes.data || [];
      const roles = rolesRes.data || [];

      setMonthlyData(monthlyRes.data);
      setLowStockItems(lowStockRes.data);

      const summary = summaryRes.data;

      // Calculate total value and low stock items

      const totalValue = artifacts.reduce(
        (sum: number, a: any) => sum + (a.estimatedValue || 0),
        0
      );

      // Fetch recent transactions from first artifact (or all artifacts)
      // ================= RECENT TRANSACTIONS =================
      let recentTransactionsList: RecentTransaction[] = [];
      let totalTransactions = 0;
      let importCount = 0;
      let exportCount = 0;

      try {
        const recentTxRes = await dashboardApi.getRecentTransactions();

        recentTransactionsList = recentTxRes.data || [];

        totalTransactions = recentTransactionsList.length;

        recentTransactionsList.forEach((tx) => {
          if (tx.type === "IMPORT") importCount++;
          if (tx.type === "EXPORT") exportCount++;
        });

        setRecentTransactions(recentTransactionsList);
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }

      // Prepare category data for chart
      const categoryData: ArtifactByCategory[] = categories
        .map((cat: Category) => {
          const categoryArtifacts = artifacts.filter(
            (a: any) => a.category?._id === cat._id
          );
          const count = categoryArtifacts.length;
          const value = categoryArtifacts.reduce(
            (sum: number, a: any) => sum + (a.estimatedValue || 0),
            0
          );

          return {
            category: cat.name,
            count,
            value,
            categoryId: cat._id,
          };
        })
        .filter((item) => item.count > 0);

      // Generate monthly data

      setArtifactData(categoryData);
      setRecentTransactions(recentTransactionsList);
      setLowStockItems(lowStockRes.data);

      setMonthlyData(monthlyRes.data);

      setStats({
        totalArtifacts: summary.totalArtifacts ?? artifacts.length,
        totalCategories: summary.totalCategories ?? categories.length,
        totalUsers: summary.totalUsers ?? users.length,
        totalDepartments: summary.totalDepartments ?? departments.length,
        totalRoles: summary.totalRoles ?? roles.length,
        totalTransactions: summary.totalTransactions ?? totalTransactions,
        lowStockArtifacts: summary.lowStockArtifacts ?? lowStockRes.data.length,
        totalValue: summary.totalValue ?? totalValue,
        growthRate: summary.growthRate ?? calculateGrowthRate(artifacts),
        importCount: summary.importCount ?? importCount,
        exportCount: summary.exportCount ?? exportCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateGrowthRate = (artifacts: any[]): number => {
    if (artifacts.length === 0) return 0;
    const growth = (artifacts.length / 100) * 12.5;
    return parseFloat(growth.toFixed(1));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "IMPORT":
        return <ArrowUpOutlined style={{ color: "#52c41a" }} />;
      case "EXPORT":
        return <ArrowDownOutlined style={{ color: "#ff4d4f" }} />;
      case "ADJUST":
        return <HistoryOutlined style={{ color: "#faad14" }} />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "IMPORT":
        return "#52c41a";
      case "EXPORT":
        return "#ff4d4f";
      case "ADJUST":
        return "#faad14";
      default:
        return "#d9d9d9";
    }
  };

  const TRANSACTION_LABEL: Record<string, string> = {
    IMPORT: "Nhập kho",
    EXPORT: "Xuất kho",
    ADJUST: "Điều chỉnh",
  };

  const renderPieLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    if (
      cx == null ||
      cy == null ||
      midAngle == null ||
      innerRadius == null ||
      outerRadius == null ||
      percent == null
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    prefix,
    suffix,
    trend,
    loading: cardLoading,
    className,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    prefix?: string;
    suffix?: string;
    trend?: number;
    loading?: boolean;
    className?: string;
  }) => (
    <Card
      className={className}
      hoverable
      style={{
        height: "100%",
        border: `1px solid ${color}20`,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      bodyStyle={{ padding: 20 }}
    >
      <Spin spinning={cardLoading}>
        <Row align="middle" gutter={[16, 16]}>
          <Col>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: color,
              }}
            >
              {icon}
            </div>
          </Col>
          <Col flex="auto">
            <Text type="secondary" style={{ fontSize: 14 }}>
              {title}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, color: color }}>
                {prefix}
                {typeof value === "number" ? value.toLocaleString() : value}
                {suffix}
              </Title>
              {trend !== undefined && (
                <Space style={{ marginTop: 4 }}>
                  {trend >= 0 ? (
                    <RiseOutlined style={{ color: "#52c41a" }} />
                  ) : (
                    <FallOutlined style={{ color: "#ff4d4f" }} />
                  )}
                  <Text type={trend >= 0 ? "success" : "danger"}>
                    {Math.abs(trend)}%
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    so với tháng trước
                  </Text>
                </Space>
              )}
            </div>
          </Col>
        </Row>
      </Spin>
    </Card>
  );

  const QuickAction = ({
    icon,
    title,
    description,
    action,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: () => void;
    color: string;
  }) => (
    <Card
      hoverable
      onClick={action}
      style={{
        height: "100%",
        border: `1px solid ${color}20`,
        borderRadius: 12,
        cursor: "pointer",
      }}
      bodyStyle={{ padding: 16, textAlign: "center" }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: color,
          margin: "0 auto 12px",
        }}
      >
        {icon}
      </div>
      <Title level={5} style={{ marginBottom: 4 }}>
        {title}
      </Title>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {description}
      </Text>
    </Card>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Spin size="large" tip="Đang tải dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 32,
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "100%",
            background:
              "linear-gradient(135deg, transparent 0%, #1890ff10 100%)",
            zIndex: 0,
          }}
        />

        <Col style={{ position: "relative", zIndex: 1 }}>
          <Space direction="vertical" size={8}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                }}
              >
                <UserOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                  }}
                >
                  Chào mừng trở lại,{" "}                 
                  {user?.fullName?.split(" ")[0] || "Quản trị viên"}!
             
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ClockCircleOutlined />
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Tag
                color="blue"
                icon={<CheckCircleOutlined />}
                style={{
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                Phiên làm việc:{" "}
                {new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Tag>
              <Tag
                color="green"
                icon={<TeamOutlined />}
                style={{
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {user?.roles?.join(", ") || "Người dùng"}
              </Tag>
              <Tag
                color="purple"
                icon={<ApartmentOutlined />}
                style={{
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {user?.department?.name || "Toàn hệ thống"}
              </Tag>
            </div>
          </Space>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Link
            to="/artifacts"
            className="stat-card-link"
            style={{
              textDecoration: "none",
              display: "block",
              transition: "all 0.3s ease",
            }}
          >
            <StatCard
              title="Tổng hiện vật"
              value={stats.totalArtifacts}
              icon={<TrophyOutlined />}
              color="#1890ff"
              trend={stats.growthRate}
              loading={loading}
              className="stat-card-with-hover"
            />
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Link
            to="/categories"
            className="stat-card-link"
            style={{
              textDecoration: "none",
              display: "block",
              transition: "all 0.3s ease",
            }}
          >
            <StatCard
              title="Danh mục"
              value={stats.totalCategories}
              icon={<AppstoreOutlined />}
              color="#52c41a"
              loading={loading}
              className="stat-card-with-hover"
            />
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Link
            to="/users"
            className="stat-card-link"
            style={{
              textDecoration: "none",
              display: "block",
              transition: "all 0.3s ease",
            }}
          >
            <StatCard
              title="Người dùng"
              value={stats.totalUsers}
              icon={<TeamOutlined />}
              color="#722ed1"
              loading={loading}
              className="stat-card-with-hover"
            />
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Link
            to="/departments"
            className="stat-card-link"
            style={{
              textDecoration: "none",
              display: "block",
              transition: "all 0.3s ease",
            }}
          >
            <StatCard
              title="Phòng ban"
              value={stats.totalDepartments}
              icon={<ApartmentOutlined />}
              color="#fa8c16"
              loading={loading}
              className="stat-card-with-hover"
            />
          </Link>
        </Col>
      </Row>

      {/* Second Row Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Giao dịch tháng"
            value={stats.totalTransactions}
            icon={<HistoryOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Nhập kho"
            value={stats.importCount}
            icon={<ArrowUpOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Xuất kho"
            value={stats.exportCount}
            icon={<ArrowDownOutlined />}
            color="#ff4d4f"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Hàng tồn thấp"
            value={stats.lowStockArtifacts}
            icon={<WarningOutlined />}
            color="#f5222d"
            loading={loading}
          />
        </Col>
      </Row>

      {/* Charts and Activity */}
      <Row gutter={[16, 16]}>
        {/* Artifacts by Category Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>Phân bố hiện vật theo danh mục</span>
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={artifactData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                >
                  {artifactData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value?: number, _name?: any, props?: any) => {
                    const count = value ?? 0;
                    const category =
                      props?.payload?.category ?? "Không xác định";
                    return [`${count} hiện vật`, category];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Monthly Activity Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>Hoạt động hàng tháng</span>
              </Space>
            }
            style={{ borderRadius: 12, height: "100%" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="imports" name="Nhập kho" fill="#52c41a" />
                <Bar dataKey="exports" name="Xuất kho" fill="#ff4d4f" />
                <Bar dataKey="adjustments" name="Điều chỉnh" fill="#faad14" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity and Low Stock */}
      <Row gutter={[16, 24]} style={{ marginTop: 24 }}>
        {/* Recent Transactions */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="card-title-wrapper">
                <HistoryOutlined
                  style={{ color: "#1890ff", fontSize: "18px" }}
                />
                <span style={{ fontWeight: 600, marginLeft: 8 }}>
                  Giao dịch gần đây
                </span>
              </div>
            }
            headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            bodyStyle={{ padding: "16px 8px" }}
            className="dashboard-card"
          >
            {recentTransactions.length > 0 ? (
              <List
                dataSource={recentTransactions}
                size="large"
                style={{
                  maxHeight: 420, // 👈 giới hạn chiều cao
                  overflowY: "auto", // 👈 cho cuộn
                  paddingRight: 8,
                }}
                renderItem={(transaction, index) => (
                  <List.Item
                    key={transaction._id}
                    style={{
                      padding: "12px 16px",
                      borderBottom:
                        index === recentTransactions.length - 1
                          ? "none"
                          : "1px solid #f5f5f5",
                      transition: "all 0.3s",
                      borderRadius: "6px",
                      marginBottom: "4px",
                    }}
                    className="transaction-item"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={40}
                          style={{
                            backgroundColor: getTransactionColor(
                              transaction.type
                            ),
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                          icon={getTransactionIcon(transaction.type)}
                        />
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text strong style={{ fontSize: "15px" }}>
                            {transaction.artifact?.name || "Hiện vật"}
                          </Text>
                          <Tag
                            color={getTransactionColor(transaction.type)}
                            style={{
                              borderRadius: "12px",
                              fontWeight: 500,
                              margin: 0,
                            }}
                          >
                            {TRANSACTION_LABEL[transaction.type] ||
                              transaction.type}
                          </Tag>
                        </div>
                      }
                      description={
                        <Space
                          direction="vertical"
                          size={6}
                          style={{ marginTop: 8 }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <UserOutlined
                              style={{ fontSize: "12px", color: "#8c8c8c" }}
                            />
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              {transaction.createdBy?.fullName ||
                                "Không xác định"}
                            </Text>
                            <Divider
                              type="vertical"
                              style={{ height: "12px" }}
                            />
                            <ClockCircleOutlined
                              style={{ fontSize: "12px", color: "#8c8c8c" }}
                            />
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              {new Date(transaction.createdAt).toLocaleString(
                                "vi-VN"
                              )}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <NumberOutlined
                                style={{ fontSize: "12px", color: "#8c8c8c" }}
                              />
                              <Text>
                                Số lượng:{" "}
                                <Text strong>
                                  {transaction.type === "ADJUST"
                                    ? `${transaction.previousQuantity} → ${transaction.newQuantity}`
                                    : Math.abs(transaction.quantityChange)}
                                </Text>
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FileTextOutlined
                                style={{ fontSize: "12px", color: "#8c8c8c" }}
                              />
                              <Text style={{ fontSize: "13px" }}>
                                Lý do: {transaction.reason || "Không có"}
                              </Text>
                            </div>
                          </div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Chưa có giao dịch nào
                  </Text>
                }
                style={{ padding: "40px 0" }}
              />
            )}
          </Card>
        </Col>

        {/* Low Stock Items */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="card-title-wrapper">
                <WarningOutlined
                  style={{ color: "#faad14", fontSize: "18px" }}
                />
                <span style={{ fontWeight: 600, marginLeft: 8 }}>
                  Hiện vật sắp hết hàng
                </span>
              </div>
            }
            headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            bodyStyle={{ padding: "16px 8px" }}
            className="dashboard-card"
          >
            {lowStockItems.length > 0 ? (
              <List
                dataSource={lowStockItems}
                size="large"
                renderItem={(item, index) => (
                  <List.Item
                    key={item._id}
                    style={{
                      padding: "12px 16px",
                      borderBottom:
                        index === lowStockItems.length - 1
                          ? "none"
                          : "1px solid #f5f5f5",
                      transition: "all 0.3s",
                      borderRadius: "6px",
                      marginBottom: "4px",
                    }}
                    className="stock-item"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={40}
                          style={{
                            backgroundColor:
                              item.quantity === 0 ? "#ff4d4f" : "#faad14",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                          icon={<WarningOutlined />}
                        />
                      }
                      title={
                        <Link
                          to={`/artifacts/${item._id}`}
                          style={{
                            fontSize: "15px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {item.name}
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            ({item.code})
                          </Text>
                        </Link>
                      }
                      description={
                        <Space
                          direction="vertical"
                          size={12}
                          style={{ marginTop: 8, width: "100%" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <FolderOutlined
                              style={{ fontSize: "12px", color: "#8c8c8c" }}
                            />
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              {item.category?.name || "Chưa phân loại"}
                            </Text>
                          </div>

                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 4,
                              }}
                            >
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                Mức tồn kho
                              </Text>
                              <Text
                                type={
                                  item.quantity === 0 ? "danger" : "warning"
                                }
                                style={{ fontSize: "12px", fontWeight: 500 }}
                              >
                                {item.minStockLevel
                                  ? `${item.quantity} / ${item.minStockLevel}`
                                  : `${item.quantity}`}
                              </Text>
                            </div>
                            <Progress
                              percent={
                                item.minStockLevel
                                  ? Math.min(
                                      (item.quantity / item.minStockLevel) *
                                        100,
                                      100
                                    )
                                  : 0
                              }
                              status={
                                item.quantity === 0
                                  ? "exception"
                                  : item.quantity <=
                                    (item.minStockLevel || 0) * 0.3
                                  ? "active"
                                  : "normal"
                              }
                              strokeColor={
                                item.quantity === 0 ? "#ff4d4f" : "#faad14"
                              }
                              size="small"
                              showInfo={false}
                              style={{ margin: 0 }}
                            />
                          </div>

                          {item.quantity === 0 && (
                            <Alert
                              message={`Cần nhập tối thiểu ${
                                item.minStockLevel || 0
                              }`}
                              type="error"
                              showIcon
                              icon={<ExclamationCircleOutlined />}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                marginTop: "4px",
                              }}
                            />
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Không có hiện vật nào sắp hết hàng
                  </Text>
                }
                style={{ padding: "40px 0" }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      {hasPermission("CREATE_ARTIFACT") && (
        <>
          <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
            Thao tác nhanh
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <QuickAction
                icon={<TrophyOutlined />}
                title="Thêm hiện vật"
                description="Thêm hiện vật mới vào hệ thống"
                color="#1890ff"
                action={() => {
                  window.location.href = "/artifacts?action=create";
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <QuickAction
                icon={<ApartmentOutlined />}
                title="Phòng ban"
                description="Thêm phòng ban mới vào hệ thống"
                color="#52c41a"
                action={() => {
                  window.location.href = "/departments";
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <QuickAction
                icon={<AppstoreOutlined />}
                title="Quản lý danh mục"
                description="Thêm/sửa danh mục hiện vật"
                color="#13c2c2"
                action={() => {
                  window.location.href = "/categories";
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <QuickAction
                icon={<DownloadOutlined />}
                title="Xuất báo cáo"
                description="Xuất báo cáo tổng hợp"
                color="#722ed1"
                action={() => {
                  dashboardApi
                    .exportTransactionsExcel()
                    .then((res) => {
                      const url = window.URL.createObjectURL(
                        new Blob([res.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        `bao_cao_thang_${new Date().getTime()}.xlsx`
                      );
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch(() => {
                      message.error("Xuất báo cáo thất bại");
                    });
                }}
              />
            </Col>
          </Row>
        </>
      )}

      {/* System Status */}
      <Card
        title={
          <Space>
            <CheckCircleOutlined />
            <span>Trạng thái hệ thống</span>
          </Space>
        }
        style={{ borderRadius: 12, marginTop: 16 }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={5}>Hiệu suất hệ thống</Title>
              {performanceData.map((item) => (
                <div key={item.name} style={{ marginBottom: 12 }}>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text>{item.name}</Text>
                    <Text strong>{item.value}%</Text>
                  </Space>
                  <Progress percent={item.value} size="small" status="active" />
                </div>
              ))}
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={5}>Thông tin phiên làm việc</Title>
              <List size="small">
                <List.Item>
                  <Text type="secondary">Người dùng:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {user?.fullName} ({user?.email})
                  </Text>
                </List.Item>
                <List.Item>
                  <Text type="secondary">Vai trò:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {user?.roles?.join(", ") || "User"}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text type="secondary">Đăng nhập lúc:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {new Date().toLocaleTimeString("vi-VN")}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text type="secondary">Phiên bản hệ thống:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    v1.0.0
                  </Text>
                </List.Item>
              </List>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardPage;
