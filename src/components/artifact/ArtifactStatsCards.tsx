import React from "react";
import { Card, Row, Col, Typography,  } from "antd";
import {
  AppstoreOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface StatsCardsProps {
  stats: {
    total: number;
    inStock: number;
    newItems: number;
    outOfStock: number;
  };
}

const COLORS = {
  primary: "#1890ff",
  success: "#52c41a",
  error: "#f5222d",
};

export const ArtifactStatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          size="small"
          style={{ 
            background: "rgba(24, 144, 255, 0.05)",
            border: `1px solid rgba(24, 144, 255, 0.2)`,
            borderRadius: 8,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>Tổng hiện vật</Text>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary }}>
                {stats.total}
              </div>
            </div>
            <AppstoreOutlined style={{ fontSize: 24, color: COLORS.primary, opacity: 0.5 }} />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          size="small"
          style={{ 
            background: "rgba(82, 196, 26, 0.05)",
            border: `1px solid rgba(82, 196, 26, 0.2)`,
            borderRadius: 8,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>Còn hàng</Text>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.success }}>
                {stats.inStock}
              </div>
            </div>
            <DownloadOutlined style={{ fontSize: 24, color: COLORS.success, opacity: 0.5 }} />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          size="small"
          style={{ 
            background: "rgba(24, 144, 255, 0.05)",
            border: `1px solid rgba(24, 144, 255, 0.2)`,
            borderRadius: 8,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>Mới bổ sung</Text>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary }}>
                {stats.newItems}
              </div>
            </div>
            <PlusCircleOutlined style={{ fontSize: 24, color: COLORS.primary, opacity: 0.5 }} />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          size="small"
          style={{ 
            background: "rgba(245, 34, 45, 0.05)",
            border: `1px solid rgba(245, 34, 45, 0.2)`,
            borderRadius: 8,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>Hết hàng</Text>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.error }}>
                {stats.outOfStock}
              </div>
            </div>
            <MinusCircleOutlined style={{ fontSize: 24, color: COLORS.error, opacity: 0.5 }} />
          </div>
        </Card>
      </Col>
    </Row>
  );
};