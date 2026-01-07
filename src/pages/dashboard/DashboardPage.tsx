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
  InboxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PieChartOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
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
  quantity: number;
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
      let recentTransactionsList: RecentTransaction[] = [];
      let totalTransactions = 0;
      let importCount = 0;
      let exportCount = 0;

      if (artifacts.length > 0) {
        try {
          // Get transactions for the first few artifacts
          const artifactIds = artifacts.slice(0, 3).map((a: any) => a._id);
          const transactionsPromises = artifactIds.map((id: string) =>
            artifactApi.getTransactions(id).catch(() => ({ data: [] }))
          );

          const transactionsResults = await Promise.all(transactionsPromises);
          recentTransactionsList = transactionsResults
            .flatMap((res: any) => res.data || [])
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 10);

          // Count transaction types
          recentTransactionsList.forEach((transaction: RecentTransaction) => {
            totalTransactions++;
            if (transaction.type === "IMPORT") importCount++;
            if (transaction.type === "EXPORT") exportCount++;
          });
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
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
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    prefix?: string;
    suffix?: string;
    trend?: number;
    loading?: boolean;
  }) => (
    <Card
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
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={{ margin: 0 }}>
              Chào mừng trở lại, {user?.fullName || "Quản trị viên"}!
            </Title>
            <Text type="secondary">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Space>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Link to="/artifacts" style={{ textDecoration: "none" }}>
            <StatCard
              title="Tổng hiện vật"
              value={stats.totalArtifacts}
              icon={<TrophyOutlined />}
              color="#1890ff"
              trend={stats.growthRate}
              loading={loading}
            />
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <StatCard
              title="Danh mục"
              value={stats.totalCategories}
              icon={<AppstoreOutlined />}
              color="#52c41a"
              loading={loading}
            />
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <StatCard
              title="Người dùng"
              value={stats.totalUsers}
              icon={<TeamOutlined />}
              color="#722ed1"
              loading={loading}
            />
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Link to="/departments" style={{ textDecoration: "none" }}>
            <StatCard
              title="Phòng ban"
              value={stats.totalDepartments}
              icon={<ApartmentOutlined />}
              color="#fa8c16"
              loading={loading}
            />
          </Link>
        </Col>
      </Row>

      {/* Second Row Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Link to="/artifacts" style={{ textDecoration: "none" }}>
            <StatCard
              title="Hàng tồn thấp"
              value={stats.lowStockArtifacts}
              icon={<WarningOutlined />}
              color="#f5222d"
              loading={loading}
            />
          </Link>
        </Col>
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
            title="Nhập / Xuất"
            value={`${stats.importCount} / ${stats.exportCount}`}
            icon={<InboxOutlined />}
            color="#eb2f96"
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
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Recent Transactions */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <HistoryOutlined />
                <span>Giao dịch gần đây</span>
              </Space>
            }
          >
            {recentTransactions.length > 0 ? (
              <List
                dataSource={recentTransactions}
                renderItem={(transaction) => (
                  <List.Item key={transaction._id}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: getTransactionColor(
                              transaction.type
                            ),
                          }}
                        >
                          {getTransactionIcon(transaction.type)}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>
                            {transaction.artifact?.name || "Hiện vật"}
                          </Text>

                          <Tag color={getTransactionColor(transaction.type)}>
                            {transaction.type}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            {transaction.createdBy?.fullName ||
                              "Không xác định"}{" "}
                            •{" "}
                            {new Date(transaction.createdAt).toLocaleString(
                              "vi-VN"
                            )}
                          </Text>

                          <Text>
                            Số lượng: {transaction.quantity} • Lý do:{" "}
                            {transaction.reason || "Không có"}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Text type="secondary">Chưa có giao dịch nào</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Low Stock Items */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <WarningOutlined />
                <span>Hiện vật sắp hết hàng</span>
              </Space>
            }
          >
            {lowStockItems.length > 0 ? (
              <List
                dataSource={lowStockItems}
                renderItem={(item) => (
                  <List.Item key={item._id}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: "#f5222d",
                          }}
                        >
                          <WarningOutlined />
                        </Avatar>
                      }
                      title={
                        <Link to={`/artifacts/${item._id}`}>
                          {item.name} ({item.code})
                        </Link>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            Danh mục: {item.category?.name ?? "Chưa phân loại"}
                          </Text>
                          <Progress
                            percent={
                              item.minStockLevel
                                ? Math.min(
                                    (item.quantity / item.minStockLevel) * 100,
                                    100
                                  )
                                : 0
                            }
                            status={
                              item.quantity === 0 ? "exception" : "active"
                            }
                            size="small"
                            showInfo={false}
                          />

                          <Text
                            type={item.quantity === 0 ? "danger" : "warning"}
                            style={{ fontSize: 12 }}
                          >
                            {item.quantity === 0
                              ? `Hết hàng – cần nhập tối thiểu ${
                                  item.minStockLevel ?? 0
                                }`
                              : item.minStockLevel
                              ? `Còn ${item.quantity} / tối thiểu ${item.minStockLevel}`
                              : `Còn ${item.quantity}`}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Text type="secondary">Không có hiện vật nào sắp hết hàng</Text>
              </div>
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
                icon={<InboxOutlined />}
                title="Nhập kho"
                description="Nhập hiện vật vào kho"
                color="#52c41a"
                action={() => {
                  window.location.href = "/artifacts?action=import";
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
