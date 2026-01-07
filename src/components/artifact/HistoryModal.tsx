// src/components/HistoryModal.tsx
import React from "react";
import {
  Modal,
  Typography,
  Table,
  Card,
  Row,
  Col,
  Button,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HistoryOutlined,
  DownloadOutlined,
  UploadOutlined,
  SyncOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { artifactApi } from "../../api/artifactApi";

const { Title, Text } = Typography;

type ArtifactTransaction = {
  _id: string;
  type: "IMPORT" | "EXPORT" | "ADJUST";
  quantityChange: number;
  reason?: string;
  createdAt: string;
  createdBy?: { fullName?: string; email?: string };
};

type Props = {
  open: boolean;
  loading: boolean;
  artifactId?: string;
  artifactName?: string;
  history: ArtifactTransaction[];
  onClose: () => void;
};

// Gallery color palette
const COLORS = {
  primary: "#2C3E50",
  secondary: "#34495E",
  accent: "#E74C3C",
  light: "#ECF0F1",
  background: "#F8FAFC",
  success: "#27AE60",
  warning: "#F39C12",
  border: "#D5DBDB",
  text: "#2C3E50",
  textSecondary: "#7F8C8D",
  blueLight: "#E3F2FD",
  greenLight: "#E8F5E9",
  redLight: "#FFEBEE",
  orangeLight: "#FFF3E0",
};

const HistoryModal: React.FC<Props> = ({
  open,
  loading,
  artifactId,
  artifactName,
  history,
  onClose,
}) => {
  const { hasPermission } = useAuth();
  // Calculate stats
  const stats = React.useMemo(() => {
    const totalImports = history.filter((h) => h.type === "IMPORT").length;
    const totalExports = history.filter((h) => h.type === "EXPORT").length;
    const totalAdjusts = history.filter((h) => h.type === "ADJUST").length;
    const totalTransactions = history.length;
    const totalQuantityChange = history.reduce(
      (sum, h) => sum + h.quantityChange,
      0
    );

    return {
      totalImports,
      totalExports,
      totalAdjusts,
      totalTransactions,
      totalQuantityChange,
    };
  }, [history]);

  const handleExportHistoryExcel = async () => {
    if (!artifactId) return;

    try {
      const res = await artifactApi.exportTransactionsExcel(artifactId);

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `lich-su-giao-dich-${artifactName || "artifact"}.xlsx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      message.error("Xuất Excel thất bại");
    }
  };

  const columns: ColumnsType<ArtifactTransaction> = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (_t, _r, i) => (
        <div
          style={{
            background: COLORS.light,
            borderRadius: "8px",
            padding: "8px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <Text strong style={{ color: COLORS.text, fontSize: "14px" }}>
            {i + 1}
          </Text>
        </div>
      ),
    },
    {
      title: "LOẠI GIAO DỊCH",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: ArtifactTransaction["type"]) => {
        const config = {
          IMPORT: {
            icon: <DownloadOutlined />,
            color: COLORS.success,
            label: "NHẬP KHO",
            bgColor: COLORS.greenLight,
          },
          EXPORT: {
            icon: <UploadOutlined />,
            color: COLORS.accent,
            label: "XUẤT KHO",
            bgColor: COLORS.redLight,
          },
          ADJUST: {
            icon: <SyncOutlined />,
            color: COLORS.warning,
            label: "ĐIỀU CHỈNH",
            bgColor: COLORS.orangeLight,
          },
        }[type];

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: config.bgColor,
              padding: "8px 12px",
              borderRadius: "8px",
              border: `1px solid ${config.color}`,
            }}
          >
            <div style={{ color: config.color, fontSize: "14px" }}>
              {config.icon}
            </div>
            <Text
              strong
              style={{
                color: config.color,
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {config.label}
            </Text>
          </div>
        );
      },
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantityChange",
      key: "quantityChange",
      width: 140,
      align: "center",
      render: (value: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {value > 0 ? (
            <>
              <ArrowUpOutlined
                style={{ color: COLORS.success, fontSize: "14px" }}
              />
              <Text
                strong
                style={{
                  color: COLORS.success,
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                +{value}
              </Text>
            </>
          ) : (
            <>
              <ArrowDownOutlined
                style={{ color: COLORS.accent, fontSize: "14px" }}
              />
              <Text
                strong
                style={{
                  color: COLORS.accent,
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {value}
              </Text>
            </>
          )}
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: value > 0 ? COLORS.success : COLORS.accent,
              opacity: 0.1,
              position: "absolute",
              right: -12,
            }}
          />
        </div>
      ),
    },
    {
      title: "LÝ DO / GHI CHÚ",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      render: (reason?: string) =>
        reason ? (
          <div
            style={{
              background: COLORS.light,
              padding: "8px 12px",
              borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              minHeight: "40px",
            }}
          >
            <Text
              style={{
                fontSize: "13px",
                color: COLORS.textSecondary,
                lineHeight: 1.4,
              }}
            >
              {reason}
            </Text>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: COLORS.textSecondary,
              fontStyle: "italic",
            }}
          >
            <FileTextOutlined />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Không có ghi chú
            </Text>
          </div>
        ),
    },
    {
      title: "THỜI GIAN",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => {
        const date = new Date(value);
        const dateStr = date.toLocaleDateString("vi-VN");
        const timeStr = date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarOutlined
                style={{ color: COLORS.primary, fontSize: "12px" }}
              />
              <Text strong style={{ fontSize: "13px", color: COLORS.text }}>
                {dateStr}
              </Text>
            </div>
            <Text
              style={{
                fontSize: "12px",
                color: COLORS.textSecondary,
                marginLeft: 18,
              }}
            >
              {timeStr}
            </Text>
          </div>
        );
      },
    },
    {
      title: "NGƯỜI THỰC HIỆN",
      key: "createdBy",
      dataIndex: "createdBy",
      width: 200,
      render: (createdBy?: { fullName?: string; email?: string }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
            }}
          >
            <UserOutlined />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {createdBy?.fullName ? (
              <>
                <Text
                  strong
                  style={{
                    fontSize: "13px",
                    color: COLORS.text,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {createdBy.fullName}
                </Text>
                {createdBy.email && (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "11px",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {createdBy.email}
                  </Text>
                )}
              </>
            ) : createdBy?.email ? (
              <Text
                strong
                style={{
                  fontSize: "13px",
                  color: COLORS.text,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {createdBy.email}
              </Text>
            ) : (
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Không xác định
              </Text>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      footer={null}
      width={1100}
      bodyStyle={{
        padding: 0,
        background: COLORS.background,
        borderRadius: 12,
      }}
      title={null}
      closeIcon={
        <div
          style={{
            background: COLORS.light,
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.primary,
            fontSize: 16,
          }}
        >
          ×
        </div>
      }
    >
      {/* Header with gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
          padding: "24px 32px 16px",
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              backdropFilter: "blur(4px)",
            }}
          >
            <HistoryOutlined />
          </div>
          <div style={{ flex: 1 }}>
            <Title
              level={3}
              style={{ margin: 0, color: "white", fontWeight: 700 }}
            >
              LỊCH SỬ GIAO DỊCH
            </Title>
            {artifactName && (
              <Text
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 14,
                  display: "block",
                  marginTop: 4,
                }}
              >
                Hiện vật:{" "}
                <span style={{ fontWeight: 600 }}>{artifactName}</span>
              </Text>
            )}
          </div>

          {/* Transaction count badge */}

          {hasPermission("EXPORT_ARTIFACT_TRANSACTIONS") && (
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportHistoryExcel}
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #0a9f47 0%, #21c55d 100%)",
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
              Xuất Excel
            </Button>
          )}

          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: "8px 16px",
              borderRadius: 20,
              backdropFilter: "blur(4px)",
            }}
          >
            <Text strong style={{ color: "white", fontSize: 14 }}>
              {stats.totalTransactions} GIAO DỊCH
            </Text>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ padding: "24px 32px 0" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              size="small"
              style={{
                background: "rgba(39, 174, 96, 0.05)",
                border: `1px solid rgba(39, 174, 96, 0.2)`,
                borderRadius: 10,
              }}
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
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    NHẬP KHO
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLORS.success,
                    }}
                  >
                    {stats.totalImports}
                  </div>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(39, 174, 96, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DownloadOutlined
                    style={{ fontSize: 20, color: COLORS.success }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              size="small"
              style={{
                background: "rgba(231, 76, 60, 0.05)",
                border: `1px solid rgba(231, 76, 60, 0.2)`,
                borderRadius: 10,
              }}
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
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    XUẤT KHO
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLORS.accent,
                    }}
                  >
                    {stats.totalExports}
                  </div>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(231, 76, 60, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UploadOutlined
                    style={{ fontSize: 20, color: COLORS.accent }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              size="small"
              style={{
                background: "rgba(243, 156, 18, 0.05)",
                border: `1px solid rgba(243, 156, 18, 0.2)`,
                borderRadius: 10,
              }}
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
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    ĐIỀU CHỈNH
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLORS.warning,
                    }}
                  >
                    {stats.totalAdjusts}
                  </div>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(243, 156, 18, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SyncOutlined
                    style={{ fontSize: 20, color: COLORS.warning }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              size="small"
              style={{
                background: "rgba(44, 62, 80, 0.05)",
                border: `1px solid rgba(44, 62, 80, 0.2)`,
                borderRadius: 10,
              }}
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
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    TỔNG THAY ĐỔI
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color:
                        stats.totalQuantityChange >= 0
                          ? COLORS.success
                          : COLORS.accent,
                    }}
                  >
                    {stats.totalQuantityChange >= 0 ? "+" : ""}
                    {stats.totalQuantityChange}
                  </div>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      stats.totalQuantityChange >= 0
                        ? "rgba(39, 174, 96, 0.1)"
                        : "rgba(231, 76, 60, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stats.totalQuantityChange >= 0 ? (
                    <ArrowUpOutlined
                      style={{ fontSize: 20, color: COLORS.success }}
                    />
                  ) : (
                    <ArrowDownOutlined
                      style={{ fontSize: 20, color: COLORS.accent }}
                    />
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      <div style={{ padding: "24px 32px" }}>
        <Card
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={history}
            size="middle"
            pagination={{
              pageSize: 10,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} giao dịch`,
              style: { padding: "16px 24px" },
            }}
            scroll={{ x: 1000 }}
            style={{
              border: "none",
            }}
            components={{
              header: {
                cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                  <th
                    {...props}
                    style={{
                      ...props.style,
                      background: "#f8f9fa !important",
                      borderBottom: `2px solid ${COLORS.border} !important`,
                      fontWeight: 600,
                      color: COLORS.text,
                      padding: "16px 12px",
                      textTransform: "uppercase",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                    }}
                  />
                ),
              },
            }}
            rowClassName={() => "history-row"}
            locale={{
              emptyText: (
                <div style={{ padding: 48, textAlign: "center" }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: COLORS.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <HistoryOutlined
                      style={{ fontSize: 32, color: COLORS.textSecondary }}
                    />
                  </div>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>
                    Chưa có giao dịch nào được ghi nhận
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 8, fontSize: 12 }}
                  >
                    Sử dụng tính năng Nhập kho, Xuất kho hoặc Điều chỉnh để tạo
                    giao dịch
                  </Text>
                </div>
              ),
            }}
          />
        </Card>
      </div>
    </Modal>
  );
};

export default HistoryModal;
