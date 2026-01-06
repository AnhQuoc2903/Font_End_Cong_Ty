import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  AppstoreOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import "./artifact.css";

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
          className="stats-card stats-card--primary"
          bodyStyle={{ padding: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Tổng hiện vật
              </Text>
              <div
                style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary }}
              >
                {stats.total}
              </div>
            </div>
            <AppstoreOutlined className="stats-card__icon" />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          className="stats-card stats-card--success"
          bodyStyle={{ padding: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Còn hàng
              </Text>
              <div
                style={{ fontSize: 24, fontWeight: 700, color: COLORS.success }}
              >
                {stats.inStock}
              </div>
            </div>
            <DownloadOutlined className="stats-card__icon stats-card__icon--success" />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          className="stats-card stats-card--primary"
          bodyStyle={{ padding: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Mới bổ sung
              </Text>
              <div
                style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary }}
              >
                {stats.newItems}
              </div>
            </div>
            <PlusCircleOutlined className="stats-card__icon stats-card__icon--primary" />
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          className="stats-card stats-card--error"
          bodyStyle={{ padding: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Hết hàng
              </Text>
              <div
                style={{ fontSize: 24, fontWeight: 700, color: COLORS.error }}
              >
                {stats.outOfStock}
              </div>
            </div>
            <MinusCircleOutlined className="stats-card__icon stats-card__icon--error" />
          </div>
        </Card>
      </Col>
    </Row>
  );
};
