import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { userApi } from "../api/userApi";
import { roleApi } from "../api/roleApi";
import { useAuth } from "../context/AuthContext";

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

  /* eslint-disable @typescript-eslint/no-explicit-any */ const onFinish =
    async (values: any) => {
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

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa người dùng?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await userApi.remove(id);
          message.success("Đã xóa người dùng");
          searchUsers(q);
        } catch (err: any) {
          console.error(err);
          message.error(err?.response?.data?.message || "Xóa thất bại");
        }
      },
    });
  };

  const columns: ColumnsType<UserRow> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Vai trò",
      key: "roles",
      render: (_, record) =>
        (record.roles || []).map((r) => <Tag key={r._id}>{r.name}</Tag>),
    },
    {
      title: "Kích hoạt",
      dataIndex: "isActive",
      key: "isActive",
      render: (v) =>
        v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        canManage ? (
          <Space>
            <Button size="small" onClick={() => openModal(record)}>
              Sửa
            </Button>
            <Button
              size="small"
              danger
              onClick={() => handleDelete(record._id)}
            >
              Xóa
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 12, width: "100%" }}>
        {canManage && (
          <Button type="primary" onClick={() => openModal()}>
            Thêm người dùng
          </Button>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm theo email hoặc tên..."
            allowClear
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 250 }}
          />
        </div>
      </Space>

      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editing ? "Sửa người dùng" : "Thêm người dùng"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input disabled={!!editing} />
          </Form.Item>

          {!editing && (
            <>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Nhập mật khẩu" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item label="Họ tên" name="fullName">
            <Input />
          </Form.Item>

          <Form.Item label="Vai trò" name="roleIds">
            <Select
              mode="multiple"
              placeholder="Chọn vai trò"
              options={roles.map((r) => ({ label: r.name, value: r._id }))}
            />
          </Form.Item>

          <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UsersPage;
