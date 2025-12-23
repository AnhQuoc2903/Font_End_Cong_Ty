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
} from "antd";
import { useSearchParams } from "react-router-dom";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";

import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/categoryApi";
import { useAuth } from "../context/AuthContext";

import CategoryTable from "../components/categories/CategoryTable.tsx";
import CategoryFormModal from "../components/categories/CategoryFormModal.tsx";
import { normalize } from "../utils/category.utils";

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
        content: "Lỗi tải danh sách danh mục",
        duration: 4,
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FolderAddOutlined style={{ fontSize: 18, color: "#fff" }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Xóa danh mục
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Hành động này không thể hoàn tác
            </Text>
          </div>
        </div>
      ),
      content: (
        <div style={{ marginTop: 16 }}>
          <Text>
            Bạn có chắc chắn muốn xóa danh mục này? Tất cả hiện vật trong danh
            mục sẽ được chuyển sang danh mục mặc định.
          </Text>
        </div>
      ),
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
        style: {
          background: "#ff4d4f",
          border: "none",
          borderRadius: 8,
          padding: "0 24px",
          height: 36,
        },
      },
      cancelButtonProps: {
        style: {
          borderRadius: 8,
          padding: "0 24px",
          height: 36,
        },
      },
      onOk: async () => {
        try {
          await categoryApi.delete(id);
          message.success({
            content: "Đã xóa danh mục thành công",
            icon: <FolderAddOutlined />,
          });
          await fetchData();
          if (q) onSearchChange(q);
        } catch (err: any) {
          console.error(err);
          message.error({
            content:
              err?.response?.data?.message || "Xóa thất bại. Vui lòng thử lại.",
            duration: 5,
          });
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await categoryApi.update(editing._id!, values);
        message.success({
          content: "Cập nhật danh mục thành công",
          icon: <FolderAddOutlined />,
        });
      } else {
        await categoryApi.create(values);
        message.success({
          content: "Tạo danh mục thành công",
          icon: <FolderAddOutlined />,
        });
      }
      setModalOpen(false);
      await fetchData();
      if (q) onSearchChange(q);
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err?.response?.data?.message || "Lưu danh mục thất bại",
        duration: 5,
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
    <div style={{ padding: 0 }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
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
                  }}
                >
                  <FolderAddOutlined style={{ fontSize: 24, color: "#fff" }} />
                </div>
                <span>Quản lý danh mục</span>
              </Title>
              <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
                Quản lý và phân loại các danh mục hiện vật trong bảo tàng
              </Text>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}
            >
              <Statistic
                title="Tổng danh mục"
                value={totalCategories}
                prefix={<FolderAddOutlined style={{ color: "#667eea" }} />}
                style={{ textAlign: "center" }}
                valueStyle={{ fontSize: 24, fontWeight: 700 }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space size={16} wrap>
              {hasPermission("CREATE_ARTIFACT") && (
                <Button
                  type="primary"
                  onClick={() => openModal()}
                  icon={<PlusOutlined />}
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
                  Thêm danh mục
                </Button>
              )}

              <Tooltip title="Làm mới dữ liệu">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  loading={loading}
                  style={{
                    borderRadius: 8,
                    height: 40,
                    width: 40,
                  }}
                />
              </Tooltip>
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <Input
                placeholder="Tìm theo tên hoặc mô tả..."
                value={q}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                style={{
                  width: 280,
                  borderRadius: 8,
                  border: "1px solid #d9d9d9",
                }}
                size="large"
              />

              <Space>
                <Select
                  placeholder="Sắp xếp"
                  value={sortBy}
                  onChange={handleSortChange}
                  suffixIcon={<FilterOutlined />}
                  style={{ width: 140, borderRadius: 8 }}
                  size="large"
                >
                  <Option value="name">Tên A-Z</Option>
                  <Option value="createdAt">Mới nhất</Option>
                </Select>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Search Results Info */}
        {q && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Tìm thấy <Text strong>{data.length}</Text> danh mục phù hợp với từ
              khóa "{q}"
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setQ("");
                  setData(allData);
                }}
                style={{ marginLeft: 8 }}
              >
                Xóa tìm kiếm
              </Button>
            </Text>
          </div>
        )}
      </Card>

      {/* Table Section */}
      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
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
  );
};

export default CategoriesPage;
