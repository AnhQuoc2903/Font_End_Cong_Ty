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
  Row,
  Col,
  Button,
  DatePicker,
  Empty,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  FilterOutlined,
  DownloadOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { activityApi } from "../../api/activityApi";
import { useSearchParams } from "react-router-dom";
import "./ActivityLog.css";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ACTION_LABEL: Record<string, string> = {
  CREATE_USER: "Tạo người dùng",
  UPDATE_USER: "Cập nhật người dùng",
  DELETE_USER: "Xóa người dùng",
  CREATE_PRODUCT: "Tạo sản phẩm",
  UPDATE_PRODUCT: "Cập nhật sản phẩm",
  DELETE_PRODUCT: "Xóa sản phẩm",
  UPDATE_PROFILE: "Cập nhật thông tin cá nhân",
  UPDATE_AVATAR: "Cập nhật ảnh đại diện",
  DELETE_AVATAR: "Xóa ảnh đại diện",
};

const ACTION_COLOR: Record<string, string> = {
  CREATE_USER: "green",
  UPDATE_USER: "blue",
  DELETE_USER: "red",
  CREATE_PRODUCT: "green",
  UPDATE_PRODUCT: "cyan",
  DELETE_PRODUCT: "volcano",
  UPDATE_PROFILE: "cyan",
  UPDATE_AVATAR: "purple",
  DELETE_AVATAR: "volcano",
};

const ACTION_ICON: Record<string, React.ReactNode> = {
  CREATE_USER: <PlusOutlined />,
  UPDATE_USER: <EditOutlined />,
  DELETE_USER: <DeleteOutlined />,
  CREATE_PRODUCT: <PlusOutlined />,
  UPDATE_PRODUCT: <EditOutlined />,
  DELETE_PRODUCT: <DeleteOutlined />,
  UPDATE_PROFILE: <EditOutlined />,
  UPDATE_AVATAR: <UserOutlined />,
  DELETE_AVATAR: <DeleteOutlined />,
};

const ActivityLogPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalActions: 0,
    todayActions: 0,
    userActions: 0,
  });

  const actionFilter = searchParams.get("action") || undefined;
  const page = Number(searchParams.get("page") || 1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const dateRange = searchParams.get("dateRange");
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
  }, [page, actionFilter, searchParams]);

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

  const renderAvatarChange = (before?: string, after?: string) => {
    return (
      <Space align="center" size={12}>
        <Avatar
          src={before}
          icon={!before && <UserOutlined />}
          size={40}
          style={{ border: "1px solid #e5e7eb" }}
        />

        <ArrowRightOutlined style={{ color: "#94a3b8" }} />

        <Avatar
          src={after}
          icon={!after && <UserOutlined />}
          size={40}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </Space>
    );
  };

  const columns = [
    {
      title: "HÀNH ĐỘNG",
      dataIndex: "action",
      width: 220,
      render: (action: string) => (
        <Tag
          icon={ACTION_ICON[action]}
          color={ACTION_COLOR[action]}
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
          {ACTION_LABEL[action] || action}
        </Tag>
      ),
    },
    {
      title: "NGƯỜI THỰC HIỆN",
      width: 280,
      render: (_: any, record: any) => {
        const actor = record.actorSnapshot || record.actor;
        if (!actor) {
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
                  Hệ thống
                </Text>
                <div style={{ fontSize: "12px", color: "#999" }}>Tự động</div>
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
      },
    },
    {
      title: "ĐỐI TƯỢNG",
      width: 280,
      render: (_: any, record: any) => {
        const target = record.targetSnapshot;
        if (!target) {
          return (
            <Text type="secondary" style={{ fontStyle: "italic" }}>
              — Không có —
            </Text>
          );
        }

        return (
          <Space align="center">
            <Avatar
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
              }}
              src={target.avatar}
              icon={!target.avatar && <UserOutlined />}
            />
            <div>
              <Text strong>{target.fullName || "Không rõ tên"}</Text>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {target.email}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "CHI TIẾT",
      width: 300,
      render: (_: any, record: any) => {
        const { action, after, details } = record;

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
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Thay đổi:
              </Text>
              <div style={{ marginLeft: 8 }}>
                {Object.entries(after)
                  .slice(0, 2)
                  .map(([key, value]) => {
                    if (key === "avatar") {
                      return (
                        <div key={key} style={{ marginTop: 8 }}>
                          <Text strong style={{ fontSize: 12 }}>
                            Ảnh đại diện:
                          </Text>
                          <div style={{ marginTop: 6 }}>
                            {renderAvatarChange(
                              record.before?.avatar,
                              value as string
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        style={{
                          fontSize: 12,
                          color: "#666",
                          marginTop: 4,
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ marginRight: 4 }}>•</span>
                        <span style={{ flexShrink: 0, marginRight: 6 }}>
                          {key}:
                        </span>
                        <Text
                          code
                          style={{
                            fontSize: 11,
                            padding: "1px 4px",
                            borderRadius: 4,
                            backgroundColor: "#f5f5f5",
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={String(value)}
                        >
                          {String(value)}
                        </Text>
                      </div>
                    );
                  })}

                {Object.keys(after).length > 2 && (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 11,
                      fontStyle: "italic",
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    +{Object.keys(after).length - 2} thay đổi khác
                  </Text>
                )}
              </div>
            </div>
          );
        };

        return (
          <Tooltip
            title={
              <div style={{ maxWidth: 400 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Mô tả:</Text>
                  <div style={{ marginTop: 4 }}>
                    {details || ACTION_LABEL[action] || action}
                  </div>
                </div>
                {after && Object.keys(after).length > 0 && (
                  <div>
                    <Text strong>Chi tiết thay đổi:</Text>
                    {Object.entries(after).map(([key, value]) => (
                      <div key={key} style={{ fontSize: 12, marginTop: 4 }}>
                        • <Text strong>{key}:</Text> {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
            placement="left"
            overlayStyle={{ maxWidth: 400 }}
          >
            <div
              style={{
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  {getActionIcon()}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  {/* Mô tả chính */}
                  <Text
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.4",
                      color: "#1a1a1a",
                      display: "block",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={details || ACTION_LABEL[action] || action}
                  >
                    {details || ACTION_LABEL[action] || action}
                  </Text>

                  {renderChanges()}
                </div>
              </div>
            </div>
          </Tooltip>
        );
      },
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
          {/* Header */}
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

          {/* Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
            <Col xs={24} md={12} lg={12}>
              <Card
                className="stat-card"
                bordered={false}
                style={{
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                    {stats.totalActions}
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
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
                    {stats.todayActions}
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

          {/* Main Card */}
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
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  style={{
                    height: 40,
                    padding: "0 20px",
                    borderRadius: 8,
                    background:
                      "linear-gradient(135deg, #0a9f47 0%, #21c55d 100%)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(10, 159, 71, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #0a9f47 0%, #16a34a 100%)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(10, 159, 71, 0.4)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #0a9f47 0%, #21c55d 100%)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(10, 159, 71, 0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Xuất file
                </Button>
              </Space>
            }
          >
            {/* Filters */}
            <Space wrap size="middle" style={{ marginBottom: "24px" }}>
              <Select
                allowClear
                placeholder="Lọc theo hành động"
                style={{ width: 200, borderRadius: "8px" }}
                suffixIcon={<FilterOutlined />}
                onChange={(value) => {
                  setSearchParams({
                    page: "1",
                    ...(value ? { action: value } : {}),
                  });
                }}
                value={actionFilter}
              >
                <Select.Option value="CREATE_USER">
                  Tạo người dùng
                </Select.Option>
                <Select.Option value="UPDATE_USER">
                  Cập nhật người dùng
                </Select.Option>
                <Select.Option value="DELETE_USER">
                  Xóa người dùng
                </Select.Option>
              </Select>

              <RangePicker
                style={{ borderRadius: "8px" }}
                placeholder={["Từ ngày", "Đến ngày"]}
                onChange={(dates) => {
                  if (dates) {
                    setSearchParams({
                      page: "1",
                      dateRange: dates
                        .map((d) => d?.format("YYYY-MM-DD"))
                        .join(","),
                    });
                  } else {
                    const params = new URLSearchParams(searchParams);
                    params.delete("dateRange");
                    setSearchParams(params);
                  }
                }}
              />
            </Space>

            {/* Table */}
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
                  setSearchParams({
                    page: String(p),
                    ...(actionFilter ? { action: actionFilter } : {}),
                  });
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

          {/* Footer note */}
          <div
            style={{
              textAlign: "center",
              padding: "16px",
              color: "#666",
              fontSize: "12px",
            }}
          ></div>
        </Space>
      </div>
    </div>
  );
};

export default ActivityLogPage;
