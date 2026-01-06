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
} from "antd";
import { PlusOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

import { departmentApi } from "../../api/departmentApi";
import DepartmentTable from "../../components/departments/DepartmentTable";
import DepartmentForm from "../../components/departments/DepartmentForm";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;

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
    const filtered = allData.filter((d) => d.name.toLowerCase().includes(q));

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    setData(filtered.slice(start, end));
  }, [allData, page, q]);

  const total = allData.filter((d) => d.name.toLowerCase().includes(q)).length;

  /* ===== ACTIONS ===== */
  const openModal = (dept?: Department) => {
    setEditing(dept || null);
    setModalOpen(true);
    form.resetFields();
    if (dept)
      form.setFieldsValue({ name: dept.name, description: dept.description });
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
    try {
      await departmentApi.remove(id);
      message.success("Đã xóa phòng ban");
      fetchDepartments();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await departmentApi.update(id, { isActive });
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
    <Card>
      <Space style={{ width: "100%", marginBottom: 16 }} align="center">
        <Title level={3}>
          <TeamOutlined /> Quản lý phòng ban
        </Title>

        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Thêm phòng ban
          </Button>
        )}

        <Input
          placeholder="Tìm theo tên phòng ban..."
          prefix={<SearchOutlined />}
          allowClear
          defaultValue={q}
          onChange={(e) =>
            setSearchParams({
              page: "1",
              q: e.target.value,
            })
          }
          style={{ width: 260 }}
        />
      </Space>

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

      <Modal
        open={modalOpen}
        title={editing ? "Chỉnh sửa phòng ban" : "Thêm phòng ban"}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <DepartmentForm form={form} onFinish={onFinish} loading={loading} />
      </Modal>
    </Card>
  );
};

export default DepartmentPage;
