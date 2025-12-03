import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/categoryApi";

import { useAuth } from "../context/AuthContext";

const CategoriesPage: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { hasPermission } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error("Lỗi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  /* eslint-disable @typescript-eslint/no-explicit-any */

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
          fetchData();
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
        await categoryApi.update(editing._id, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await categoryApi.create(values);
        message.success("Tạo danh mục thành công");
      }
      setModalOpen(false);
      fetchData();
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Lưu danh mục thất bại");
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
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
              onClick={() => handleDelete(record._id)}
            >
              Xóa
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        {hasPermission("CREATE_ARTIFACT") && (
          <Button type="primary" onClick={() => openModal()}>
            Thêm danh mục
          </Button>
        )}
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
