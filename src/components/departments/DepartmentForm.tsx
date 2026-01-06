/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/departments/DepartmentForm.tsx
import React from "react";
import { Form, Input } from "antd";

type Props = {
  form: any;
  onFinish: (values: any) => void;
  loading?: boolean;
};

const DepartmentForm: React.FC<Props> = ({ form, onFinish, loading }) => {
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
    </Form>
  );
};

export default DepartmentForm;
