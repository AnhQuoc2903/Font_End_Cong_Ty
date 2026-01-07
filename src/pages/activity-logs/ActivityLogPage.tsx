/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  Avatar,
  Select,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { activityApi } from "../../api/activityApi";
import { useSearchParams } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;

const ACTION_LABEL: Record<string, string> = {
  CREATE_USER: "Tạo người dùng",
  UPDATE_USER: "Cập nhật người dùng",
  DELETE_USER: "Xóa người dùng",
};

const ACTION_COLOR: Record<string, string> = {
  CREATE_USER: "success",
  UPDATE_USER: "processing",
  DELETE_USER: "error",
};

const ACTION_ICON: Record<string, React.ReactNode> = {
  CREATE_USER: <PlusOutlined />,
  UPDATE_USER: <EditOutlined />,
  DELETE_USER: <DeleteOutlined />,
};

const ActivityLogPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);

  const actionFilter = searchParams.get("action") || undefined;

  const page = Number(searchParams.get("page") || 1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await activityApi.getUserLogs({
        page,
        limit: 10,
        action: actionFilter,
      });
      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      title: "Hành động",
      dataIndex: "action",
      width: 200,
      render: (action: string) => (
        <Tag
          icon={ACTION_ICON[action]}
          color={ACTION_COLOR[action]}
          style={{ padding: "4px 10px" }}
        >
          {ACTION_LABEL[action] || action}
        </Tag>
      ),
    },
    {
      title: "Người thực hiện",
      width: 280,
      render: (_: any, record: any) => {
        const actor = record.actorSnapshot || record.actor;
        if (!actor) {
          return (
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text type="secondary">Hệ thống</Text>
            </Space>
          );
        }

        return (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <div>
              <Text strong>{actor.fullName || "Không rõ tên"}</Text>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                {actor.email}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Đối tượng",
      width: 280,
      render: (_: any, record: any) => {
        const target = record.targetSnapshot;
        if (!target) {
          return <Text type="secondary">—</Text>;
        }

        return (
          <Space>
            <Avatar
              style={{ backgroundColor: "#f97316" }}
              icon={<UserOutlined />}
            />
            <div>
              <Text strong>{target.fullName || "Không rõ tên"}</Text>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                {target.email}
              </div>
            </div>
          </Space>
        );
      },
    },

    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <Space size={6}>
            <ClockCircleOutlined />
            <Text>{dayjs(value).fromNow()}</Text>
          </Space>
        </Tooltip>
      ),
      sorter: (a: any, b: any) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend" as const,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        style={{ borderRadius: 12 }}
        title={
          <Space>
            <HistoryOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Lịch sử thao tác hệ thống
            </Title>
          </Space>
        }
        extra={
          <Select
            allowClear
            placeholder="Lọc theo hành động"
            style={{ width: 200 }}
            onChange={(value) => {
              setSearchParams({
                page: "1",
                ...(value ? { action: value } : {}),
              });
            }}
          >
            <Select.Option value="CREATE_USER">Tạo</Select.Option>
            <Select.Option value="UPDATE_USER">Cập nhật</Select.Option>
            <Select.Option value="DELETE_USER">Xóa</Select.Option>
          </Select>
        }
      >
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={logs}
          pagination={{
            current: page,
            total,
            pageSize: 10,
            showTotal: (t) => `Tổng ${t} bản ghi`,
            onChange: (p) => {
              setSearchParams({
                page: String(p),
                ...(actionFilter ? { action: actionFilter } : {}),
              });
            },
          }}
        />
      </Card>
    </div>
  );
};

export default ActivityLogPage;
