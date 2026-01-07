/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Button,
  Modal,
  Space,
  message,
  Card,
  Row,
  Col,
  Input,
  Typography,
  Form,
  Avatar,
  Statistic,
  Divider,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  UserOutlined,
  TeamOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { userApi } from "../../api/userApi";
import { roleApi } from "../../api/roleApi";
import { useAuth } from "../../context/AuthContext";
import { departmentApi } from "../../api/departmentApi";
import { useSearchParams } from "react-router-dom";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import UserActivityModal from "../../components/users/UserActivityModal";

const { Title, Text } = Typography;

type Department = {
  _id: string;
  name: string;
  isActive: boolean;
};

type Role = { _id: string; name: string };
export type UserRow = {
  _id: string;
  email: string;
  fullName?: string;
  isActive?: boolean;
  roles?: Role[];
  department?: Department;
};

const UsersPage: React.FC = () => {
  const [data, setData] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [searchParams] = useSearchParams();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [historyUserId, setHistoryUserId] = useState<string | undefined>();
  const [historyOpen, setHistoryOpen] = useState(false);

  const activeDepartments = departments.filter((d) => d.isActive);

  const departmentsForForm = useMemo(() => {
    if (!editing) return activeDepartments;

    const currentDept = editing.department;
    if (!currentDept) return activeDepartments;

    const exists = activeDepartments.some((d) => d._id === currentDept._id);

    if (exists) return activeDepartments;

    // 👇 thêm phòng ban inactive hiện tại của user
    return [...activeDepartments, currentDept];
  }, [editing, activeDepartments]);

  const [form] = Form.useForm();
  const { hasPermission } = useAuth();

  const canManage = hasPermission("ADMIN_PANEL");

  // Thống kê
  const activeUsers = data.filter((user) => user.isActive).length;
  const adminUsers = data.filter((user) =>
    user.roles?.some((role) => role.name === "Admin")
  ).length;

  // search
  const [q, setQ] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, deptRes] = await Promise.all([
        userApi.getAll(),
        roleApi.getAll(),
        departmentApi.getAll(),
      ]);
      setData(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const page = parseInt(searchParams.get("page") || "1", 10);

  const handleTableChange = (pagination: any) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", pagination.current.toString());
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  const searchUsers = async (query = "") => {
    try {
      setLoading(true);
      const res = query
        ? await userApi.search(query, { limit: 200 })
        : await userApi.getAll();
      const payload = res.data?.data ?? res.data;
      setData(payload || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tìm người dùng");
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
      searchUsers(val);
    }, 350);
  };

  const openModal = (user?: UserRow) => {
    setEditing(user || null);
    setModalOpen(true);
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive ?? true,
        roleIds: (user.roles || []).map((r) => r._id),
        departmentId: user.department?._id,
      });
    } else {
      form.setFieldsValue({ isActive: true });
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (editing) {
        await userApi.update(editing._id, {
          fullName: values.fullName,
          roleIds: values.roleIds || [],
          departmentId: values.departmentId,
          isActive: values.isActive,
        });
        message.success("Cập nhật người dùng thành công");
      } else {
        await userApi.create({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          roleIds: values.roleIds || [],
          departmentId: values.departmentId,
        });
        message.success("Tạo người dùng thành công");
      }
      setModalOpen(false);
      searchUsers(q);
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Lỗi xử lý người dùng");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userApi.remove(id);
      message.success("Đã xóa người dùng");
      searchUsers(q);
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleEdit = (record: UserRow) => {
    openModal(record);
  };
  const openHistory = (userId: string) => {
    setHistoryUserId(userId);
    setHistoryOpen(true);
  };

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Header với thống kê */}
      <div
        style={{
          marginBottom: 32,
          padding: 24,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 12,
          color: "white",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Space align="center">
                <Avatar
                  size={48}
                  icon={<TeamOutlined />}
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
                <div>
                  <Title level={3} style={{ color: "white", margin: 0 }}>
                    Quản lý người dùng
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Quản lý và phân quyền người dùng hệ thống
                  </Text>
                </div>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space size={40}>
              <Statistic
                title="Tổng người dùng"
                value={data.length}
                valueStyle={{ color: "white", fontSize: 32 }}
                prefix={<UserOutlined />}
              />
              <Divider
                type="vertical"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              />
              <Statistic
                title="Đang hoạt động"
                value={activeUsers}
                valueStyle={{ color: "#52c41a", fontSize: 32 }}
              />
              <Divider
                type="vertical"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              />
              <Statistic
                title="Quản trị viên"
                value={adminUsers}
                valueStyle={{ color: "#faad14", fontSize: 32 }}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Phần nội dung chính */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          background: "white",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Thanh công cụ */}
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Input
                  placeholder="Tìm kiếm theo email, tên..."
                  prefix={<SearchOutlined />}
                  suffix={
                    <FilterOutlined
                      style={{ color: "#8c8c8c", fontSize: 12 }}
                    />
                  }
                  allowClear
                  onChange={(e) => onSearchChange(e.target.value)}
                  style={{
                    width: 320,
                    borderRadius: 8,
                    borderColor: "#d9d9d9",
                    transition: "all 0.3s",
                  }}
                  size="large"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1890ff";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(24, 144, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d9d9d9";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {q
                    ? `Tìm thấy ${data.length} kết quả`
                    : `Hiển thị ${data.length} người dùng`}
                </Text>
              </Space>
            </Col>
            <Col>
              {canManage && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal()}
                  size="large"
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
                  Thêm người dùng
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {/* Bảng dữ liệu */}
        <div style={{ padding: 24 }}>
          <UserTable
            data={data}
            loading={loading}
            currentPage={page}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handleTableChange}
            onViewHistory={openHistory}
          />
        </div>
      </Card>

      <UserActivityModal
        open={historyOpen}
        userId={historyUserId}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Modal thêm/sửa người dùng */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size={36}
              icon={editing ? <EditOutlined /> : <PlusOutlined />}
              style={{
                background: editing ? "#faad14" : "#52c41a",
                marginRight: 12,
              }}
            />
            <div>
              <Text strong style={{ fontSize: 18 }}>
                {editing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </Text>
              <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>
                {editing
                  ? "Cập nhật thông tin và quyền của người dùng"
                  : "Tạo tài khoản người dùng mới cho hệ thống"}
              </div>
            </div>
          </div>
        }
        open={modalOpen}
        centered
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        maskClosable={false}
        width={900}
        footer={[
          <Button
            key="cancel"
            onClick={() => setModalOpen(false)}
            size="large"
            style={{ padding: "0 24px", borderRadius: 6 }}
          >
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            size="large"
            style={{
              padding: "0 32px",
              borderRadius: 6,
              background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
              border: "none",
            }}
          >
            {editing ? "Cập nhật" : "Tạo người dùng"}
          </Button>,
        ]}
        styles={{
          header: {
            padding: "24px 32px 16px",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: 0,
          },
          body: {
            padding: "0 32px 24px",
          },
          footer: {
            padding: "16px 32px",
            borderTop: "1px solid #f0f0f0",
          },
        }}
      >
        <UserForm
          editing={editing}
          form={form}
          roles={roles}
          departments={departmentsForForm}
          onFinish={onFinish}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;
