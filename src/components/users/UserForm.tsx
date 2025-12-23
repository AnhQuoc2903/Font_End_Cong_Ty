/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

type UserFormProps = {
  editing: any;
  form: any;
  roles: Array<{ _id: string; name: string }>;
  onFinish: (values: any) => void;
  loading?: boolean;
};

const UserForm: React.FC<UserFormProps> = ({
  editing,
  form,
  roles,
  onFinish,
}) => {
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      style={{ 
        marginTop: 24,
        maxWidth: 800, // Giới hạn chiều rộng tối đa
        margin: "0 auto", // Căn giữa form
      }}
    >
      <Row gutter={[24, 16]}> {/* Tăng khoảng cách giữa các cột và hàng */}
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#1890ff" }} />} /* Màu cho icon */
              disabled={!!editing}
              placeholder="example@email.com"
              size="large"
              style={{ borderRadius: 6 }} /* Bo góc input */
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Nguyễn Văn A"
              size="large"
              style={{ borderRadius: 6 }}
            />
          </Form.Item>
        </Col>
      </Row>

      {!editing && (
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message:
                    "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#1890ff" }} />}
                placeholder="********"
                size="large"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu" },
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
              <Input.Password
                prefix={<LockOutlined style={{ color: "#1890ff" }} />}
                placeholder="********"
                size="large"
                style={{ borderRadius: 6 }}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Form.Item
        label="Vai trò"
        name="roleIds"
        rules={[
          { required: true, message: "Vui lòng chọn ít nhất 1 vai trò" },
        ]}
        style={{ marginBottom: 20 }} /* Tăng khoảng cách dưới */
      >
        <Select
          mode="multiple"
          placeholder="Chọn vai trò"
          size="large"
          options={roles.map((r) => ({
            label: r.name,
            value: r._id,
          }))}
          style={{ 
            width: "100%",
            borderRadius: 6
          }}
          allowClear /* Thêm nút xóa tất cả */
        />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="isActive"
        valuePropName="checked"
        style={{ 
          marginBottom: 0,
          padding: "12px 0", /* Thêm padding */
          borderTop: "1px solid #f0f0f0", /* Đường phân cách */
          marginTop: 8
        }}
      >
        <Switch
          checkedChildren="Hoạt động"
          unCheckedChildren="Vô hiệu hóa"
          defaultChecked
          style={{ marginLeft: 8 }}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;