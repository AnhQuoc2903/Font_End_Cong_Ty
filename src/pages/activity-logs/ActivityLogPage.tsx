/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Typography,
  Space,
  Empty,
  Tooltip,
} from "antd";
import {
  HistoryOutlined,
  ClockCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { activityApi } from "../../api/activityApi";
import { useSearchParams } from "react-router-dom";
import ActivityStats from "../../components/activity/ActivityStats";
import ActivityFilters from "../../components/activity/ActivityFilters";
import ActionTag from "../../components/activity/ActionTag";
import ActorDisplay from "../../components/activity/ActorDisplay";
import ActionDetails from "../../components/activity/ActionDetails";
import "./ActivityLog.css";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;

const ActivityLogPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalActions: 0,
    todayActions: 0,
    userActions: 0,
  });

  const page = Number(searchParams.get("page") || 1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const dateRange = searchParams.get("dateRange");
      const actionFilter = searchParams.get("action") || undefined;
      const [fromDate, toDate] = dateRange ? dateRange.split(",") : [];

      const res = await activityApi.getUserLogs({
        page,
        limit: 10,
        action: actionFilter,
        fromDate,
        toDate,
      });

      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, searchParams]);

  const fetchStats = useCallback(async () => {
    const res = await activityApi.getStats();
    setStats(res.data);
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const handleExport = async () => {
    const dateRange = searchParams.get("dateRange");
    const actionFilter = searchParams.get("action") || undefined;
    const [fromDate, toDate] = dateRange ? dateRange.split(",") : [];

    const res = await activityApi.exportUserLogs({
      action: actionFilter,
      fromDate,
      toDate,
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity_logs.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "HÀNH ĐỘNG",
      dataIndex: "action",
      width: 220,
      render: (action: string) => <ActionTag action={action} />,
    },
    {
      title: "NGƯỜI THỰC HIỆN",
      width: 280,
      render: (_: any, record: any) => {
        const actor = record.actorSnapshot || record.actor;
        return <ActorDisplay actor={actor} isSystem={!actor} />;
      },
    },
    {
      title: "ĐỐI TƯỢNG",
      width: 280,
      render: (_: any, record: any) => {
        const target = record.targetSnapshot;
        return <ActorDisplay actor={target} title="Không có" />;
      },
    },
    {
      title: "CHI TIẾT",
      width: 280,
      render: (_: any, record: any) => (
        <ActionDetails
          action={record.action}
          after={record.after}
          details={record.details}
        />
      ),
    },
    {
      title: "THỜI GIAN",
      dataIndex: "createdAt",
      width: 180,
      render: (value: string) => (
        <Tooltip
          title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}
          placement="left"
        >
          <Space size={6} align="center">
            <ClockCircleOutlined style={{ color: "#1890ff" }} />
            <div>
              <Text strong style={{ fontSize: "12px" }}>
                {dayjs(value).format("HH:mm")}
              </Text>
              <div style={{ fontSize: "11px", color: "#999" }}>
                {dayjs(value).format("DD/MM/YYYY")}
              </div>
            </div>
          </Space>
        </Tooltip>
      ),
      sorter: (a: any, b: any) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend" as const,
    },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f5f7fa" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={2} style={{ marginBottom: "8px", color: "#1a1a1a" }}>
              <HistoryOutlined
                style={{ marginRight: "12px", color: "#1890ff" }}
              />
              Lịch sử hoạt động
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Theo dõi và quản lý tất cả các hoạt động trên hệ thống
            </Text>
          </div>

          <ActivityStats {...stats} />

          <Card
            bordered={false}
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
            title={
              <Space>
                <FilterOutlined style={{ color: "#1890ff" }} />
                <Text strong style={{ fontSize: "16px" }}>
                  Bộ lọc và tìm kiếm
                </Text>
              </Space>
            }
          >
            <ActivityFilters onExport={handleExport} />

            <Table
              rowKey="_id"
              loading={loading}
              columns={columns}
              dataSource={logs}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có dữ liệu hoạt động"
                  />
                ),
              }}
              pagination={{
                current: page,
                total,
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} trên ${total} bản ghi`,
                onChange: (p) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(p));
                  window.history.pushState({}, "", `?${params.toString()}`);
                },
                style: {
                  marginTop: "24px",
                  padding: "16px 0",
                },
              }}
              onRow={(record) => ({
                style: {
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.backgroundColor = "";
                },
                onClick: () => {
                  console.log("View details:", record);
                },
              })}
            />
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default ActivityLogPage;