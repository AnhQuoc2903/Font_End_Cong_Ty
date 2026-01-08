import React from "react";
import { Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

interface ActionTagProps {
  action: string;
}

const ActionTag: React.FC<ActionTagProps> = ({ action }) => {
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

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE_USER: "green",
      UPDATE_USER: "blue",
      DELETE_USER: "red",
      CREATE_PRODUCT: "green",
      UPDATE_PRODUCT: "cyan",
      DELETE_PRODUCT: "volcano",
    };
    return colors[action] || "default";
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, React.ReactNode> = {
      CREATE_USER: <PlusOutlined />,
      UPDATE_USER: <EditOutlined />,
      DELETE_USER: <DeleteOutlined />,
      CREATE_PRODUCT: <PlusOutlined />,
      UPDATE_PRODUCT: <EditOutlined />,
      DELETE_PRODUCT: <DeleteOutlined />,
    };
    return icons[action];
  };

  return (
    <Tag
      icon={getActionIcon(action)}
      color={getActionColor(action)}
      style={{
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        border: "none",
      }}
    >
      {getActionLabel(action)}
    </Tag>
  );
};

export default ActionTag;