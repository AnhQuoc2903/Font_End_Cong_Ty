/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, Typography, Space, Avatar, Tag, Tooltip, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
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
      title: (
        <div>
          <span>THAO TÁC</span>
        </div>
      ),
      key: "action",
      width: 180,
      align: "center",
      fixed: "right",
      render: (_, r) =>
        canManage ? (
          <Space size={8}>
            <Tooltip
              title="Chỉnh sửa"
              color="#7c3aed"
              overlayInnerStyle={{
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              <Button
                type="text"
                icon={<EditOutlined style={{ fontSize: 16 }} />}
                onClick={() => onEdit(r)}
                style={{
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))",
                  color: "#7c3aed",
                  width: 40,
                  height: 40,
                  border: "1px solid rgba(124, 58, 237, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.05)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.1))";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(124, 58, 237, 0.25)";
                  e.currentTarget.style.borderColor = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.2)";
                }}
              />
            </Tooltip>

            <Tooltip
              title="Xóa"
              color="#ef4444"
              overlayInnerStyle={{
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                onClick={() => onDelete(r._id)}
                style={{
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
                  color: "#ef4444",
                  width: 40,
                  height: 40,
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.05)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(239, 68, 68, 0.25)";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
                }}
              />
            </Tooltip>
          </Space>
        ) : (
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(107, 114, 128, 0.05))",
              border: "1px solid rgba(107, 114, 128, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <EyeOutlined
              style={{
                fontSize: 14,
                color: "#6b7280",
              }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#6b7280",
                letterSpacing: "0.3px",
              }}
            >
              Chỉ xem
            </Text>
          </div>
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
