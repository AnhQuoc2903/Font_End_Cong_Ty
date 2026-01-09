/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Typography,
  Tag,
  Descriptions,
  Space,
  Avatar,
  Empty,
  Button,
  Tooltip,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Timeline,
  Divider,
  Badge,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  PlusOutlined,
  HistoryOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { activityApi } from "../../api/activityApi";
import "./UserActivityModal.css";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Title } = Typography;

const ACTION_LABEL: Record<string, string> = {
  CREATE_USER: "Tạo người dùng",
  UPDATE_USER: "Cập nhật người dùng",
  UPDATE_PROFILE: "Cập nhật hồ sơ",
  UPDATE_AVATAR: "Cập nhật ảnh đại diện",
};

const ACTION_COLOR: Record<string, string> = {
  CREATE_USER: "#52c41a",
  UPDATE_USER: "#1890ff",
  UPDATE_PROFILE: "#722ed1",
  UPDATE_AVATAR: "#eb2f96",
};

const ACTION_ICON: Record<string, React.ReactNode> = {
  CREATE_USER: <PlusOutlined />,
  UPDATE_USER: <EditOutlined />,
  UPDATE_PROFILE: <UserOutlined />,
  UPDATE_AVATAR: <UserOutlined />,
};

const ACTION_BG_COLOR: Record<string, string> = {
  CREATE_USER: "rgba(82, 196, 26, 0.1)",
  UPDATE_USER: "rgba(24, 144, 255, 0.1)",
  UPDATE_PROFILE: "rgba(114, 46, 209, 0.1)",
  UPDATE_AVATAR: "rgba(235, 47, 150, 0.1)",
};

type Props = {
  open: boolean;
  userId?: string;
  userName?: string;
  onClose: () => void;
};

const UserActivityModal: React.FC<Props> = ({
  open,
  userId,
  userName,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    if (!open || !userId) return;

    let mounted = true;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await activityApi.getLogsByUserId(userId);
        if (mounted) {
          setLogs(res.data.data || []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      mounted = false;
      setExpandedRow(null);
      setActiveFilter("ALL");
    };
  }, [open, userId]);

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === "ALL") return true;

    if (activeFilter === "UPDATE_USER") {
      return ["UPDATE_USER", "UPDATE_PROFILE", "UPDATE_AVATAR"].includes(
        log.action
      );
    }

    return log.action === activeFilter;
  });

  const stats = {
    total: logs.length,
    create: logs.filter((l) => l.action === "CREATE_USER").length,
    update: logs.filter((l) =>
      ["UPDATE_USER", "UPDATE_PROFILE", "UPDATE_AVATAR"].includes(l.action)
    ).length,
    delete: logs.filter((l) => l.action === "DELETE_USER").length,
  };

  const renderChangeDetails = (record: any) => {
    if (
      !["UPDATE_USER", "UPDATE_PROFILE", "UPDATE_AVATAR"].includes(
        record.action
      )
    )
      return null;

    const changes = [];

    // 🔹 HỌ TÊN
    if (record.before?.fullName !== record.after?.fullName) {
      changes.push({
        field: "Họ tên",
        before: record.before?.fullName || "(Trống)",
        after: record.after?.fullName || "(Trống)",
      });
    }
    if (record.before?.phone !== record.after?.phone) {
      changes.push({
        field: "Số điện thoại",
        before: record.before?.phone || "(Trống)",
        after: record.after?.phone || "(Trống)",
      });
    }

    if (record.before?.avatar !== record.after?.avatar) {
      changes.push({
        field: "Ảnh đại diện",
        before: record.before?.avatar || null,
        after: record.after?.avatar || null,
      });
    }

    // 🔹 TRẠNG THÁI
    if (record.before?.isActive !== record.after?.isActive) {
      changes.push({
        field: "Trạng thái",
        before: record.before?.isActive,
        after: record.after?.isActive,
      });
    }

    // 🔹 VAI TRÒ
    if (record.before?.roles && record.after?.roles) {
      const beforeRoles = Array.isArray(record.before.roles)
        ? record.before.roles.join(", ")
        : record.before.roles;

      const afterRoles = Array.isArray(record.after.roles)
        ? record.after.roles.join(", ")
        : record.after.roles;

      if (beforeRoles !== afterRoles) {
        changes.push({
          field: "Vai trò",
          before: beforeRoles || "Không có",
          after: afterRoles || "Không có",
        });
      }
    }

    // 🔹 PHÒNG BAN
    if (record.before?.department !== record.after?.department) {
      changes.push({
        field: "Phòng ban",
        before: record.before?.department || "Không có",
        after: record.after?.department || "Không có",
      });
    }

    if (changes.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Text type="secondary">Không có thay đổi chi tiết</Text>
        </div>
      );
    }

    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5} style={{ marginBottom: 12, color: "#1890ff" }}>
          <SyncOutlined style={{ marginRight: 8 }} />
          Chi tiết thay đổi
        </Title>

        <Timeline>
          {changes.map((change, index) => (
            <Timeline.Item
              key={index}
              color="blue"
              dot={<ArrowRightOutlined />}
            >
              <Space style={{ width: "100%" }} align="center">
                <Badge
                  count={change.field}
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#595959",
                  }}
                />

                {change.field === "Ảnh đại diện" ? (
                  <Space>
                    {/* BEFORE */}
                    <Avatar
                      src={change.before}
                      size={40}
                      icon={!change.before && <UserOutlined />}
                      style={{
                        border: "2px solid #ff4d4f",
                      }}
                    />

                    <ArrowRightOutlined />

                    {/* AFTER */}
                    <Avatar
                      src={change.after}
                      size={40}
                      icon={!change.after && <UserOutlined />}
                      style={{
                        border: "2px solid #52c41a",
                      }}
                    />
                  </Space>
                ) : (
                  <Space>
                    <Text delete style={{ color: "#ff4d4f" }}>
                      {String(change.before)}
                    </Text>
                    <ArrowRightOutlined />
                    <Text strong style={{ color: "#52c41a" }}>
                      {String(change.after)}
                    </Text>
                  </Space>
                )}
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    );
  };

  const columns = [
    {
      title: "Hành động",
      dataIndex: "action",
      width: 180,
      render: (action: string) => (
        <div
          style={{
            backgroundColor: ACTION_BG_COLOR[action],
            padding: "8px 12px",
            borderRadius: "8px",
            borderLeft: `4px solid ${ACTION_COLOR[action]}`,
          }}
        >
          <Space>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: ACTION_COLOR[action],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {ACTION_ICON[action]}
            </div>
            <Text strong style={{ color: ACTION_COLOR[action] }}>
              {ACTION_LABEL[action] || action}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "Người thực hiện",
      width: 250,
      render: (record: any) => {
        const actor = record.actorSnapshot || record.actor;

        if (!actor) {
          return (
            <Card
              size="small"
              style={{
                borderRadius: "12px",
                backgroundColor: "#fafafa",
                border: "1px dashed #d9d9d9",
              }}
            >
              <Space>
                <Avatar
                  style={{ backgroundColor: "#8c8c8c" }}
                  icon={<SafetyCertificateOutlined />}
                />
                <div>
                  <Text strong>Hệ thống</Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    Tự động
                  </Text>
                </div>
              </Space>
            </Card>
          );
        }

        return (
          <Card
            size="small"
            style={{
              borderRadius: "12px",
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
            }}
            hoverable
          >
            <Space>
              <Avatar
                style={{
                  backgroundColor: "#1890ff",
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)",
                }}
                icon={<UserOutlined />}
              />
              <div>
                <Text strong>{actor.fullName || "Không rõ tên"}</Text>
                {actor.email && (
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    {actor.email}
                  </Text>
                )}
              </div>
            </Space>
          </Card>
        );
      },
    },
    {
      title: (
        <div
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ClockCircleOutlined />
          <span>Thời gian</span>
        </div>
      ),
      dataIndex: "createdAt",
      width: 200,
      render: (createdAt: string) => {
        const isRecent = dayjs().diff(dayjs(createdAt), "hour") < 24;

        return (
          <Tooltip
            title={
              <>
                {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
                {isRecent && (
                  <>
                    <br />
                    <Tag color="green" style={{ marginTop: 4 }}>
                      Gần đây
                    </Tag>
                  </>
                )}
              </>
            }
          >
            <div
              style={{
                padding: "10px 14px", // 👈 to hơn
                backgroundColor: isRecent ? "#f6ffed" : "#fafafa",
                borderRadius: 10,
                border: `1px solid ${isRecent ? "#b7eb8f" : "#f0f0f0"}`,
              }}
            >
              <Space size={6}>
                <ClockCircleOutlined
                  style={{ color: isRecent ? "#52c41a" : "#8c8c8c" }}
                />
                <Text strong={isRecent}>{dayjs(createdAt).fromNow()}</Text>
              </Space>
              <div style={{ fontSize: 11, color: "#bfbfbf", marginTop: 4 }}>
                {dayjs(createdAt).format("DD/MM")}
              </div>
            </div>
          </Tooltip>
        );
      },
      sorter: (a: any, b: any) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend" as const,
    },

    {
      title: "Thao tác",
      width: 80,
      render: (_: any, record: any) => (
        <Tooltip
          title={expandedRow === record._id ? "Ẩn chi tiết" : "Xem chi tiết"}
        >
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              setExpandedRow(expandedRow === record._id ? null : record._id)
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor:
                expandedRow === record._id ? "#e6f7ff" : "#fafafa",
              color: expandedRow === record._id ? "#1890ff" : "#8c8c8c",
              border: `1px solid ${
                expandedRow === record._id ? "#91d5ff" : "#f0f0f0"
              }`,
              transition: "all 0.3s",
            }}
            className="expand-button"
          />
        </Tooltip>
      ),
    },
  ];

  const expandedRowRender = (record: any) => {
    const isUpdate = [
      "UPDATE_USER",
      "UPDATE_PROFILE",
      "UPDATE_AVATAR",
    ].includes(record.action);

    return (
      <div
        style={{
          padding: "20px 40px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%)",
          borderRadius: "12px",
          margin: "8px 0",
          animation: "slideDown 0.3s ease-out",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              size="small"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Descriptions column={2} size="small">
                <Descriptions.Item
                  label={
                    <Space>
                      <ClockCircleOutlined />
                      <Text strong>Thời gian đầy đủ</Text>
                    </Space>
                  }
                >
                  <Tag color="blue" icon={<ClockCircleOutlined />}>
                    {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <GlobalOutlined />
                      <Text strong>IP Address</Text>
                    </Space>
                  }
                >
                  <Tag
                    color={record.ip ? "geekblue" : "default"}
                    icon={
                      record.ip ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                  >
                    {record.ip || "Không xác định"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <SafetyCertificateOutlined />
                      <Text strong>ID Log</Text>
                    </Space>
                  }
                >
                  <Text code style={{ fontSize: "12px" }}>
                    {record._id?.substring(0, 16)}...
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined />
                      <Text strong>User ID</Text>
                    </Space>
                  }
                >
                  <Text code style={{ fontSize: "12px" }}>
                    {record.userId}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {isUpdate && <Col span={24}>{renderChangeDetails(record)}</Col>}

          {record.metadata && (
            <Col span={24}>
              <Card
                title="Thông tin bổ sung"
                size="small"
                style={{
                  background:
                    "linear-gradient(135deg, #f6ffed 0%, #f0f9eb 100%)",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    backgroundColor: "rgba(0,0,0,0.02)",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {JSON.stringify(record.metadata, null, 2)}
                </pre>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      className="activity-modal"
      style={{
        borderRadius: "12px",
        overflow: "hidden",
      }}
      styles={{
        body: { padding: 0 },
      }}
      title={
        <div
          style={{
            background: "linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)",
            margin: "-20px -24px 0",
            padding: "20px 24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <Space align="center">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              <HistoryOutlined style={{ fontSize: "24px", color: "white" }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: "white" }}>
                Lịch sử hoạt động
              </Title>
              {userName && (
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                  Người dùng: <Text strong>{userName}</Text>
                </Text>
              )}
            </div>
          </Space>
        </div>
      }
    >
      <div style={{ padding: "24px" }}>
        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} md={8}>
            <Card
              hoverable
              onClick={() => {
                setActiveFilter("ALL");
              }}
              className={activeFilter === "ALL" ? "active-stat-card" : ""}
              style={{
                borderRadius: 12,
                background: "linear-gradient(135deg, #f6ffed, #d9f7be)",
                border: "none",
              }}
            >
              <Statistic
                title="Tổng hoạt động"
                value={stats.total}
                prefix={<HistoryOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#52c41a"
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => {
                setActiveFilter("UPDATE_USER");
              }}
              className={
                activeFilter === "UPDATE_USER" ? "active-stat-card" : ""
              }
              style={{
                borderRadius: 12,
                background: "linear-gradient(135deg, #fff7e6, #ffd591)",
                border: "none",
              }}
            >
              <Statistic
                title="Cập nhật"
                value={stats.update}
                prefix={<EditOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
              <Progress
                percent={stats.total ? (stats.update / stats.total) * 100 : 0}
                showInfo={false}
                strokeColor="#fa8c16"
                size="small"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => {
                setActiveFilter("CREATE_USER");
              }}
              className={
                activeFilter === "CREATE_USER" ? "active-stat-card" : ""
              }
              style={{
                borderRadius: 12,
                background: "linear-gradient(135deg, #e6f7ff, #bae7ff)",
                border: "none",
              }}
            >
              <Statistic
                title="Tạo mới"
                value={stats.create}
                prefix={<PlusOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress
                percent={stats.total ? (stats.create / stats.total) * 100 : 0}
                showInfo={false}
                strokeColor="#1890ff"
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* Filter Tags */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag
              color={activeFilter === "ALL" ? "blue" : "default"}
              onClick={() => setActiveFilter("ALL")}
              style={{
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              Tất cả ({stats.total})
            </Tag>
            <Tag
              color={activeFilter === "CREATE_USER" ? "green" : "default"}
              onClick={() => setActiveFilter("CREATE_USER")}
              style={{
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              Tạo mới ({stats.create})
            </Tag>
            <Tag
              color={activeFilter === "UPDATE_USER" ? "orange" : "default"}
              onClick={() => setActiveFilter("UPDATE_USER")}
              style={{
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              Cập nhật ({stats.update})
            </Tag>
          </Space>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Activity Table */}
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={filteredLogs}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} bản ghi`,
          }}
          columns={columns}
          expandable={{
            expandedRowKeys: expandedRow ? [expandedRow] : [],
            expandedRowRender,
            onExpand: (expanded, record) => {
              setExpandedRow(expanded ? record._id : null);
            },
            expandIcon: () => null,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Title level={4} style={{ color: "#bfbfbf" }}>
                      Không có hoạt động nào
                    </Title>
                    <Text type="secondary">
                      {activeFilter !== "ALL"
                        ? `Không có hoạt động ${ACTION_LABEL[
                            activeFilter
                          ]?.toLowerCase()}`
                        : "Người dùng này chưa có hoạt động nào"}
                    </Text>
                  </div>
                }
              />
            ),
          }}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
          className="activity-table"
        />
      </div>
    </Modal>
  );
};

export default UserActivityModal;
