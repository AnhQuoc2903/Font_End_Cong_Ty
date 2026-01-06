/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;

type Props = {
  form: any;
  onFinish: (values: any) => void;
  loading?: boolean;
};

const DepartmentForm: React.FC<Props> = ({
  form,
  onFinish,
  loading,
}) => {
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      disabled={loading}
    >
      <Form.Item
        label="Tên phòng ban"
        name="name"
        rules={[
          { required: true, message: "Vui lòng nhập tên phòng ban" },
          { min: 2, message: "Tối thiểu 2 ký tự" },
          { max: 50, message: "Tối đa 50 ký tự" },
        ]}
      >
        <Input placeholder="Ví dụ: IT, Kế toán..." />
      </Form.Item>

      {/* 👇 THÊM MÔ TẢ */}
      <Form.Item
        label="Mô tả"
        name="description"
      >
        <TextArea
          placeholder="Mô tả ngắn về chức năng phòng ban"
          rows={3}
          showCount
          maxLength={255}
        />
      </Form.Item>
    </Form>
  );
};

export default DepartmentForm;
