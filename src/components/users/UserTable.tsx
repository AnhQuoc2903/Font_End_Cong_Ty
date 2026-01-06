/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Typography,
  Badge,
  Popconfirm,
  Avatar,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

type UserTableProps = {
  data: any[];
  loading: boolean;
  currentPage: number;
  canManage: boolean;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
  onPageChange: (pagination: any) => void;
};

type Department = {
  _id: string;
  name: string;
  isActive?: boolean;
};

type Role = { _id: string; name: string };
type UserRow = {
  _id: string;
  email: string;
  fullName?: string;
  isActive?: boolean;
  roles?: Role[];
  department?: Department;
};

const UserTable: React.FC<UserTableProps> = ({
  data,
  loading,
  currentPage,
  canManage,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const columns: ColumnsType<UserRow> = [
    {
      title: "STT",
      key: "index",
      align: "center",
      width: 70,
      render: (_, __, index) => (
        <Text style={{ fontWeight: 500 }}>
          {index + 1 + (currentPage - 1) * 10}
        </Text>
      ),
    },
    {
      title: "Thông tin người dùng",
      key: "info",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Space align="center">
            <UserOutlined style={{ color: "#1890ff" }} />
            <Text strong>{record.fullName || "Chưa có tên"}</Text>
          </Space>
          <Space align="center">
            <MailOutlined style={{ color: "#8c8c8c", fontSize: 12 }} />
            <Text type="secondary">{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      key: "roles",
      render: (_, record) => (
        <Space wrap>
          {(record.roles || []).map((r) => (
            <Tag
              key={r._id}
              color={r.name === "Admin" ? "red" : "blue"}
              style={{ borderRadius: 12, padding: "2px 8px" }}
            >
              {r.name}
            </Tag>
          ))}
        </Space>
      ),
    },
   {
  title: "Phòng ban",
  key: "department",
  width: 180,
  render: (_, record) => {
    const department = record.department;

    if (!department) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#8c8c8c",
          }}
        >
          <MinusCircleOutlined style={{ fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Chưa phân công
          </Text>
        </div>
      );
    }

    const isActive = department.isActive === true;
    
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Avatar nhỏ */}
        <Tooltip title={department.name}>
          <Avatar
            size={28}
            style={{
              background: isActive ? "#13c2c2" : "#ff7875",
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {department.name.charAt(0).toUpperCase()}
          </Avatar>
        </Tooltip>

        {/* Tên và indicator */}
        <div style={{ minWidth: 0 }}>
          <Text
            strong
            style={{
              fontSize: 12,
              display: "block",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {department.name}
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isActive ? "#52c41a" : "#ff4d4f",
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: isActive ? "#52c41a" : "#ff4d4f",
              }}
            >
              {isActive ? "Đang hoạt động" : "Không hoạt động"}
            </Text>
          </div>
        </div>
      </div>
    );
  },
},

    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Badge
          status={record.isActive ? "success" : "error"}
          text={
            record.isActive ? (
              <Text type="success">Hoạt động</Text>
            ) : (
              <Text type="danger">Vô hiệu hóa</Text>
            )
          }
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) =>
        canManage ? (
          <Space>
            <Tooltip title="Sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                style={{ color: "#1890ff" }}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa người dùng?"
              description="Bạn có chắc chắn muốn xóa người dùng này?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(record._id)}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  style={{ color: "#ff4d4f" }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  return (
    <Table
      rowKey="_id"
      loading={loading}
      dataSource={data}
      columns={columns}
      onChange={onPageChange}
      pagination={{
        current: currentPage,
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trên ${total} người dùng`,
        style: { marginBottom: 0 },
      }}
      rowClassName={(record) => (record.isActive ? "" : "row-disabled")}
      style={{
        borderRadius: 6,
        overflow: "hidden",
      }}
    />
  );
};

export default UserTable;
