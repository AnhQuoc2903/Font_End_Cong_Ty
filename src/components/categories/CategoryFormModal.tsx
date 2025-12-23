/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Form, Input, Modal, Typography, Tag, Divider } from "antd";
import type { Category } from "../../api/categoryApi";
import { 
  FolderAddOutlined, 
  FolderOpenOutlined,
  InfoCircleOutlined,
  TagOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;

type Props = {
  open: boolean;
  editing: Category | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
};

const CategoryFormModal: React.FC<Props> = ({
  open,
  editing,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        description: editing.description,
      });
    } else {
      form.resetFields();
    }
  }, [editing, open, form]);

  const getModalTitle = () => {
    if (editing) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <FolderOpenOutlined style={{ fontSize: 20, color: "#fff" }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Chỉnh sửa danh mục
            </Title>
            
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <FolderAddOutlined style={{ fontSize: 20, color: "#fff" }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Tạo danh mục mới
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Thêm danh mục mới vào hệ thống
            </Text>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      open={open}
      title={getModalTitle()}
      centered
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
      width={520}
      okText={editing ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: 8,
          height: 40,
          padding: "0 24px",
          fontWeight: 600,
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: 8,
          height: 40,
          padding: "0 24px",
          borderColor: "#d9d9d9",
        },
      }}
      bodyStyle={{
        padding: "20px 0",
      }}
    >
      {editing && (
        <div style={{ 
          background: "#f6ffed", 
          border: "1px solid #b7eb8f",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}>
          <InfoCircleOutlined style={{ color: "#52c41a", fontSize: 16, marginTop: 2 }} />
          <div>
            <Text strong style={{ display: "block", marginBottom: 4 }}>
              Đang chỉnh sửa danh mục
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Mọi thay đổi sẽ được áp dụng cho tất cả hiện vật trong danh mục này.
            </Text>
          </div>
        </div>
      )}

      <div style={{ padding: "0 4px" }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onSubmit}
          requiredMark={false}
        >
          <div style={{ marginBottom: 24 }}>
            <Form.Item
              label={
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  Tên danh mục
                  <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
                </span>
              }
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục!" },
                { min: 3, message: "Tên danh mục phải có ít nhất 3 ký tự!" },
                { max: 100, message: "Tên danh mục không quá 100 ký tự!" },
              ]}
              validateTrigger={["onChange", "onBlur"]}
            >
              <Input
                placeholder="Ví dụ: Đồ gốm cổ, Vũ khí thời phong kiến, Tranh dân gian..."
                prefix={<TagOutlined style={{ color: "#bfbfbf" }} />}
                size="large"
                style={{
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
            <div style={{ 
              marginTop: -12, 
              marginBottom: 12,
              padding: "8px 12px",
              background: "#f9f9f9",
              borderRadius: 6,
              border: "1px dashed #d9d9d9",
            }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                • Tên nên ngắn gọn, rõ ràng
                <br />
                • Tránh trùng lặp với danh mục khác
              </Text>
            </div>
          </div>

          <Divider style={{ margin: "24px 0" }} />

          <div style={{ marginBottom: 8 }}>
            <Form.Item 
              label={
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  Mô tả chi tiết
                  <Tag color="blue" style={{ marginLeft: 8, fontSize: 11, padding: "0 6px" }}>
                    Tùy chọn
                  </Tag>
                </span>
              } 
              name="description"
              help={
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  marginTop: 8,
                }}>
                  <InfoCircleOutlined style={{ color: "#bfbfbf", fontSize: 12 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Mô tả chi tiết giúp phân loại và tìm kiếm dễ dàng hơn
                  </Text>
                </div>
              }
            >
              <Input.TextArea
                rows={5}
                placeholder="Nhập mô tả chi tiết về danh mục, đặc điểm chung, hoặc các thông tin phân loại..."
                maxLength={500}
                showCount
                style={{
                  borderRadius: 8,
                  border: "1px solid #d9d9d9",
                  resize: "vertical",
                  minHeight: 100,
                }}
              />
            </Form.Item>
          </div>

          {editing && (
            <div style={{ 
              marginTop: 24,
              padding: "16px",
              background: "#fff7e6",
              borderRadius: 8,
              border: "1px solid #ffd591",
            }}>
              <Text strong style={{ display: "block", marginBottom: 8, color: "#fa8c16" }}>
                ⚠️ Lưu ý quan trọng
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  • Thay đổi tên danh mục sẽ ảnh hưởng đến tất cả hiện vật thuộc danh mục
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  • Không thể xóa danh mục nếu đang có hiện vật thuộc về
                </Text>
              </div>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default CategoryFormModal;