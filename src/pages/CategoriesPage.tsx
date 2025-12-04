/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/categoryApi";
import { useAuth } from "../context/AuthContext";

const removeVietnameseTones = (str = "") => {
  if (!str) return "";
  try {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  } catch {
    return str
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
};

const normalize = (s = "") => removeVietnameseTones(s).toLowerCase().trim();

const CategoriesPage: React.FC = () => {
  const [allData, setAllData] = useState<Category[]>([]); // store original list
  const [data, setData] = useState<Category[]>([]); // shown list (filtered)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { hasPermission } = useAuth();

  // search state
  const [q, setQ] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  // Fetch data once and keep original in allData
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();

      // safe access to res.data even if typings vary
      const raw: any = (res as any)?.data;

      const payload: Category[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(res as any)
        ? (res as any)
        : [];

      setAllData(payload);
      setData(payload);
    } catch (error) {
      console.error(error);
      message.error("Lỗi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // cleanup on unmount
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search onChange — filter from allData using normalize
  const onSearchChange = (val: string) => {
    // clear previous timer
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    // update displayed input immediately
    setQ(val);

    debounceRef.current = window.setTimeout(() => {
      const qNorm = normalize(val);
      if (!qNorm) {
        // empty -> show all
        setData(allData);
        return;
      }

      // filter from original source allData
      const filtered = (allData || []).filter((item: Category) =>
        normalize(item.name || "").includes(qNorm)
      );
      setData(filtered);
    }, 300);
  };

  const openModal = (category?: Category) => {
    setEditing(category || null);
    setModalOpen(true);
    form.resetFields();
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
      });
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xóa danh mục",
      content: "Bạn chắc chắn muốn xóa danh mục này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await categoryApi.delete(id);
          message.success("Đã xóa danh mục");
          // reload data
          await fetchData();
          // re-apply current query if present
          if (q) {
            onSearchChange(q);
          }
        } catch (error: any) {
          console.error(error);
          message.error(error?.response?.data?.message || "Xóa thất bại");
        }
      },
    });
  };

  const onFinish = async (values: any) => {
    try {
      if (editing) {
        await categoryApi.update(editing._id!, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await categoryApi.create(values);
        message.success("Tạo danh mục thành công");
      }
      setModalOpen(false);
      await fetchData();
      if (q) onSearchChange(q); // re-apply filter nếu có
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Lưu danh mục thất bại");
    }
  };

  const columns: ColumnsType<Category> = [
    { title: "STT", key: "index", render: (_t, _r, idx) => idx + 1 },
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        hasPermission("CREATE_ARTIFACT") && (
          <Space>
            <Button size="small" onClick={() => openModal(record)}>
              Sửa
            </Button>
            <Button
              size="small"
              danger
              onClick={() => handleDelete(record._id!)}
            >
              Xóa
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 12, width: "100%" }}>
        {hasPermission("CREATE_ARTIFACT") && (
          <Button type="primary" onClick={() => openModal()}>
            Thêm danh mục
          </Button>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm theo danh mục"
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            style={{ width: 250 }}
            onClear={() => {
              setQ("");
              setData(allData); // restore
            }}
          />
        </div>
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Sửa danh mục" : "Thêm danh mục"}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoriesPage;
