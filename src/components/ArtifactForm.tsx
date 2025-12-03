import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { artifactApi } from "../api/artifactApi";
import type { Artifact } from "../pages/ArtifactsPage";

import { categoryApi } from "../api/categoryApi";
import type { Category } from "../api/categoryApi";

type Props = {
  initialValues?: Artifact;
  onSuccess?: (createdOrUpdated?: Artifact) => void;
};

type FormValues = {
  code: string;
  name: string;
  description?: string;
  location?: string;
  status?: string;
  categoryId?: string | null;
};

const ArtifactForm: React.FC<Props> = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Load categories error:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        code: initialValues.code,
        name: initialValues.name,
        description: initialValues.description,
        location: initialValues.location,
        status: initialValues.status,
        categoryId: initialValues.category?._id ?? null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values: FormValues) => {
    try {
      setSubmitting(true);

      // normalize payload: send categoryId (backend expects categoryId)
      const payload = {
        code: values.code?.trim(),
        name: values.name?.trim(),
        description: values.description?.trim(),
        location: values.location?.trim(),
        status: values.status,
        categoryId: values.categoryId || null, // <-- IMPORTANT: categoryId
      };

      // debug log — kiểm tra nhanh payload gửi lên network
      // (bỏ hoặc comment dòng này khi production)
    
      console.log("Artifact payload:", payload);

      let res;
      if (initialValues) {
        res = await artifactApi.update(initialValues._id, payload);
        message.success("Cập nhật hiện vật thành công");
      } else {
        res = await artifactApi.create(payload);
        message.success("Tạo hiện vật thành công");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onSuccess && onSuccess(res?.data);
    } catch (error) {
      console.error("Save artifact error:", error);
      message.error("Lưu hiện vật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form<FormValues> layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Mã hiện vật"
        name="code"rules={[{ required: true, message: "Vui lòng nhập mã hiện vật" }]}
      >
        <Input disabled={!!initialValues} />
      </Form.Item>

      <Form.Item
        label="Tên hiện vật"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên hiện vật" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Danh mục" name="categoryId">
        <Select allowClear placeholder="Chọn danh mục">
          {categories.map((c) => (
            <Select.Option key={c._id} value={c._id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="Vị trí" name="location">
        <Input />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status">
        <Select placeholder="Chọn trạng thái">
          <Select.Option value="bosung">Mới bổ sung</Select.Option>
          <Select.Option value="con">Còn hàng</Select.Option>
          <Select.Option value="ban">Đã bán / Hết hàng</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={submitting}>
          {initialValues ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ArtifactForm;