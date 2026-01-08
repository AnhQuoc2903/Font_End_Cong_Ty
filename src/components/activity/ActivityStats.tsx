import React from "react";
import { Card, Row, Col} from "antd";
import { HistoryOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";


interface ActivityStatsProps {
  totalActions: number;
  todayActions: number;
  userActions: number;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({
  totalActions,
  todayActions,
}) => {
  return (
    <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
      <Col xs={24} md={12} lg={12}>
        <Card
          className="stat-card"
          bordered={false}
          style={{
            borderRadius: "16px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            height: "140px",
            display: "flex",
            alignItems: "center",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          bodyStyle={{
            padding: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.9,
                marginBottom: "12px",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              Tổng hoạt động
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {totalActions}
            </div>
            <div
              style={{
                fontSize: "12px",
                opacity: 0.8,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <HistoryOutlined />
              <span>Tất cả hoạt động hệ thống</span>
            </div>
          </div>
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "20px",
            }}
          >
            <HistoryOutlined
              style={{ fontSize: "32px", color: "#fff", opacity: 0.9 }}
            />
          </div>
        </Card>
      </Col>

      <Col xs={24} md={12} lg={12}>
        <Card
          className="stat-card"
          bordered={false}
          style={{
            borderRadius: "16px",
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "#fff",
            height: "140px",
            display: "flex",
            alignItems: "center",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(79, 172, 254, 0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          bodyStyle={{
            padding: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.9,
                marginBottom: "12px",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              Hôm nay
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {todayActions}
            </div>
            <div
              style={{
                fontSize: "12px",
                opacity: 0.8,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ClockCircleOutlined />
              <span>Cập nhật lúc {dayjs().format("HH:mm")}</span>
            </div>
          </div>
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "20px",
            }}
          >
            <ClockCircleOutlined
              style={{ fontSize: "32px", color: "#fff", opacity: 0.9 }}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ActivityStats;