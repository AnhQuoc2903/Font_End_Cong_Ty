/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/departments/DepartmentTable.tsx
import React from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Typography,
  Switch,
  Tag,
  Card,
  Tooltip,
  Badge,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

type Department = {
  _id: string;
  name: string;
  isActive: boolean;
  description?: string;
};

type Props = {
  data: Department[];
  loading: boolean;
  currentPage: number;
  total: number;
  canManage: boolean;
  onEdit: (record: Department) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onPageChange: (page: number) => void;
  onView?: (record: Department) => void;
};

const DepartmentTable: React.FC<Props> = ({
  data,
  loading,
  currentPage,
  total,
  canManage,
  onEdit,
  onDelete,
  onToggle,
  onPageChange,
  onView,
}) => {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? "#52c41a" : "#ff4d4f";
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 4 }} />
    ) : (
      <StopOutlined style={{ color: "#ff4d4f", marginRight: 4 }} />
    );
  };

  const columns = [
    {
      title: "STT",
      width: 80,
      align: "center" as const,
      render: (_: any, __: any, index: number) => {
        const order = (currentPage - 1) * 10 + index + 1;
        return (
          <Badge
            count={order}
            style={{
              backgroundColor: "#f0f0f0",
              color: "#595959",
              fontWeight: 500,
            }}
          />
        );
      },
    },
    {
      title: "Tên phòng ban",
      dataIndex: "name",
      render: (name: string, record: Department) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: 15 }}>
            {name}
          </Text>
          {onView && (
            <Button
              type="link"
              size="small"
              style={{ padding: 0, height: "auto", fontSize: 12 }}
              onClick={() => onView(record)}
              icon={<EyeOutlined />}
            >
              Xem chi tiết
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (text: string) => (
        <div style={{ maxWidth: 300 }}>
          {text ? (
            <Tooltip title={text}>
              <Text
                ellipsis={{ tooltip: text }}
                style={{
                  color: "#595959",
                  lineHeight: 1.5,
                  maxHeight: "2.5em",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {text}
              </Text>
            </Tooltip>
          ) : (
            <Text type="secondary" italic>
              Không có mô tả
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: 140,
      align: "center" as const,
      render: (_: any, record: Department) => (
        <Tag
          color={record.isActive ? "green" : "red"}
          style={{
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: `${getStatusColor(record.isActive)}15`,
            color: getStatusColor(record.isActive),
            border: `1px solid ${getStatusColor(record.isActive)}`,
          }}
          icon={getStatusIcon(record.isActive)}
        >
          {record.isActive ? "Hoạt động" : "Ngừng"}
        </Tag>
      ),
    },
    {
      title: "Bật/Tắt",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Department) =>
        canManage ? (
          <Tooltip title={record.isActive ? "Tắt hoạt động" : "Bật hoạt động"}>
            <Switch
              checked={record.isActive}
              checkedChildren="Bật"
              unCheckedChildren="Tắt"
              onChange={(checked) => onToggle(record._id, checked)}
              style={{
                backgroundColor: getStatusColor(record.isActive),
              }}
            />
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Hành động",
      width: 180,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: Department) =>
        canManage ? (
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                ghost
                size="middle"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                style={{
                  borderColor: "#1890ff",
                  color: "#1890ff",
                }}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Popconfirm
                title={
                  <div>
                    <Title level={5} style={{ marginBottom: 8 }}>
                      Xác nhận xóa
                    </Title>
                    <Text>
                      Bạn có chắc chắn muốn xóa phòng ban{" "}
                      <Text strong>"{record.name}"</Text>?
                    </Text>
                  </div>
                }
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{
                  danger: true,
                  icon: <DeleteOutlined />,
                }}
                cancelButtonProps={{ type: "text" }}
                onConfirm={() => onDelete(record._id)}
                placement="left"
              >
                <Button
                  type="primary"
                  danger
                  ghost
                  size="middle"
                  icon={<DeleteOutlined />}
                  style={{
                    borderColor: "#ff4d4f",
                    color: "#ff4d4f",
                  }}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total,
          onChange: onPageChange,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} phòng ban`,
          style: { padding: "16px 24px" },
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary">Không có dữ liệu phòng ban</Text>
              }
            />
          ),
        }}
        rowClassName={(record) =>
          record.isActive ? "row-active" : "row-inactive"
        }
        onRow={(record) => ({
          style: {
            background: record.isActive
              ? "rgba(82, 196, 26, 0.02)"
              : "rgba(255, 77, 79, 0.02)",
          },
        })}
        scroll={{ x: 1000 }}
        style={{
          borderRadius: 8,
          overflow: "hidden",
        }}
      />
    </Card>
  );
};

export default DepartmentTable;
