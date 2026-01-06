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
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
}) => {
  return (
    <Table
      rowKey="_id"
      loading={loading}
      dataSource={data}
      pagination={{
        current: currentPage,
        pageSize: 10,
        total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
      columns={[
        {
          title: "STT",
          width: 80,
          align: "center",
          render: (_, __, index) => index + 1,
        },
        {
          title: "Tên phòng ban",
          dataIndex: "name",
          render: (name) => <Text strong>{name}</Text>,
        },
        {
          title: "Mô tả",
          dataIndex: "description",
          render: (text) =>
            text ? (
              <span style={{ color: "#595959" }}>{text}</span>
            ) : (
              <span style={{ color: "#bfbfbf" }}>—</span>
            ),
        },

        {
          title: "Trạng thái",
          width: 140,
          align: "center",
          render: (_, record) => (
            <Tag color={record.isActive ? "green" : "red"}>
              {record.isActive ? "Hoạt động" : "Ngừng"}
            </Tag>
          ),
        },
        {
          title: "Bật / Tắt",
          width: 120,
          align: "center",
          render: (_, record) =>
            canManage ? (
              <Switch
                checked={record.isActive}
                onChange={(checked) => onToggle(record._id, checked)}
              />
            ) : null,
        },
        {
          title: "Hành động",
          width: 160,
          align: "center",
          render: (_, record) =>
            canManage ? (
              <Space>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                />
                <Popconfirm
                  title="Xóa phòng ban?"
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onDelete(record._id)}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ) : null,
        },
      ]}
    />
  );
};

export default DepartmentTable;
