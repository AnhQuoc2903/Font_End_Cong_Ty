/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Space, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ActorDisplayProps {
  actor?: any;
  title?: string;
  isSystem?: boolean;
}

const ActorDisplay: React.FC<ActorDisplayProps> = ({ 
  actor, 
  title, 
  isSystem = false 
}) => {
  if (isSystem || !actor) {
    return (
      <Space align="center">
        <Avatar
          style={{
            backgroundColor: "#f0f0f0",
            color: "#666",
          }}
          icon={<UserOutlined />}
        />
        <div>
          <Text strong style={{ color: "#666" }}>
            {title || "Hệ thống"}
          </Text>
          <div style={{ fontSize: "12px", color: "#999" }}>
            {isSystem ? "Tự động" : "Không có dữ liệu"}
          </div>
        </div>
      </Space>
    );
  }

  return (
    <Space align="center">
      <Avatar
        style={{
          backgroundColor: "#1890ff",
          color: "#fff",
        }}
        src={actor.avatar}
        icon={!actor.avatar && <UserOutlined />}
      />
      <div>
        <Text strong>{actor.fullName || "Không rõ tên"}</Text>
        <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
          {actor.email}
        </div>
      </div>
    </Space>
  );
};

export default ActorDisplay;