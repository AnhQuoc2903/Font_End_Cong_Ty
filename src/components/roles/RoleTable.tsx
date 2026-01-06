/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, Typography, Space, Avatar, Tag, Tooltip, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, KeyOutlined } from "@ant-design/icons";
import type { RoleRow } from "./types.ts";

const { Text } = Typography;

interface RoleTableProps {
  data: RoleRow[];
  loading: boolean;
  page: number;
  canManage: boolean;
  onEdit: (role: RoleRow) => void;
  onDelete: (id: string) => void;
  onPageChange: (pagination: any) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({
  data,
  loading,
  page,
  canManage,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const columns: ColumnsType<RoleRow> = [
    {
      title: "STT",
      align: "center",
      width: 60,
      render: (_value, _record, index) => (
        <Text strong>{(page - 1) * 10 + index + 1}</Text>
      ),
    },
    {
      title: "VAI TRÒ",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<KeyOutlined />}
            size="small"
          />
          <Text strong style={{ fontSize: 15 }}>
            {name}
          </Text>
        </Space>
      ),
    },
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
      render: (desc) =>
        desc ? (
          <Text style={{ color: "#666" }}>{desc}</Text>
        ) : (
          <Text style={{ color: "#d9d9d9", fontStyle: "italic" }}>
            Chưa có mô tả
          </Text>
        ),
    },
    {
      title: "QUYỀN",
      key: "perms",
      width: 280,
      render: (_, r) => {
        const perms = r.permissions || [];

        if (!perms.length) {
          return <Tag color="default">Không có quyền</Tag>;
        }

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {perms.slice(0, 3).map((p) => (
              <Tooltip
                key={p._id}
                title={
                  <div>
                    <div>
                      <strong>{p.description}</strong>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      Nhóm: {p.group || "Khác"}
                    </div>
                  </div>
                }
              >
                <Tag
                  color="blue"
                  style={{
                    borderRadius: 12,
                    padding: "4px 10px",
                    fontWeight: 500,
                    cursor: "default",
                  }}
                >
                  {p.description}
                </Tag>
              </Tooltip>
            ))}

            {perms.length > 3 && (
              <Tooltip
                title={
                  <div>
                    {perms.slice(3).map((p) => (
                      <div key={p._id}>
                        • {p.description}{" "}
                        <span style={{ color: "#999" }}>({p.group})</span>
                      </div>
                    ))}
                  </div>
                }
              >
                <Tag
                  color="cyan"
                  style={{
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  +{perms.length - 3} quyền khác
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },

    {
      title: "THAO TÁC",
      key: "action",
      width: 160,
      align: "center",
      render: (_, r) =>
        canManage ? (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(r)}
                style={{ color: "#1890ff" }}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(r._id)}
              />
            </Tooltip>
          </Space>
        ) : (
          <Tag color="default">Chỉ xem</Tag>
        ),
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
        current: page,
        showQuickJumper: true,
        showTotal: (t, range) =>
          `Hiển thị ${range[0]}-${range[1]} trong ${t} vai trò`,
        style: { marginTop: 16 },
      }}
      style={{
        marginTop: 16,
        borderRadius: 12,
        overflow: "hidden",
      }}
      rowClassName={() => "hover-row"}
    />
  );
};

export default RoleTable;
