/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Input,
  Space,
  message,
  Row,
  Col,
  Divider,
  Form,
  Modal,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  FilterOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { roleApi } from "../../api/roleApi";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import type { RoleRow, Permission } from "../../components/roles/types";
import RoleHeader from "../../components/roles/RoleHeader";
import RoleStatsCard from "../../components/roles/RoleStatsCard";
import RoleTable from "../../components/roles/RoleTable";
import RoleModal from "../../components/roles/RoleModal";
import "./role.css";

const RolesPage: React.FC = () => {
  const [data, setData] = useState<RoleRow[]>([]);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleRow | null>(null);
  const [form] = Form.useForm();
  const { hasPermission } = useAuth();

  const canManage = hasPermission("ADMIN_PANEL");

  const [q, setQ] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        roleApi.getAll(),
        roleApi.getPermissions(),
      ]);
      setData(rolesRes.data || []);
      setPerms(permsRes.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được roles/permissions");
    } finally {
      setLoading(false);
    }
  };

  const searchRoles = async (query = "") => {
    try {
      setLoading(true);
      const res = query
        ? await roleApi.search(query, { limit: 200 })
        : await roleApi.getAll();
      const payload = res.data?.data ?? res.data;
      setData(payload || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tìm vai trò");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onSearchChange = (val: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setQ(val);
      searchRoles(val);
    }, 350);
  };

  const openModal = (role?: RoleRow) => {
    setEditing(role || null);
    setModalOpen(true);
    form.resetFields();
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissionIds: (role.permissions || []).map((p) => p._id),
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await roleApi.update(editing._id, {
          name: values.name,
          description: values.description,
          permissionIds: values.permissionIds || [],
        });
        message.success("Cập nhật role thành công");
      } else {
        await roleApi.create({
          name: values.name,
          description: values.description,
          permissionIds: values.permissionIds || [],
        });
        message.success("Tạo role thành công");
      }
      setModalOpen(false);
      searchRoles(q);
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Lỗi xử lý");
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      centered: true,
      width: 480,
      okType: "danger",
      okText: "Xóa vai trò",
      cancelText: "Hủy",
      icon: null, // bỏ icon mặc định để custom
      title: (
        <Space align="center">
          <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            Xác nhận xóa vai trò
          </span>
        </Space>
      ),
      content: (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              background: "#fff1f0",
              border: "1px solid #ffccc7",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Space align="start">
              <DeleteOutlined style={{ color: "#ff4d4f" }} />
              <div>
                <div style={{ fontWeight: 600, color: "#cf1322" }}>
                  Hành động nguy hiểm
                </div>
                <div style={{ color: "#595959", fontSize: 13 }}>
                  Vai trò này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </div>
              </div>
            </Space>
          </div>

          <ul style={{ paddingLeft: 18, color: "#595959", fontSize: 14 }}>
            <li>Người dùng đang gán vai trò này sẽ bị ảnh hưởng</li>
            <li>Các phân quyền liên quan sẽ không còn hiệu lực</li>
          </ul>

          <div style={{ marginTop: 12, fontWeight: 500 }}>
            Bạn có chắc chắn muốn tiếp tục?
          </div>
        </div>
      ),
      onOk: async () => {
        try {
          await roleApi.remove(id);
          message.success({
            content: "Đã xóa vai trò thành công",
            duration: 3,
          });
          searchRoles(q);
        } catch (err: any) {
          console.error(err);
          message.error(err?.response?.data?.message || "Xóa thất bại");
        }
      },
    });
  };

  const page = parseInt(searchParams.get("page") || "1", 10);

  const handleTableChange = (pagination: any) => {
    setSearchParams({ page: pagination.current.toString() });
  };

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <RoleHeader
          title="Quản lý Vai trò & Phân quyền"
          description="Quản lý và phân quyền cho các vai trò trong hệ thống"
          totalRoles={data.length}
        />

        <div style={{ padding: 32 }}>
          {/* Search and Actions */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 24 }}
          >
            <Col>
              <Input
                placeholder="Tìm kiếm vai trò..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                suffix={<FilterOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  width: 320,
                  borderRadius: 8,
                  borderColor: "#d9d9d9",
                }}
                size="large"
              />
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<TeamOutlined />}
                  onClick={fetchAll}
                  style={{
                    borderRadius: 8,
                    border: "none",
                    height: 40,
                    padding: "0 20px",
                    fontWeight: 600,
                  }}
                >
                  Làm mới
                </Button>
                {canManage && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
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
                    Tạo vai trò mới
                  </Button>
                )}
              </Space>
            </Col>
          </Row>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <RoleStatsCard
              title="Tổng vai trò"
              value={data.length}
              unit="vai trò"
              color="#1890ff"
              backgroundColor="#f0f9ff"
              borderColor="#bae0ff"
            />
            <RoleStatsCard
              title="Tổng quyền hệ thống"
              value={perms.length}
              unit="quyền"
              color="#52c41a"
              backgroundColor="#f6ffed"
              borderColor="#b7eb8f"
            />
          </div>

          <Divider style={{ margin: "16px 0 24px" }} />

          {/* Table */}
          <RoleTable
            data={data}
            loading={loading}
            page={page}
            canManage={canManage}
            onEdit={openModal}
            onDelete={handleDelete}
            onPageChange={handleTableChange}
          />
        </div>
      </Card>

      <RoleModal
        open={modalOpen}
        editing={editing}
        permissions={perms}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
      />
    </div>
  );
};

export default RolesPage;
