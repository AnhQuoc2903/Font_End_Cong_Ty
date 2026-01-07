/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/DepartmentPage.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  message,
  Space,
  Typography,
  Input,
  Row,
  Col,
  Tag,
  Grid,
  theme,
} from "antd";
import {
  PlusOutlined,
  TeamOutlined,
  SearchOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

import { departmentApi } from "../../api/departmentApi";
import DepartmentTable from "../../components/departments/DepartmentTable";
import DepartmentForm from "../../components/departments/DepartmentForm";
import { useAuth } from "../../context/AuthContext";
import "./DepartmentPage.css";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type Department = {
  _id: string;
  name: string;
  isActive: boolean;
  description?: string;
};

const PAGE_SIZE = 10;

const DepartmentPage: React.FC = () => {
  const [allData, setAllData] = useState<Department[]>([]);
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form] = Form.useForm();

  const { token } = theme.useToken();
  const screens = useBreakpoint();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const q = (searchParams.get("q") || "").toLowerCase();

  const { hasPermission } = useAuth();
  const canManage = hasPermission("ADMIN_PANEL");

  /* ===== FETCH 1 LẦN ===== */
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentApi.getAll();
      setAllData(res.data || []);
    } catch {
      message.error("Không tải được danh sách phòng ban");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  /* ===== SEARCH + PAGINATION (FRONTEND) ===== */
  useEffect(() => {
    const filtered = allData.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.description?.toLowerCase() || "").includes(q)
    );

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    setData(filtered.slice(start, end));
  }, [allData, page, q]);

  const total = allData.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      (d.description?.toLowerCase() || "").includes(q)
  ).length;

  const activeCount = allData.filter((d) => d.isActive).length;
  const inactiveCount = allData.length - activeCount;

  /* ===== ACTIONS ===== */
  const openModal = (dept?: Department) => {
    setEditing(dept || null);
    setModalOpen(true);
    form.resetFields();
    if (dept) {
      form.setFieldsValue({
        name: dept.name,
        description: dept.description,
        isActive: dept.isActive,
      });
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (editing) {
        await departmentApi.update(editing._id, values);
        message.success("Cập nhật phòng ban thành công");
      } else {
        await departmentApi.create(values);
        message.success("Tạo phòng ban thành công");
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi xử lý phòng ban");
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa phòng ban này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await departmentApi.remove(id);
          message.success("Đã xóa phòng ban thành công");
          fetchDepartments();
        } catch {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await departmentApi.update(id, { isActive });
      message.success(`Đã ${isActive ? "kích hoạt" : "vô hiệu hóa"} phòng ban`);
      fetchDepartments();
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: String(newPage),
      q,
    });
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header Section */}
      <Card
        style={{
         
          background: `linear-gradient(135deg, ${token.colorPrimary}15 0%, ${token.colorPrimary}05 100%)`,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
        bordered={false}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={0}>
              <Space align="center">
                <div
                  style={{
                    background: token.colorPrimary,
                    borderRadius: token.borderRadius,
                    padding: 8,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TeamOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <Title level={3} style={{ margin: 0 }}>
                  Quản lý phòng ban
                </Title>
              </Space>
              <Text type="secondary" style={{ marginLeft: 40 }}>
                Quản lý và theo dõi các phòng ban trong tổ chức
              </Text>
            </Space>
          </Col>

          {canManage && (
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                size={screens.xs ? "middle" : "large"}
                style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: 8,
                    height: 40,
                    padding: "0 20px",
                    fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                  }}
              >
                {screens.xs ? "Thêm" : "Thêm phòng ban"}
              </Button>
            </Col>
          )}
        </Row>
        <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
          {/* Card Tổng số phòng ban */}
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: "none",
                background: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                position: "relative",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "24px", position: "relative", zIndex: 2 }}
              className="stats-card"
            >
              {/* Background glow effect on hover */}
              <div
                className="card-glow"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, #1890ff10 0%, transparent 70%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }}
              />

              {/* Animated border */}
              <div
                className="card-border-animation"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 16,
                  padding: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #1890ff40, transparent)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* Left side - Title and info */}
                <div style={{ flex: 1 }}>
                  <div >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        className="icon-container"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#1890ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <HomeOutlined
                          style={{
                            fontSize: 16,
                            color: "white",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                      <Text strong style={{ fontSize: 16, color: "#1d1d1d" }}>
                        Tổng số phòng ban
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, marginLeft: 40 }}
                    >
                      Tất cả phòng ban trong hệ thống
                    </Text>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
                  >
                    <Title
                      level={2}
                      className="count-number"
                      style={{
                        margin: 0,
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#1890ff",
                        lineHeight: 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {allData.length}
                    </Title>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 16,
                        marginBottom: 8,
                        transition: "all 0.3s ease",
                      }}
                    >
                      phòng ban
                    </Text>
                  </div>
                </div>

                {/* Right side - Icon with animation */}
                <div style={{ textAlign: "right" }}>
                  <div
                    className="floating-icon"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background: "#1890ff15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "auto",
                      marginBottom: 8,
                      transition: "all 0.5s ease",
                      animation: "float 3s ease-in-out infinite",
                    }}
                  >
                    <HomeOutlined
                      style={{
                        fontSize: 24,
                        color: "#1890ff",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <div>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 2 }}
                  >
                    Trạng thái
                  </Text>
                  <Text strong style={{ fontSize: 14, color: "#1d1d1d" }}>
                    {activeCount} đang hoạt động
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 2 }}
                  >
                    Tỷ lệ
                  </Text>
                  <Tag
                    className="percentage-tag"
                    color="blue"
                    style={{
                      margin: 0,
                      borderRadius: 12,
                      padding: "2px 8px",
                      fontSize: 11,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {allData.length > 0
                        ? Math.round((activeCount / allData.length) * 100)
                        : 0}
                      %
                    </span>
                    <span
                      className="tag-glow"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        transition: "left 0.5s ease",
                      }}
                    />
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>

          {/* Card Đang hoạt động */}
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: "none",
                background: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                position: "relative",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "24px", position: "relative", zIndex: 2 }}
              className="stats-card"
            >
              {/* Background glow effect on hover */}
              <div
                className="card-glow"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, #52c41a10 0%, transparent 70%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }}
              />

              {/* Animated border */}
              <div
                className="card-border-animation"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 16,
                  padding: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #52c41a40, transparent)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* Left side - Title and info */}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        className="icon-container"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#52c41a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <CheckCircleOutlined
                          style={{
                            fontSize: 16,
                            color: "white",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                      <Text strong style={{ fontSize: 16, color: "#1d1d1d" }}>
                        Đang hoạt động
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, marginLeft: 40 }}
                    >
                      Phòng ban đang hoạt động
                    </Text>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
                  >
                    <Title
                      level={2}
                      className="count-number"
                      style={{
                        margin: 0,
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#52c41a",
                        lineHeight: 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {activeCount}
                    </Title>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 16,
                        marginBottom: 8,
                        transition: "all 0.3s ease",
                      }}
                    >
                      phòng ban
                    </Text>
                  </div>
                </div>

                {/* Right side - Icon with animation */}
                <div style={{ textAlign: "right" }}>
                  <div
                    className="floating-icon"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background: "#52c41a15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "auto",
                      marginBottom: 8,
                      transition: "all 0.5s ease",
                      animation: "float 3s ease-in-out infinite 0.5s",
                    }}
                  >
                    <CheckCircleOutlined
                      style={{
                        fontSize: 24,
                        color: "#52c41a",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <div>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 2 }}
                  >
                    Trạng thái
                  </Text>
                  <Text strong style={{ fontSize: 14, color: "#1d1d1d" }}>
                    Hoạt động tốt
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 2 }}
                  >
                    So với tổng
                  </Text>
                  <Tag
                    className="percentage-tag"
                    color="success"
                    style={{
                      margin: 0,
                      borderRadius: 12,
                      padding: "2px 8px",
                      fontSize: 11,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {allData.length > 0
                        ? Math.round((activeCount / allData.length) * 100)
                        : 0}
                      %
                    </span>
                    <span
                      className="tag-glow"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        transition: "left 0.5s ease",
                      }}
                    />
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>

          {/* Card Ngừng hoạt động */}
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: "none",
                background: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                position: "relative",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "24px", position: "relative", zIndex: 2 }}
              className="stats-card"
            >
              {/* Background glow effect on hover */}
              <div
                className="card-glow"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, #faad1410 0%, transparent 70%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }}
              />

              {/* Animated border */}
              <div
                className="card-border-animation"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 16,
                  padding: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #faad1440, transparent)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* Left side - Title and info */}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        className="icon-container"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#faad14",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <PauseCircleOutlined
                          style={{
                            fontSize: 16,
                            color: "white",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                      <Text strong style={{ fontSize: 16, color: "#1d1d1d" }}>
                        Ngừng hoạt động
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, marginLeft: 40 }}
                    >
                      Phòng ban đã ngừng hoạt động
                    </Text>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
                  >
                    <Title
                      level={2}
                      className="count-number"
                      style={{
                        margin: 0,
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#faad14",
                        lineHeight: 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {inactiveCount}
                    </Title>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 16,
                        marginBottom: 8,
                        transition: "all 0.3s ease",
                      }}
                    >
                      phòng ban
                    </Text>
                  </div>
                </div>

                {/* Right side - Icon with animation */}
                <div style={{ textAlign: "right" }}>
                  <div
                    className="floating-icon"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background: "#faad1415",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "auto",
                      marginBottom: 8,
                      transition: "all 0.5s ease",
                      animation: "float 3s ease-in-out infinite 1s",
                    }}
                  >
                    <PauseCircleOutlined
                      style={{
                        fontSize: 24,
                        color: "#faad14",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <div>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 2 }}
                  >
                    Trạng thái
                  </Text>
                  <Text strong style={{ fontSize: 14, color: "#1d1d1d" }}>
                    Đã ngừng hoạt động
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 2 }}
                  >
                    So với tổng
                  </Text>
                  <Tag
                    className="percentage-tag"
                    color="warning"
                    style={{
                      margin: 0,
                      borderRadius: 12,
                      padding: "2px 8px",
                      fontSize: 11,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {allData.length > 0
                        ? Math.round((inactiveCount / allData.length) * 100)
                        : 0}
                      %
                    </span>
                    <span
                      className="tag-glow"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        transition: "left 0.5s ease",
                      }}
                    />
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Search and Filter Section */}
      <Card
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm phòng ban theo tên hoặc mô tả..."
              prefix={<SearchOutlined />}
              allowClear
              size="large"
              defaultValue={q}
              onChange={(e) =>
                setSearchParams({
                  page: "1",
                  q: e.target.value,
                })
              }
              style={{
                maxWidth: 400,
                borderRadius: token.borderRadius,
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowTertiary,
          minHeight: 400,
        }}
        bodyStyle={{ padding: screens.xs ? 16 : 24 }}
      >
        <DepartmentTable
          data={data}
          loading={loading}
          currentPage={page}
          total={total}
          canManage={canManage}
          onEdit={openModal}
          onDelete={handleDelete}
          onToggle={handleToggleActive}
          onPageChange={handlePageChange}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        title={
          <Space>
            {editing ? <EditOutlined /> : <PlusOutlined />}
            <span>
              {editing ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
            </span>
          </Space>
        }
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
        okText={editing ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
        styles={{
          header: {
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            
            paddingBottom: 8,
          },
        }}
      >
        <div style={{ margin: "24px 0" }}>
          <DepartmentForm form={form} onFinish={onFinish} editing={editing} />
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentPage;
