import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { roleApi } from "../api/roleApi";
import { useAuth } from "../context/AuthContext";

type Permission = {
  _id: string;
  name: string;
  description?: string;
  group?: string;
};

type RoleRow = {
  _id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
};

const RolesPage: React.FC = () => {
  const [data, setData] = useState<RoleRow[]>([]);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleRow | null>(null);
  const [form] = Form.useForm();
  const { hasPermission } = useAuth();

  const canManage = hasPermission("ADMIN_PANEL");

  // search state
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
    // load initial
    fetchAll();
  }, []);

  // debounce onChange
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

  /* eslint-disable @typescript-eslint/no-explicit-any */ const onFinish =
    async (values: any) => {
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
        // refresh current search
        searchRoles(q);
      } catch (err: any) {
        console.error(err);
        message.error(err?.response?.data?.message || "Lỗi xử lý");
      }
    };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa vai trò?",
      content: "Hành động này sẽ ảnh hưởng đến người dùng có role này.",
      onOk: async () => {
        try {
          await roleApi.remove(id);
          message.success("Đã xóa");
          searchRoles(q);
        } catch (err: any) {
          console.error(err);
          message.error(err?.response?.data?.message || "Xóa thất bại");
        }
      },
    });
  };

  const columns: ColumnsType<RoleRow> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
    { title: "Tên vai trò", dataIndex: "name", key: "name", width: 100 },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Permissions",
      key: "perms",
      render: (_, r) =>
        (r.permissions || []).map((p) => <Tag key={p._id}>{p.name}</Tag>),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) =>
        canManage ? (
          <Space>
            <Button size="small" onClick={() => openModal(r)}>
              Sửa
            </Button>
            <Button size="small" danger onClick={() => handleDelete(r._id)}>
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
            Tạo vai trò mới
          </Button>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm vai trò theo tên..."
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
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
        title={editing ? "Sửa vai trò" : "Tạo vai trò"}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: "Nhập tên vai trò" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>

          <Form.Item name="permissionIds" label="Permissions">
            <Select
              mode="multiple"
              placeholder="Chọn permissions"
              options={perms.map((p) => ({
                label: `${p.group ? `${p.group} - ` : ""}${p.name}`,
                value: p._id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RolesPage;
