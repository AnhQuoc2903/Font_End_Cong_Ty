import React from "react";
import { Table, Tag, Typography, Badge, Avatar, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PictureOutlined } from "@ant-design/icons";
import type { Artifact } from "./types";
import ArtifactActionCell from "./ArtifactActionCell";

const { Text } = Typography;

interface ArtifactTableProps {
  data: Artifact[];
  loading: boolean;
  page: number;
  hasPermission: (permission: string) => boolean;
  onTableChange: (pagination: TablePaginationConfig) => void;
  onOpenModal: (
    type: "edit" | "import" | "export" | "adjust",
    record?: Artifact
  ) => void;
  onOpenHistory: (record: Artifact) => void;
  onOpenGoogle: (record: Artifact) => void;
  onOpenDetail: (record: Artifact) => void;
  onDeleteArtifact: (record: Artifact) => void;
}

const COLORS = {
  primary: "#1890ff",
  success: "#52c41a",
  error: "#f5222d",
  background: "#fafafa",
  text: "#262626",
  textSecondary: "#8c8c8c",
};

const shorten = (s = "", n = 30) =>
  s && s.length > n ? `${s.slice(0, n)}...` : s || "-";

const getStatusBadge = (status?: Artifact["status"]) => {
  if (!status) return <Tag>-</Tag>;

  const config = {
    bosung: {
      label: "Mới bổ sung",
      badge: "processing" as const,
      color: COLORS.primary,
    },
    con: {
      label: "Còn hàng",
      badge: "success" as const,
      color: COLORS.success,
    },
    ban: { label: "Hết hàng", badge: "error" as const, color: COLORS.error },
  }[status];

  if (!config) return <Tag>{status}</Tag>;

  return (
    <Badge
      status={config.badge}
      text={config.label}
      style={{ color: config.color, fontWeight: 500 }}
    />
  );
};

export const ArtifactTable: React.FC<ArtifactTableProps> = ({
  data,
  loading,
  page,
  hasPermission,
  onTableChange,
  onOpenModal,
  onOpenHistory,
  onOpenGoogle,
  onOpenDetail,
  onDeleteArtifact,
}) => {
  const columns: ColumnsType<Artifact> = [
    {
      title: "STT",
      align: "center",
      width: 60,
      render: (_value, _record, index) => (
        <Text strong>{(page - 1) * 10 + index + 1}</Text>
      ),
    },
    {
      title: "Mã hiện vật",
      dataIndex: "code",
      width: 130,
      render: (code: string, record) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                record.status === "bosung"
                  ? COLORS.primary
                  : record.status === "con"
                  ? COLORS.success
                  : COLORS.error,
            }}
          />
          <Text
            strong
            style={{
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            {shorten(code, 12)}
          </Text>
        </div>
      ),
    },
    {
      title: "Ảnh",
      width: 110,
      align: "center",
      render: (_, record) => (
        <Avatar
          size={100}
          shape="square"
          src={record.images?.[0]?.url}
          style={{
            borderRadius: 12,
            border: "2px solid #f0f0f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            background: "#fafafa",
          }}
        >
          {!record.images?.length && (
            <PictureOutlined style={{ fontSize: 32, color: "#bfbfbf" }} />
          )}
        </Avatar>
      ),
    },

    {
      title: "Tên hiện vật",
      dataIndex: "name",
      width: 150,
      render: (name: string) => (
        <div>
          <Tooltip title={name}>
            <Text
              strong
              style={{
                fontSize: 15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Text>
          </Tooltip>
        </div>
      ),
    },

    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      width: 140,
      render: (name?: string) => <Text>{name ? shorten(name, 18) : "-"}</Text>,
    },
    {
      title: "Tồn kho",
      dataIndex: "quantityCurrent",
      align: "center",
      width: 110,
      render: (qty: number, record) => {
        const color =
          record.status === "ban"
            ? COLORS.error
            : record.status === "bosung"
            ? COLORS.primary
            : COLORS.success;

        return (
          <Text strong style={{ color }}>
            {qty}
          </Text>
        );
      },
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      width: 140,
      render: (loc?: string) => <Text>{loc || "-"}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: getStatusBadge,
    },
    {
      title: "THAO TÁC",
      width: 90,
      render: (_, record) => (
        <ArtifactActionCell
          record={record}
          hasPermission={hasPermission}
          onOpenModal={onOpenModal}
          onOpenHistory={onOpenHistory}
          onOpenGoogle={onOpenGoogle}
          onOpenDetail={onOpenDetail}
          onDeleteArtifact={onDeleteArtifact}
        />
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      loading={loading}
      columns={columns}
      dataSource={data}
      onChange={onTableChange}
      pagination={{
        current: page,
        pageSize: 10,
        // showSizeChanger: true,
        // showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} hiện vật`,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default ArtifactTable;
