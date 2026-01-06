/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Row, 
  Col, 
  Typography, 
  Card, 
  Divider,
  Avatar,
  Badge,
  Tooltip
} from 'antd';
import { 
  EditOutlined, 
  PlusOutlined, 
  KeyOutlined, 
  InfoCircleOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  TeamOutlined 
} from '@ant-design/icons';
import type { RoleRow, Permission } from './types';

const { Title, Text } = Typography;

interface RoleModalProps {
  open: boolean;
  editing: RoleRow | null;
  permissions: Permission[];
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  form: any;
  loading?: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({
  open,
  editing,
  permissions,
  onCancel,
  onSubmit,
  form,
  loading = false,
}) => {
  // Nhóm permissions theo group
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = permission.group || 'Khác';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      centered
      destroyOnClose
      confirmLoading={loading}
      title={
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar
              size={40}
              style={{
                background: editing 
                  ? 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)'
                  : 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              icon={editing ? <EditOutlined /> : <PlusOutlined />}
            />
            <div>
              <Title level={4} style={{ margin: 0, color: '#262626' }}>
                {editing ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
              </Title>
              <Text type="secondary">
                {editing 
                  ? 'Cập nhật thông tin và quyền hạn cho vai trò hiện có'
                  : 'Thêm vai trò mới với các quyền hạn cụ thể'
                }
              </Text>
            </div>
          </div>
        </Space>
      }
      okText={
        <Space>
          {editing ? <EditOutlined /> : <PlusOutlined />}
          <span>{editing ? 'Cập nhật' : 'Tạo mới'}</span>
        </Space>
      }
      cancelText="Hủy bỏ"
      okButtonProps={{
        size: 'large',
        style: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '0 24px',
          background: editing 
            ? 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)'
            : 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
          border: 'none',
        },
      }}
      cancelButtonProps={{
        size: 'large',
        style: { 
          borderRadius: 8, 
          fontWeight: 600, 
          padding: '0 24px',
          borderColor: '#d9d9d9'
        },
      }}
      width={720}
      styles={{
        body: {
          padding: '24px 0',
          maxHeight: '70vh',
          overflowY: 'auto',
        }
      }}
    >
      <div style={{ padding: '0 4px' }}>
        {/* Stats Bar */}
        <div style={{ marginBottom: 24 }}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              background: '#fafafa',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Space direction="vertical" size={2} align="center">
                  <Badge
                    count={permissions.length}
                    showZero
                    color="#1890ff"
                    style={{ fontWeight: 600 }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Quyền có sẵn
                  </Text>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" size={2} align="center">
                  <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                    {Object.keys(groupedPermissions).length}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Nhóm quyền
                  </Text>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" size={2} align="center">
                  <Avatar
                    size={32}
                    style={{
                      background: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)',
                    }}
                    icon={<SafetyCertificateOutlined />}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Phân quyền
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        <Divider  style={{ margin: '24px 0 16px' }}>
          <Space>
            <CrownOutlined style={{ color: '#faad14' }} />
            <Text strong>Thông tin vai trò</Text>
          </Space>
        </Divider>

        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Card
                size="small"
                style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Form.Item
                  name="name"
                  label={
                    <Space>
                      <Text strong>Tên vai trò</Text>
                      <Tooltip title="Tên duy nhất để phân biệt các vai trò trong hệ thống">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên vai trò' },
                    { min: 3, message: 'Tên vai trò tối thiểu 3 ký tự' },
                    { max: 50, message: 'Tên vai trò tối đa 50 ký tự' }
                  ]}
                >
                  <Input
                    placeholder="Ví dụ: Quản trị viên, Người dùng thường, Moderator..."
                    size="large"
                    style={{ 
                      borderRadius: 8,
                      borderColor: '#d9d9d9'
                    }}
                    prefix={<TeamOutlined style={{ color: '#bfbfbf' }} />}
                  />
                </Form.Item>
              </Card>
            </Col>
            
            <Col span={12}>
              <Card
                size="small"
                style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Form.Item
                  name="description"
                  label={
                    <Space>
                      <Text strong>Mô tả vai trò</Text>
                      <Tooltip title="Mô tả ngắn gọn về chức năng và phạm vi của vai trò">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Input.TextArea
                    placeholder="Mô tả chức năng, phạm vi và mục đích của vai trò này..."
                    size="large"
                    style={{ 
                      borderRadius: 8,
                      borderColor: '#d9d9d9',
                      minHeight: '52px'
                    }}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider   style={{ margin: '24px 0 16px' }}>
            <Space>
              <KeyOutlined style={{ color: '#722ed1' }} />
              <Text strong>Phân quyền chi tiết</Text>
              <Tag color="purple" style={{ marginLeft: 8 }}>
                {permissions.length} quyền có sẵn
              </Tag>
            </Space>
          </Divider>

          <Card
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              background: '#fafafa',
              marginBottom: 16
            }}
            bodyStyle={{ padding: 16 }}
          >
            <Form.Item
              name="permissionIds"
              label={
                <Space direction="vertical" size={2} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                    <Text strong>Chọn quyền hạn cho vai trò</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Chọn các quyền từ danh sách dưới đây. Vai trò sẽ có tất cả quyền được chọn.
                  </Text>
                </Space>
              }
              rules={[
                { 
                  required: true, 
                  validator: (_, value) => {
                    if (!value || value.length === 0) {
                      return Promise.reject(new Error('Vui lòng chọn ít nhất 1 quyền'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Select
                mode="multiple"
                showSearch={false}
                optionFilterProp="title"    
                placeholder={
                  <Space>
                    <KeyOutlined />
                    <span>Chọn quyền từ danh sách...</span>
                  </Space>
                }
                size="large"
                
                options={Object.entries(groupedPermissions).map(([group, perms]) => ({
                  label: (
                    <div>
                      <Text strong style={{ color: '#722ed1' }}>{group}</Text>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                        ({perms.length} quyền)
                      </Text>
                    </div>
                  ),
                  title: group,
                  options: perms.map((p) => ({
                    label: (
                      <Space direction="vertical" size={0} style={{ padding: '4px 0' }}>
                        <Text strong>{p.description || p.name}</Text>
                      </Space>
                    ),
                    value: p._id,
                    title: p.description || p.name,
                  })),
                }))}
                style={{ 
                  borderRadius: 8,
                  borderColor: '#d9d9d9'
                }}
                dropdownStyle={{ 
                  borderRadius: 8,
                  padding: 8
                }}
                dropdownRender={(menu) => (
                  <div>
                    <div style={{ 
                      padding: '8px 12px', 
                      background: '#f6ffed',
                      borderRadius: 6,
                      marginBottom: 8,
                      border: '1px solid #b7eb8f'
                    }}>
                    </div>
                    {menu}
                  </div>
                )}
                maxTagCount={3}
                maxTagTextLength={20}
                maxTagPlaceholder={(omittedValues) => (
                  <Tag color="blue">+{omittedValues.length} quyền khác</Tag>
                )}
                listHeight={300}
                showArrow
              />
            </Form.Item>

            {/* Selected Count */}
            <div style={{ 
              marginTop: 16,
              padding: '12px 16px',
              background: '#e6f7ff',
              borderRadius: 6,
              border: '1px solid #91d5ff'
            }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Badge
                      count={form.getFieldValue('permissionIds')?.length || 0}
                      showZero
                      color="#1890ff"
                      style={{ fontWeight: 600 }}
                    />
                    <Text>quyền đã chọn</Text>
                  </Space>
                </Col>
                <Col>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổng: {permissions.length} quyền có sẵn
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Preview Section */}
          {editing && (
            <>
              <Divider  style={{ margin: '24px 0 16px' }}>
                <Text strong>Thông tin hiện tại</Text>
              </Divider>
              <Card
                size="small"
                style={{
                  border: '1px dashed #d9d9d9',
                  borderRadius: 8,
                  background: '#fafafa'
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" size={2}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Vai trò hiện tại</Text>
                      <Text strong style={{ color: '#1890ff' }}>{editing.name}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size={2}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Số quyền hiện có</Text>
                      <Badge
                        count={editing.permissions?.length || 0}
                        showZero
                        color="blue"
                        style={{ fontWeight: 600 }}
                      />
                    </Space>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default RoleModal;