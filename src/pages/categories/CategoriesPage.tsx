/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Tooltip,
  Select,
  Divider,
} from "antd";
import { useSearchParams } from "react-router-dom";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  FolderOutlined,
  SortAscendingOutlined,
  TagOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { categoryApi } from "../../api/categoryApi";
import type { Category } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";

import CategoryTable from "../../components/categories/CategoryTable.tsx";
import CategoryFormModal from "../../components/categories/CategoryFormModal.tsx";
import { normalize } from "../../utils/category.utils";

const { Title, Text } = Typography;
const { Option } = Select;

const CategoriesPage: React.FC = () => {
  const { hasPermission } = useAuth();

  // data state
  const [allData, setAllData] = useState<Category[]>([]);
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  // search
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const debounceRef = useRef<number | undefined>(undefined);

  // pagination (query param)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const vibrantColors = {
    primary: "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    gradientStart: "#8b5cf6",
    gradientEnd: "#3b82f6",
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      const raw: any = res?.data;

      const payload: Category[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setAllData(payload);
      setData(payload);
    } catch (err) {
      console.error(err);
      message.error({
        content: (
          <Space>
            <Text strong style={{ color: vibrantColors.error }}>
              Lỗi tải danh sách danh mục
            </Text>
          </Space>
        ),
        style: {
          background: `linear-gradient(135deg, ${vibrantColors.error}15, ${vibrantColors.error}08)`,
          border: `1px solid ${vibrantColors.error}30`,
          borderRadius: 12,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===================== SEARCH ===================== */
  const onSearchChange = (val: string) => {
    setQ(val);
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      const qNorm = normalize(val);
      if (!qNorm) {
        setData(allData);
        return;
      }

      const filtered = allData.filter(
        (c) =>
          normalize(c.name || "").includes(qNorm) ||
          normalize(c.description || "").includes(qNorm)
      );
      setData(filtered);
    }, 300);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...data].sort((a, b) => {
      if (value === "name") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (value === "createdAt") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      } else if (value === "artifactCount") {
        return (b.artifactCount || 0) - (a.artifactCount || 0);
      }
      return 0;
    });
    setData(sorted);
  };

  const openModal = (category?: Category) => {
    setEditing(category || null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: `linear-gradient(135deg, ${vibrantColors.error}, #dc2626)`,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 6px 24px ${vibrantColors.error}40`,
            }}
          >
            <FolderOutlined style={{ fontSize: 24, color: "#fff" }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: vibrantColors.error }}>
              Xóa danh mục
            </Title>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>
              Hành động này không thể hoàn tác
            </Text>
          </div>
        </div>
      ),
      content: (
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <Card
            style={{
              background: `linear-gradient(135deg, ${vibrantColors.error}08, ${vibrantColors.error}03)`,
              border: `1px solid ${vibrantColors.error}20`,
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 16 }}
          >
            <Space direction="vertical" size={12}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: vibrantColors.error,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Text style={{ color: "white", fontSize: 12, fontWeight: 700 }}>!</Text>
                </div>
                <Text strong style={{ fontSize: 14, color: vibrantColors.error }}>
                  Thông tin quan trọng
                </Text>
              </div>
              <Text style={{ fontSize: 14, lineHeight: 1.6, color: "#4b5563" }}>
                Bạn có chắc chắn muốn xóa danh mục này? Tất cả hiện vật trong danh
                mục sẽ được chuyển sang danh mục mặc định.
              </Text>
            </Space>
          </Card>
        </div>
      ),
      okText: (
        <Space size={8}>
          <FolderOutlined />
          <span style={{ fontWeight: 600 }}>Xóa danh mục</span>
        </Space>
      ),
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
        style: {
          background: `linear-gradient(135deg, ${vibrantColors.error}, #dc2626)`,
          border: "none",
          borderRadius: 10,
          padding: "0 28px",
          height: 44,
          fontWeight: 600,
          boxShadow: `0 4px 16px ${vibrantColors.error}30`,
        },
      },
      cancelButtonProps: {
        style: {
          borderRadius: 10,
          padding: "0 28px",
          height: 44,
          fontWeight: 500,
          border: `1px solid ${vibrantColors.primary}30`,
          color: vibrantColors.primary,
        },
      },
      onOk: async () => {
        try {
          await categoryApi.delete(id);
          message.success({
            content: (
              <Space>
                <Text strong style={{ color: vibrantColors.success, fontSize: 15 }}>
                  Đã xóa danh mục thành công!
                </Text>
              </Space>
            ),
            style: {
              background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.success}08)`,
              border: `1px solid ${vibrantColors.success}30`,
              borderRadius: 12,
            },
          });
          await fetchData();
          if (q) onSearchChange(q);
        } catch (err: any) {
          console.error(err);
          message.error({
            content: (
              <Space>
                <Text strong style={{ color: vibrantColors.error }}>
                  {err?.response?.data?.message || "Xóa thất bại. Vui lòng thử lại."}
                </Text>
              </Space>
            ),
            style: {
              background: `linear-gradient(135deg, ${vibrantColors.error}15, ${vibrantColors.error}08)`,
              border: `1px solid ${vibrantColors.error}30`,
              borderRadius: 12,
            },
          });
        }
      },
      icon: null,
      width: 500,
      bodyStyle: { padding: 24 },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await categoryApi.update(editing._id!, values);
        message.success({
          content: (
            <Space>
              <Text strong style={{ color: vibrantColors.success, fontSize: 15 }}>
                Cập nhật danh mục thành công!
              </Text>
            </Space>
          ),
          style: {
            background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.success}08)`,
            border: `1px solid ${vibrantColors.success}30`,
            borderRadius: 12,
          },
        });
      } else {
        await categoryApi.create(values);
        message.success({
          content: (
            <Space>
              <Text strong style={{ color: vibrantColors.success, fontSize: 15 }}>
                Tạo danh mục thành công!
              </Text>
            </Space>
          ),
          style: {
            background: `linear-gradient(135deg, ${vibrantColors.success}15, ${vibrantColors.success}08)`,
            border: `1px solid ${vibrantColors.success}30`,
            borderRadius: 12,
          },
        });
      }
      setModalOpen(false);
      await fetchData();
      if (q) onSearchChange(q);
    } catch (err: any) {
      console.error(err);
      message.error({
        content: (
          <Space>
            <Text strong style={{ color: vibrantColors.error }}>
              {err?.response?.data?.message || "Lưu danh mục thất bại"}
            </Text>
          </Space>
        ),
        style: {
          background: `linear-gradient(135deg, ${vibrantColors.error}15, ${vibrantColors.error}08)`,
          border: `1px solid ${vibrantColors.error}30`,
          borderRadius: 12,
        },
      });
    }
  };

  /* ===================== TABLE ===================== */
  const handleTableChange = (pagination: any) => {
    setSearchParams({ page: pagination.current.toString() });
  };

  // Stats
  const totalCategories = allData.length;


  /* ===================== RENDER ===================== */
  return (
    <div style={{ 
      padding: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background Decorations */}
      <div style={{
        position: "absolute",
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${vibrantColors.primary}10 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />
      
      <div style={{
        position: "absolute",
        bottom: -150,
        left: -150,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${vibrantColors.info}10 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: 20,
            boxShadow: `0 10px 40px ${vibrantColors.primary}15`,
            border: `2px solid ${vibrantColors.primary}20`,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            position: "relative",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${vibrantColors.primary}15, transparent 70%)`,
            borderRadius: "50%",
            transform: "translate(30%, -30%)",
            pointerEvents: "none",
          }} />

          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 32px ${vibrantColors.primary}40`,
                  }}
                >
                  <TagOutlined style={{ fontSize: 32, color: "#fff" }} />
                </div>
                <div>
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Quản lý danh mục
                  </Title>
                  <Text 
                    type="secondary" 
                    style={{ 
                      marginTop: 8, 
                      display: "block",
                      fontSize: 15,
                      color: vibrantColors.primary,
                      fontWeight: 500,
                    }}
                  >
                    <DatabaseOutlined style={{ marginRight: 8 }} />
                    Quản lý và phân loại các danh mục hiện vật trong bảo tàng
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <Statistic
                  title={
                    <Space size={6}>
                      <FolderOutlined style={{ color: vibrantColors.primary }} />
                      <Text style={{ color: vibrantColors.primary, fontWeight: 600 }}>
                        Tổng danh mục
                      </Text>
                    </Space>
                  }
                  value={totalCategories}
                  valueStyle={{ 
                    fontSize: 32, 
                    fontWeight: 800,
                    color: vibrantColors.primary,
                  }}
                  
                />

                <Divider type="vertical" style={{ height: 60, margin: 0 }} />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Action Card */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 20,
            border: `2px solid ${vibrantColors.primary}20`,
            boxShadow: `0 8px 32px ${vibrantColors.primary}10`,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
          }}
          bodyStyle={{ padding: "24px 28px" }}
        >
          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} md={12}>
              <Space size={16} wrap>
                {hasPermission("CREATE_ARTIFACT") && (
                  <Button
                    type="primary"
                    onClick={() => openModal()}
                    icon={<PlusOutlined />}
                    style={{
                      background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                      border: "none",
                      borderRadius: 12,
                      height: 48,
                      padding: "0 28px",
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: `0 8px 24px ${vibrantColors.primary}30`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 12px 32px ${vibrantColors.primary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 8px 24px ${vibrantColors.primary}30`;
                    }}
                  >
                    Thêm danh mục mới
                  </Button>
                )}

                <Tooltip 
                  title="Làm mới dữ liệu" 
                  color={vibrantColors.info}
                >
                  <Button
                    icon={<ReloadOutlined style={{ fontSize: 18 }} />}
                    onClick={fetchData}
                    loading={loading}
                    style={{
                      borderRadius: 12,
                      height: 48,
                      width: 48,
                      border: `1px solid ${vibrantColors.primary}30`,
                      background: `linear-gradient(135deg, ${vibrantColors.primary}08, ${vibrantColors.primary}03)`,
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotate(180deg)";
                      e.currentTarget.style.borderColor = vibrantColors.primary;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${vibrantColors.primary}15, ${vibrantColors.primary}08)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "rotate(0)";
                      e.currentTarget.style.borderColor = `${vibrantColors.primary}30`;
                      e.currentTarget.style.background = `linear-gradient(135deg, ${vibrantColors.primary}08, ${vibrantColors.primary}03)`;
                    }}
                  />
                </Tooltip>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <Input
                  placeholder="Tìm theo tên hoặc mô tả..."
                  value={q}
                  onChange={(e) => onSearchChange(e.target.value)}
                  allowClear
                  prefix={<SearchOutlined style={{ color: vibrantColors.primary }} />}
                  style={{
                    width: 300,
                    borderRadius: 12,
                    border: `2px solid ${vibrantColors.primary}30`,
                    padding: "12px 16px",
                    height: 48,
                    fontSize: 15,
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

                <Select
                  placeholder="Sắp xếp"
                  value={sortBy}
                  onChange={handleSortChange}
                  suffixIcon={<SortAscendingOutlined style={{ color: vibrantColors.primary }} />}
                  style={{ 
                    width: 160, 
                    borderRadius: 12,
                    border: `2px solid ${vibrantColors.primary}30`,
                  }}
                  size="large"
                  dropdownStyle={{
                    borderRadius: 12,
                    border: `1px solid ${vibrantColors.primary}20`,
                    boxShadow: `0 8px 32px ${vibrantColors.primary}15`,
                  }}
                >
                  <Option value="name">Tên A-Z</Option>
                  <Option value="createdAt">Mới nhất</Option>
                </Select>
              </div>
            </Col>
          </Row>

          {/* Search Results Info */}
          {q && (
            <div style={{ 
              marginTop: 20,
              padding: "16px",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${vibrantColors.success}10, ${vibrantColors.success}05)`,
              border: `1px solid ${vibrantColors.success}30`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Space>
                  <ClockCircleOutlined style={{ color: vibrantColors.success }} />
                  <Text style={{ color: vibrantColors.success, fontWeight: 600 }}>
                    Tìm thấy <Text strong style={{ fontSize: 18 }}>{data.length}</Text> danh mục phù hợp với từ
                    khóa "{q}"
                  </Text>
                </Space>
                <Button
                  type="link"
                  onClick={() => {
                    setQ("");
                    setData(allData);
                  }}
                  style={{ 
                    color: vibrantColors.error,
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: 8,
                  }}
                >
                  Xóa tìm kiếm
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Table Section */}
        <Card
          style={{
            borderRadius: 20,
            border: `2px solid ${vibrantColors.primary}20`,
            boxShadow: `0 8px 40px ${vibrantColors.primary}10`,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            position: "relative",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${vibrantColors.info}10, transparent 70%)`,
            borderRadius: "50%",
            transform: "translate(-30%, 30%)",
            pointerEvents: "none",
          }} />
          
          <CategoryTable
            data={data}
            loading={loading}
            page={page}
            onEdit={openModal}
            onDelete={handleDelete}
            onChange={handleTableChange}
          />
        </Card>

        {/* Form Modal */}
        <CategoryFormModal
          open={modalOpen}
          editing={editing}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;