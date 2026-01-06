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
};

type Props = {
  data: Department[];
  loading: boolean;
  canManage: boolean;
  onEdit: (record: Department) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void; // ✅ THÊM
};

const DepartmentTable: React.FC<Props> = ({
  data,
  loading,
  canManage,
  onEdit,
  onDelete,
  onToggle, // ✅ NHẬN
}) => {
  return (
    <Table
      rowKey="_id"
      loading={loading}
      dataSource={data}
      pagination={false}
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
                onChange={(checked) =>
                  onToggle(record._id, checked)
                }
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
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Space>
            ) : null,
        },
      ]}
    />
  );
};

export default DepartmentTable;
