/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined as PlusOutlinedIcon,
} from "@ant-design/icons";
import { userApi } from "../api/userApi";
import { roleApi } from "../api/roleApi";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";

const { Title, Text } = Typography;

type Role = { _id: string; name: string };
export type UserRow = {
  _id: string;
  email: string;
  fullName?: string;
  isActive?: boolean;
  roles?: Role[];
};

const UsersPage: React.FC = () => {
  const [data, setData] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const { hasPermission } = useAuth();

  const canManage = hasPermission("ADMIN_PANEL");

  // search
  const [q, setQ] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        userApi.getAll(),
        roleApi.getAll(),
      ]);
      setData(usersRes.data || []);
      setRoles(rolesRes.data || []);
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
          isActive: values.isActive,
        });
        message.success("Cập nhật người dùng thành công");
      } else {
        await userApi.create({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          roleIds: values.roleIds || [],
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

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý người dùng
          </Title>
          <Text type="secondary">
            Tổng cộng {data.length} người dùng
          </Text>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Tìm theo email hoặc tên..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 280 }}
              size="large"
            />
            {canManage && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                size="large"
              >
                Thêm người dùng
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      <UserTable
        data={data}
        loading={loading}
        currentPage={page}
        canManage={canManage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handleTableChange}
      />

      <Modal
        title={
          <Space>
            {editing ? (
              <>
                <EditOutlined />
                <span>Sửa người dùng</span>
              </>
            ) : (
              <>
                <PlusOutlinedIcon />
                <span>Thêm người dùng mới</span>
              </>
            )}
          </Space>
        }
        open={modalOpen}
        centered
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        maskClosable={false}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
          >
            {editing ? "Cập nhật" : "Tạo mới"}
          </Button>,
        ]}
      >
        <UserForm
          editing={editing}
          form={form}
          roles={roles}
          onFinish={onFinish}
          loading={loading}
        />
      </Modal>
    </Card>
  );
};

export default UsersPage;