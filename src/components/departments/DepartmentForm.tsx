/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Form, Input, Card, Alert, Typography, Space, Tag } from "antd";
import type { FormInstance } from "antd";
import { InfoCircleOutlined, EditOutlined, BulbOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Text, Title } = Typography;

type Department = {
  _id: string;
  name: string;
  isActive: boolean;
  description?: string;
};

type Props = {
  form: FormInstance;
  onFinish: (values: any) => void;
  loading?: boolean;
  editing?: Department | null;
  submitButton?: React.ReactNode;
};

const DepartmentForm: React.FC<Props> = ({
  form,
  onFinish,
  loading,
  editing,
  submitButton,
}) => {
  // Đặt giá trị mặc định khi chỉnh sửa
  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        description: editing.description || "",
      });
    } else {
      form.resetFields();
    }
  }, [editing, form]);

  const formTitle = editing ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới";
  const formSubtitle = editing 
    ? "Cập nhật thông tin phòng ban hiện có"
    : "Thêm một phòng ban mới vào hệ thống";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        {/* Header với badge trạng thái */}
        <div>
          <Space align="center" size={12}>
            <div style={{
              background: editing ? "#1890ff" : "#52c41a",
              borderRadius: 6,
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <EditOutlined style={{ color: "white", fontSize: 14 }} />
              <Text strong style={{ color: "white", fontSize: 13 }}>
                {editing ? "CHỈNH SỬA" : "TẠO MỚI"}
              </Text>
            </div>
            <Title level={4} style={{ margin: 0 }}>
              {formTitle}
            </Title>
          </Space>
          <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
            {formSubtitle}
          </Text>
        </div>

        {/* Thông tin trạng thái khi chỉnh sửa */}
        {editing && (
          <Alert
            message={
              <Space>
                <span>Phòng ban đang ở trạng thái:</span>
                <Tag color={editing.isActive ? "success" : "error"} style={{ margin: 0 }}>
                  {editing.isActive ? "HOẠT ĐỘNG" : "NGỪNG HOẠT ĐỘNG"}
                </Tag>
              </Space>
            }
            type={editing.isActive ? "success" : "warning"}
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ borderRadius: 8 }}
          />
        )}

        {/* Mẹo nhập liệu */}
        <Alert
          message="Mẹo nhập liệu"
          description={
            <Space direction="vertical" size={4}>
              <Text type="secondary">
                • Tên phòng ban nên ngắn gọn, rõ ràng
              </Text>
              <Text type="secondary">
                • Mô tả giúp các thành viên hiểu rõ chức năng phòng ban
              </Text>
              <Text type="secondary">
                • Tên phòng ban không thể thay đổi sau khi tạo
              </Text>
            </Space>
          }
          type="info"
          icon={<BulbOutlined />}
          style={{ borderRadius: 8, background: "rgba(24, 144, 255, 0.02)" }}
        />

        {/* Form chính */}
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          disabled={loading}
          requiredMark="optional"
          size="large"
          style={{ width: "100%" }}
        >
          <Form.Item
            label={
              <Space>
                <Text strong>Tên phòng ban</Text>
                <Tag color="red" style={{ fontSize: 11, padding: "0 6px", height: 20 }}>
                  BẮT BUỘC
                </Tag>
              </Space>
            }
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên phòng ban" },
              { min: 2, message: "Tối thiểu 2 ký tự" },
              { max: 50, message: "Tối đa 50 ký tự" },
              {
                pattern: /^[a-zA-ZÀ-ỹ0-9\s]+$/,
                message: "Chỉ cho phép chữ cái, số và khoảng trắng",
              },
            ]}
            help={
              <Text type="secondary" style={{ fontSize: 12 }}>
                Tên phòng ban sẽ hiển thị trên toàn hệ thống
                {editing && " (Không thể thay đổi)"}
              </Text>
            }
          >
            <Input
              disabled={!!editing}
              placeholder="Ví dụ: Phòng Kỹ thuật IT, Ban Tài chính Kế toán..."
              size="large"
              style={{
                borderRadius: 8,
                borderColor: "#d9d9d9",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1890ff";
                e.target.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d9d9d9";
                e.target.style.boxShadow = "none";
              }}
              suffix={
                editing ? (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <InfoCircleOutlined /> Chỉ đọc
                  </Text>
                ) : null
              }
            />
          </Form.Item>

          {/* Mô tả với giao diện đẹp hơn */}
          <Form.Item
            label={
              <Text strong>Mô tả phòng ban</Text>
            }
            name="description"
            help={
              <Space direction="vertical" size={2} style={{ width: "100%" }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Mô tả ngắn gọn về chức năng, nhiệm vụ của phòng ban
                </Text>
                {editing?.description && (
                  <Tag color="blue" style={{ fontSize: 11, marginTop: 4 }}>
                    Có mô tả hiện tại
                  </Tag>
                )}
              </Space>
            }
          >
            <TextArea
              placeholder="Ví dụ: Phụ trách phát triển và bảo trì hệ thống công nghệ thông tin, hỗ trợ kỹ thuật cho các phòng ban khác..."
              rows={4}
              showCount
              maxLength={255}
              size="large"
              style={{
                borderRadius: 8,
                resize: "vertical",
                minHeight: 100,
                borderColor: "#d9d9d9",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1890ff";
                e.target.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d9d9d9";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Item>

          {/* Hiển thị submit button từ parent nếu có */}
          {submitButton && (
            <div style={{ 
              paddingTop: 24, 
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12
            }}>
              {submitButton}
            </div>
          )}
        </Form>
      </Space>
    </Card>
  );
};

export default DepartmentForm;