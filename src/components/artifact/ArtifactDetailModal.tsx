/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Image,
  Divider,

  message,
  Spin,
  Row,
  Col,
  Card,
  Typography,
  Badge,
  Space,
  Collapse,
} from "antd";
import {
  HistoryOutlined,
  BarcodeOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  EditOutlined,
  StockOutlined,
  InfoCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { artifactApi } from "../../api/artifactApi";
import type { Artifact as ArtifactType } from "./types";
import { format } from "date-fns";

const { Paragraph, Text, Title } = Typography;
const { Panel } = Collapse;

// Gallery color palette
const COLORS = {
  primary: "#2C3E50", // Dark blue-gray
  secondary: "#34495E", // Medium blue-gray
  accent: "#E74C3C", // Coral red
  light: "#ECF0F1", // Light gray
  background: "#F8FAFC", // Off-white background
  success: "#27AE60", // Green
  warning: "#F39C12", // Orange
  border: "#D5DBDB", // Light border
  textSecondary: "#7F8C8D", // Gray text
};

const MetaRow: React.FC<{ 
  label: string; 
  value?: React.ReactNode;
  icon?: React.ReactNode;
  vertical?: boolean;
}> = ({ label, value, icon, vertical = false }) => (
  <div style={{ 
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: `1px solid ${COLORS.border}`,
  }}>
    <div style={{ 
      display: "flex",
      alignItems: "center",
      marginBottom: vertical ? 12 : 6,
      gap: 8,
    }}>
      {icon && (
        <div style={{
          color: COLORS.accent,
          fontSize: 14,
        }}>
          {icon}
        </div>
      )}
      <Text
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: COLORS.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </div>
    <div style={{ 
      fontSize: 16, 
      fontWeight: 500, 
      color: COLORS.primary,
      marginLeft: icon && !vertical ? 22 : 0,
      ...(vertical && { marginTop: 4 }),
    }}>
      {value ?? "-"}
    </div>
  </div>
);

const ArtifactDetailModal: React.FC<any> = ({ open, artifactId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<ArtifactType | null>(null);

  useEffect(() => {
    if (open && artifactId) load();
    else setArtifact(null);
  }, [open, artifactId]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await artifactApi.get(artifactId as string);
      setArtifact(res.data?.artifact ?? res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải thông tin hiện vật");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "bosung":
        return { color: "#3498DB", text: "Mới bổ sung", badge: "processing" as const };
      case "con":
        return { color: COLORS.success, text: "Còn hàng", badge: "success" as const };
      case "ban":
        return { color: COLORS.accent, text: "Đã bán / Hết", badge: "error" as const };
      default:
        return { color: COLORS.textSecondary, text: "Không xác định", badge: "default" as const };
    }
  };

  const statusConfig = artifact ? getStatusConfig(artifact.status) : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      style={{
        top: 20,
      }}
      bodyStyle={{
        padding: 0,
        background: COLORS.background,
        borderRadius: 20,
        overflow: "hidden",
      }}
      title={null}
      closeIcon={
        <div style={{
          background: COLORS.light,
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.primary,
          fontSize: 16,
        }}>
          ×
        </div>
      }
    >
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}>
          <Spin size="large" />
          <Text style={{ color: COLORS.textSecondary }}>Đang tải thông tin hiện vật...</Text>
        </div>
      ) : !artifact ? (
        <div style={{ 
          padding: 60, 
          textAlign: "center", 
          color: COLORS.textSecondary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}>
          <InfoCircleOutlined style={{ fontSize: 48, color: COLORS.border }} />
          <Text>Không có dữ liệu</Text>
        </div>
      ) : (
        <div style={{ padding: 0 }}>
          {/* Header với gradient */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            padding: "30px 32px 20px",
            color: "white",
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12,
                  marginBottom: 8,
                }}>
                  <BarcodeOutlined style={{ fontSize: 18 }} />
                  <Text style={{ 
                    color: "rgba(255,255,255,0.8)", 
                    fontSize: 15,
                    fontFamily: "monospace",
                  }}>
                    {artifact.code}
                  </Text>
                </div>
                <Title level={3} style={{ 
                  margin: 0, 
                  color: "white",
                  fontWeight: 700,
                  fontSize: 28,
                }}>
                  {artifact.name}
                </Title>
              </div>
              
              {statusConfig && (
                <Badge
                  status={statusConfig.badge}
                  text={
                    <Text style={{ 
                      color: "white",
                      fontWeight: 600,
                      fontSize: 13,
                      padding: "6px 12px",
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: 20,
                    }}>
                      {statusConfig.text}
                    </Text>
                  }
                />
              )}
            </div>
          </div>

          <div style={{ padding: "24px 32px" }}>
            <Row gutter={[32, 24]}>
              {/* Left Column - Images */}
              <Col span={14}>
                {/* Main Image */}
                <Card
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    marginBottom: 24,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  {artifact.images && artifact.images.length > 0 ? (
                    <Image
                      src={artifact.images[0].url}
                      alt={artifact.name}
                      width="100%"
                      height={400}
                      style={{ 
                        objectFit: "cover",
                        display: "block",
                      }}
                      preview={{
                        mask: (
                          <div
                            style={{
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: 14,
                              background: "rgba(0,0,0,0.6)",
                              padding: "10px 20px",
                              borderRadius: 8,
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            Xem ảnh
                          </div>
                        ),
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 400,
                        background: COLORS.light,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: COLORS.textSecondary,
                      }}
                    >
                      <HistoryOutlined style={{ fontSize: 64, opacity: 0.3 }} />
                      <Text style={{ marginTop: 16, opacity: 0.6 }}>Chưa có ảnh</Text>
                    </div>
                  )}
                </Card>

                {/* Thumbnails Grid */}
                {artifact.images && artifact.images.length > 1 && (
                  <div style={{ marginTop: 16 }}>
                    <Text strong style={{ 
                      marginBottom: 12, 
                      display: "block",
                      color: COLORS.primary,
                    }}>
                      Hình ảnh khác ({artifact.images.length - 1})
                    </Text>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                        gap: 12,
                      }}
                    >
                      {artifact.images.slice(1).map((img, index) => (
                        <div
                          key={img.publicId || index}
                          style={{
                            borderRadius: 12,
                            overflow: "hidden",
                            border: `1px solid ${COLORS.border}`,
                            cursor: "pointer",
                            transition: "transform 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <Image
                            src={img.url}
                            width="100%"
                            height={80}
                            style={{
                              objectFit: "cover",
                            }}
                            preview={{ src: img.url }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mô tả hiện vật */}
                {(artifact.description) && (
                  <Card
                    style={{
                      borderRadius: 16,
                      marginTop: 24,
                      border: `1px solid ${COLORS.border}`,
                      background: "white",
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 10,
                      marginBottom: 16,
                    }}>
                      <EditOutlined style={{ 
                        color: COLORS.accent,
                        fontSize: 18,
                      }} />
                      <Title level={5} style={{ margin: 0 }}>
                        Mô tả hiện vật
                      </Title>
                    </div>
                    <Paragraph style={{ 
                      margin: 0,
                      color: COLORS.secondary,
                      lineHeight: 1.7,
                      fontSize: 15,
                      whiteSpace: "pre-wrap",
                    }}>
                      {artifact.description || artifact.category?.description || "-"}
                    </Paragraph>
                  </Card>
                )}
              </Col>

              {/* Right Column - Details */}
              <Col span={10}>
                <Card
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${COLORS.border}`,
                    background: "white",
                    height: "100%",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 10,
                    marginBottom: 24,
                  }}>
                    <InfoCircleOutlined style={{ 
                      color: COLORS.accent,
                      fontSize: 18,
                    }} />
                    <Title level={5} style={{ margin: 0 }}>
                      Thông tin chi tiết
                    </Title>
                  </div>

                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <MetaRow
                      label="Vị trí lưu trữ"
                      value={artifact.location ?? "-"}
                      icon={<EnvironmentOutlined />}
                    />

                    <MetaRow
                      label="Số lượng hiện tại"
                      value={
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <StockOutlined style={{ color: COLORS.success }} />
                          <Text style={{ 
                            fontSize: 20, 
                            fontWeight: 700,
                            color: COLORS.primary,
                          }}>
                            {artifact.quantityCurrent ?? 0}
                          </Text>
                          <Text style={{ color: COLORS.textSecondary }}>sản phẩm</Text>
                        </div>
                      }
                    />

                    {/* Danh mục với mô tả chi tiết */}
                    <div style={{ 
                      marginBottom: 16,
                      paddingBottom: 16,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}>
                      <div style={{ 
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 6,
                        gap: 8,
                      }}>
                        <AppstoreOutlined style={{
                          color: COLORS.accent,
                          fontSize: 14,
                        }} />
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: COLORS.textSecondary,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          Danh mục
                        </Text>
                      </div>
                      
                      <div style={{ marginLeft: 22 }}>
                        {/* Tên danh mục */}
                        <div style={{ 
                          fontSize: 16, 
                          fontWeight: 500, 
                          color: COLORS.primary,
                          marginBottom: artifact.category?.description ? 8 : 0,
                        }}>
                          {artifact.category?.name ?? "-"}
                        </div>
                        
                        {/* Mô tả danh mục (nếu có) */}
                        {artifact.category?.description && (
                          <Collapse
                            bordered={false}
                            ghost
                            size="small"
                            style={{ background: COLORS.light, borderRadius: 8 }}
                            expandIcon={({ isActive }) => (
                              <DownOutlined rotate={isActive ? 180 : 0} style={{ 
                                fontSize: 12,
                                color: COLORS.textSecondary,
                              }} />
                            )}
                          >
                            <Panel
                              header={
                                <Text style={{ 
                                  fontSize: 13,
                                  color: COLORS.textSecondary,
                                  fontWeight: 500,
                                }}>
                                  Xem mô tả danh mục
                                </Text>
                              }
                              key="1"
                              style={{ 
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 6,
                                marginTop: 8,
                              }}
                            >
                              <Paragraph style={{ 
                                margin: 0,
                                color: COLORS.secondary,
                                lineHeight: 1.6,
                                fontSize: 14,
                                whiteSpace: "pre-wrap",
                                padding: "8px 12px",
                                background: "white",
                                borderRadius: 4,
                              }}>
                                {artifact.category.description}
                              </Paragraph>
                            </Panel>
                          </Collapse>
                        )}
                      </div>
                    </div>

                    <MetaRow
                      label="Ngày tạo"
                      value={
                        artifact.createdAt ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <CalendarOutlined style={{ color: COLORS.warning }} />
                            {format(new Date(artifact.createdAt), "dd/MM/yyyy HH:mm")}
                          </div>
                        ) : "-"
                      }
                    />

                    <MetaRow
                      label="Cập nhật cuối"
                      value={
                        artifact.updatedAt ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <CalendarOutlined style={{ color: COLORS.warning }} />
                            {format(new Date(artifact.updatedAt), "dd/MM/yyyy HH:mm")}
                          </div>
                        ) : "-"
                      }
                    />
                  </Space>

                  <Divider style={{ 
                    margin: "24px 0",
                    borderColor: COLORS.border,
                  }} />

                  {/* ID Info */}
                  <div style={{ 
                    background: COLORS.light,
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 20,
                  }}>
                    <Text style={{ 
                      fontSize: 12,
                      color: COLORS.textSecondary,
                      display: "block",
                      marginBottom: 4,
                    }}>
                      ID hệ thống
                    </Text>
                    <Text code style={{ 
                      fontSize: 13,
                      color: COLORS.primary,
                      wordBreak: "break-all",
                    }}>
                      {(artifact as any).id ??
                        (artifact as any)._id ??
                        artifact.code ??
                        "N/A"}
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ArtifactDetailModal;