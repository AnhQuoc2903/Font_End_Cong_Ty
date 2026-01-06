/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Alert,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

type EditingUser = {
  _id: string;
  email: string;
  fullName?: string;
};

type UserFormProps = {
  editing: EditingUser | null;
  form: any;
  roles: Array<{ _id: string; name: string; description?: string }>;
  departments: { _id: string; name: string, isActive: boolean; }[];
  onFinish: (values: any) => void;
  loading?: boolean;
};

const UserForm: React.FC<UserFormProps> = ({
  editing,
  form,
  roles,
  departments,
  onFinish,
  loading = false,
}) => {
  const renderPasswordValidation = () => {
    const password = form.getFieldValue("password") || "";
    const validations = [
      { label: "Ít nhất 8 ký tự", valid: password.length >= 8 },
      { label: "Có chữ hoa", valid: /[A-Z]/.test(password) },
      { label: "Có chữ thường", valid: /[a-z]/.test(password) },
      { label: "Có số", valid: /\d/.test(password) },
    ];

    return (
      <div style={{ marginTop: 8 }}>
        <Space wrap size={[4, 8]}>
          {validations.map((item, index) => (
            <Tag
              key={index}
              color={item.valid ? "success" : "default"}
              icon={item.valid ? <CheckCircleOutlined /> : null}
              style={{
                borderRadius: 12,
                padding: "2px 8px",
                margin: 0,
                fontSize: 12,
              }}
            >
              {item.label}
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <Space
          direction="vertical"
          size={0}
          align="center"
          style={{ width: "100%" }}
        >
          <Avatar
            size={64}
            style={{
              background: editing
                ? "linear-gradient(135deg, #1890ff 0%, #0050b3 100%)"
                : "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              marginBottom: 16,
              border: "3px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            icon={<UserOutlined />}
          />
          <Title level={3} style={{ margin: 0, color: "#262626" }}>
            {editing ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
          </Title>
          <Text type="secondary">
            {editing
              ? "Cập nhật thông tin và vai trò của người dùng"
              : "Thêm người dùng mới vào hệ thống"}
          </Text>
        </Space>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        disabled={loading}
      >
        {/* Personal Information Card */}
        <Card
          title={
            <Space>
              <UserOutlined style={{ color: "#1890ff" }} />
              <Text strong>Thông tin cá nhân</Text>
            </Space>
          }
          size="small"
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
          extra={
            <Badge
              count="Bắt buộc"
              color="#1890ff"
              style={{ fontWeight: 500, fontSize: 11 }}
            />
          }
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <Text strong>Email</Text>
                    {editing && (
                      <Tag
                        color="blue"
                        style={{ fontSize: 11, padding: "0 6px" }}
                      >
                        Không thể thay đổi
                      </Tag>
                    )}
                  </Space>
                }
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                  { max: 100, message: "Email tối đa 100 ký tự" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                  disabled={!!editing}
                  placeholder="nguyenvana@example.com"
                  size="large"
                  style={{
                    borderRadius: 8,
                    borderColor: "#d9d9d9",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <Text strong>Họ tên</Text>
                    <Tooltip title="Họ tên đầy đủ của người dùng">
                      <InfoCircleOutlined
                        style={{ color: "#bfbfbf", fontSize: 12 }}
                      />
                    </Tooltip>
                  </Space>
                }
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ tên" },
                  { min: 3, message: "Họ tên tối thiểu 3 ký tự" },
                  { max: 50, message: "Họ tên tối đa 50 ký tự" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Nguyễn Văn A"
                  size="large"
                  style={{
                    borderRadius: 8,
                    borderColor: "#d9d9d9",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {editing && (
            <Alert
              message="Lưu ý"
              description="Email đăng nhập không thể thay đổi sau khi tạo tài khoản"
              type="info"
              showIcon
              style={{
                borderRadius: 8,
                marginTop: 8,
                background: "#e6f7ff",
                border: "1px solid #91d5ff",
              }}
            />
          )}
        </Card>

        {/* Security Card - Only for new users */}
        {!editing && (
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ color: "#fa541c" }} />
                <Text strong>Thiết lập bảo mật</Text>
              </Space>
            }
            size="small"
            style={{
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              marginBottom: 24,
            }}
            extra={
              <Badge
                count="Bắt buộc"
                color="#fa541c"
                style={{ fontWeight: 500, fontSize: 11 }}
              />
            }
          >
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <Text strong>Mật khẩu</Text>
                      <Tooltip title="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số">
                        <InfoCircleOutlined
                          style={{ color: "#bfbfbf", fontSize: 12 }}
                        />
                      </Tooltip>
                    </Space>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      message: "Mật khẩu không đủ mạnh",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="********"
                    size="large"
                    style={{
                      borderRadius: 8,
                      borderColor: "#d9d9d9",
                    }}
                  />
                </Form.Item>
                {renderPasswordValidation()}
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <Text strong>Xác nhận mật khẩu</Text>
                    </Space>
                  }
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
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="********"
                    size="large"
                    style={{
                      borderRadius: 8,
                      borderColor: "#d9d9d9",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Alert
              message="Khuyến nghị bảo mật"
              description="Sử dụng mật khẩu mạnh và không chia sẻ với người khác. Người dùng nên đổi mật khẩu sau lần đăng nhập đầu tiên."
              type="warning"
              showIcon
              style={{
                borderRadius: 8,
                marginTop: 16,
                background: "#fff7e6",
                border: "1px solid #ffd591",
              }}
            />
          </Card>
        )}
        <Card
          title={
            <Space>
              <TeamOutlined style={{ color: "#13c2c2" }} />
              <Text strong>Phòng ban</Text>
            </Space>
          }
          size="small"
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
        >
          <Form.Item
            name="departmentId"
            label={
              <Text
                strong
                style={{
                  fontSize: 14,
                  color: "#262626",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <TeamOutlined style={{ fontSize: 14, color: "#13c2c2" }} />
                <span>Chọn phòng ban</span>
                <span style={{ color: "#ff4d4f", marginLeft: 2 }}>*</span>
              </Text>
            }
            rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
          >
            <Select
              optionFilterProp="labelText"
              size="large"
              placeholder={
                <div
                  style={{
                    color: "#8c8c8c",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TeamOutlined />
                  <span>Chọn phòng ban...</span>
                </div>
              }
              options={departments.map((d) => ({
                label: (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Avatar
                      size={24}
                      style={{ background: "#13c2c2", fontSize: 12 }}
                    >
                      {d.name.charAt(0)}
                    </Avatar>
                    <Text>{d.name}</Text>
                  </div>
                ),
                value: d._id,
                disabled: !editing && !d.isActive, // 👈 THÊM
                labelText: d.name
              }))}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d9d9d9",
              }}
              dropdownStyle={{
                borderRadius: 8,
                padding: 8,
              }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.labelText ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              suffixIcon={<DownOutlined style={{ color: "#13c2c2" }} />}
              listHeight={220}
            />
          </Form.Item>

          {/* Helper Text */}
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              Người dùng sẽ được phân vào phòng ban đã chọn và có quyền truy cập
              các tài liệu của phòng ban đó.
            </Text>
          </div>
        </Card>

        {/* Roles and Permissions Card */}
        <Card
          title={
            <Space>
              <TeamOutlined style={{ color: "#722ed1" }} />
              <Text strong>Vai trò và phân quyền</Text>
            </Space>
          }
          size="small"
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
          extra={
            <Space>
              <Badge
                count={roles.length}
                color="#722ed1"
                style={{ fontWeight: 500, fontSize: 11 }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                vai trò có sẵn
              </Text>
            </Space>
          }
        >
          <Form.Item
            name="roleIds"
            label={
              <Space direction="vertical" size={2} style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <KeyOutlined style={{ color: "#722ed1" }} />
                  <Text strong>Chọn vai trò</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Người dùng sẽ có tất cả quyền từ vai trò được chọn
                </Text>
              </Space>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất 1 vai trò",
              },
            ]}
          >
            <Select
              mode="multiple"
              optionFilterProp="title"
              showSearch={false}
              placeholder={
                <Space>
                  <TeamOutlined />
                  <span>Chọn vai trò từ danh sách...</span>
                </Space>
              }
              size="large"
              options={roles.map((role) => ({
                label: (
                  <Space
                    direction="vertical"
                    size={0}
                    style={{ padding: "4px 0" }}
                  >
                    <Text strong>{role.name}</Text>
                    {role.description && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {role.description}
                      </Text>
                    )}
                  </Space>
                ),
                value: role._id,
                title: `${role.name} ${role.description ?? ""}`,
              }))}
              style={{
                borderRadius: 8,
                borderColor: "#d9d9d9",
              }}
              dropdownStyle={{
                borderRadius: 8,
                padding: 8,
              }}
              dropdownRender={(menu) => (
                <div>
                  <div
                    style={{
                      padding: "8px 12px",
                      background: "#f9f0ff",
                      borderRadius: 6,
                      marginBottom: 8,
                      border: "1px solid #d3adf7",
                    }}
                  >
                    <Space>
                      <InfoCircleOutlined style={{ color: "#722ed1" }} />
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Có thể chọn nhiều vai trò. Người dùng sẽ có tất cả quyền
                        từ các vai trò được chọn.
                      </Text>
                    </Space>
                  </div>
                  {menu}
                </div>
              )}
              maxTagCount={2}
              maxTagTextLength={15}
              maxTagPlaceholder={(omittedValues) => (
                <Tag color="purple">+{omittedValues.length} vai trò</Tag>
              )}
              listHeight={250}
              showArrow
            />
          </Form.Item>

          {/* Selected Roles Count */}
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#f9f0ff",
              borderRadius: 6,
              border: "1px solid #d3adf7",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Badge
                    count={form.getFieldValue("roleIds")?.length || 0}
                    showZero
                    color="#722ed1"
                    style={{ fontWeight: 600 }}
                  />
                  <Text>vai trò đã chọn</Text>
                </Space>
              </Col>
              <Col>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Tổng: {roles.length} vai trò có sẵn
                </Text>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Account Status Card */}
        <Card
          size="small"
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            background: "#fafafa",
          }}
          bodyStyle={{ padding: 20 }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size={2}>
                <Text strong>Trạng thái tài khoản</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {form.getFieldValue("isActive")
                    ? "Tài khoản có thể đăng nhập và sử dụng hệ thống"
                    : "Tài khoản bị vô hiệu hóa, không thể đăng nhập"}
                </Text>
              </Space>
            </Col>
            <Col>
              <Form.Item name="isActive" valuePropName="checked" noStyle>
                <Switch
                  checkedChildren={
                    <Space size={4}>
                      <CheckCircleOutlined />
                      <span>Hoạt động</span>
                    </Space>
                  }
                  unCheckedChildren={
                    <Space size={4}>
                      <span>Vô hiệu hóa</span>
                    </Space>
                  }
                  defaultChecked
                  style={{
                    background: form.getFieldValue("isActive")
                      ? "#52c41a"
                      : "#ff4d4f",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Validation Summary */}
        <Divider style={{ margin: "32px 0 16px" }} />

        <Alert
          message="Xác nhận thông tin"
          description={
            <Space direction="vertical" size={4}>
              <Text>
                Vui lòng kiểm tra kỹ thông tin trước khi{" "}
                {editing ? "cập nhật" : "tạo"} người dùng:
              </Text>
              <ul style={{ margin: "8px 0 0 20px", color: "#595959" }}>
                <li>Email đã đúng định dạng và không trùng lặp</li>
                <li>Họ tên đầy đủ và chính xác</li>
                <li>Đã phân quyền đúng vai trò cho người dùng</li>
                {!editing && <li>Mật khẩu đủ mạnh và đã xác nhận</li>}
              </ul>
            </Space>
          }
          type="info"
          showIcon
          style={{
            borderRadius: 8,
            marginBottom: 8,
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
          }}
        />
      </Form>
    </div>
  );
};

export default UserForm;
