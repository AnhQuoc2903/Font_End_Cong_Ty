/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Table,
  Tag,
  Space,
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
  HistoryOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./User.css";

const { Text } = Typography;

type UserTableProps = {
  data: any[];
  loading: boolean;
  currentPage: number;
  canManage: boolean;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
  onPageChange: (pagination: any) => void;
  onViewHistory: (userId: string) => void;
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
  phone?: string; // ✅ THÊM
  avatar?: string;
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
  onViewHistory,
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
        <Space align="start">
          <Avatar
            size={40}
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
          />

          <Space direction="vertical" size={2}>
            <Text strong>{record.fullName || "Chưa có tên"}</Text>

            <Space size={6}>
              <MailOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
              <Text type="secondary">{record.email}</Text>
            </Space>

            {record.phone && (
              <Space size={6}>
                <span style={{ fontSize: 12 }}>📞</span>
                <Text type="secondary">{record.phone}</Text>
              </Space>
            )}
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
      width: 160,
      render: (_, record) =>
        canManage ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              padding: "8px 0",
            }}
          >
            {/* Edit - Blue */}
            <div
              className="action-button edit-action"
              onClick={() => onEdit(record)}
              title="Chỉnh sửa"
              style={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                border: "1px solid #91d5ff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <EditOutlined style={{ color: "#1890ff", fontSize: 14 }} />
            </div>

            {/* History - Purple */}
            <div
              className="action-button history-action"
              onClick={() => onViewHistory(record._id)}
              title="Lịch sử"
              style={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)",
                border: "1px solid #d3adf7",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <HistoryOutlined style={{ color: "#722ed1", fontSize: 14 }} />
            </div>

            {/* Delete - Red */}
            <Popconfirm
              title="Xóa người dùng?"
              description="Thao tác này không thể hoàn tác"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(record._id)}
            >
              <div
                className="action-button delete-action"
                title="Xóa"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)",
                  border: "1px solid #ffa39e",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 14 }} />
              </div>
            </Popconfirm>
          </div>
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
