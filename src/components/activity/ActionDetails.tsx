/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Typography } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface ActionDetailsProps {
  action: string;
  after?: Record<string, any>;
  details?: string;
}

const ActionDetails: React.FC<ActionDetailsProps> = ({
  action,
  after,
  details,
}) => {
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_USER: "Tạo người dùng",
      UPDATE_USER: "Cập nhật người dùng",
      DELETE_USER: "Xóa người dùng",
      CREATE_PRODUCT: "Tạo sản phẩm",
      UPDATE_PRODUCT: "Cập nhật sản phẩm",
      DELETE_PRODUCT: "Xóa sản phẩm",
    };
    return labels[action] || action;
  };

  const getActionIcon = () => {
    switch (action) {
      case "CREATE_USER":
      case "CREATE_PRODUCT":
        return <PlusOutlined style={{ color: "#52c41a" }} />;
      case "UPDATE_USER":
      case "UPDATE_PRODUCT":
        return <EditOutlined style={{ color: "#1890ff" }} />;
      case "DELETE_USER":
      case "DELETE_PRODUCT":
        return <DeleteOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <HistoryOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const renderChanges = () => {
    if (!after || Object.keys(after).length === 0) return null;

    return (
      <div style={{ marginTop: 4 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Thay đổi:
        </Text>
        <div style={{ marginLeft: 8 }}>
          {Object.entries(after)
            .slice(0, 2)
            .map(([key, value]) => (
              <div key={key} style={{ fontSize: 11, color: "#666" }}>
                • {key}:{" "}
                <Text code style={{ fontSize: 10 }}>
                  {String(value)}
                </Text>
              </div>
            ))}
          {Object.keys(after).length > 2 && (
            <Text
              type="secondary"
              style={{ fontSize: 10, fontStyle: "italic" }}
            >
              +{Object.keys(after).length - 2} thay đổi khác
            </Text>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxHeight: "140px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <div style={{ marginTop: "2px" }}>{getActionIcon()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: "12px",
              lineHeight: "1.4",
              color: "#1a1a1a",
              display: "block",
              fontWeight: 500,
            }}
          >
            {details || getActionLabel(action)}
          </Text>
          {renderChanges()}
        </div>
      </div>
    </div>
  );
};

export default ActionDetails;