/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ArtifactDetailModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Image,
  Divider,
  Tag,
  message,
  Spin,
  Row,
  Col,
  Card,
  Typography,
} from "antd";
import {
  HistoryOutlined,
  BarcodeOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { artifactApi } from "../api/artifactApi";
import type { Artifact as ArtifactType } from "../pages/ArtifactsPage";
import { format } from "date-fns";

const { Paragraph, Text, Title } = Typography;

type Props = {
  open: boolean;
  artifactId?: string | null;
  onClose: () => void;
  onEdit?: (artifact: ArtifactType) => void;
  onRefresh?: () => void;
  onOpenImport?: (artifact: ArtifactType) => void;
  onOpenExport?: (artifact: ArtifactType) => void;
  onDelete?: (id: string) => Promise<void>;
};

const MetaRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div style={{ marginBottom: 12 }}>
    <Text type="secondary" style={{ fontSize: 12 }}>
      {label}
    </Text>
    <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>
      {value ?? "-"}
    </div>
  </div>
);

const ArtifactDetailModal: React.FC<Props> = ({
  open,
  artifactId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<ArtifactType | null>(null);

  useEffect(() => {
    if (open && artifactId) {
      load();
    } else {
      setArtifact(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      bodyStyle={{ padding: 20 }}
      title={
        artifact ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Title
              level={4}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>Thông tin: {artifact.name}</span>
            </Title>
          </div>
        ) : (
          "Chi tiết hiện vật"
        )
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : !artifact ? (
        <div style={{ padding: 24, textAlign: "center", color: "#8c8c8c" }}>
          Không có dữ liệu
        </div>
      ) : (
        <>
          {/* Ảnh ở trên */}
          <Card
            style={{
              borderRadius: 16,
              marginBottom: 20,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: 0 }}
          >
            {artifact.imageUrl ? (
              <div
                style={{
                  width: "100%",
                  height: 380,
                  background: "linear-gradient(to bottom, #f0f5ff, #ffffff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={artifact.imageUrl}
                  alt={artifact.name}
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                    borderRadius: 0,
                    transition: "transform 0.3s ease",
                  }}
                  preview={{
                    mask: (
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 16,
                          background: "rgba(0,0,0,0.4)",
                          padding: "4px 12px",
                          borderRadius: 4,
                        }}
                      >
                        Xem ảnh
                      </div>
                    ),
                  }}
                  placeholder={
                    <div
                      style={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Spin />
                    </div>
                  }
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 300,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "#999",
                }}
              >
                <HistoryOutlined style={{ fontSize: 40 }} />
                <div style={{ marginTop: 10, fontSize: 14 }}>Chưa có ảnh</div>
              </div>
            )}
          </Card>

          {/* Thông tin chi tiết bên dưới */}
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: 16 }}
          >
            <Paragraph style={{ marginBottom: 12 }}>
              {artifact.description ? (
                <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {artifact.description}
                </Text>
              ) : (
                <Text type="secondary">Không có mô tả</Text>
              )}
            </Paragraph>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <MetaRow
                  label="Danh mục"
                  value={
                    <>
                      <AppstoreOutlined style={{ marginRight: 6 }} />
                      {artifact.category?.name ?? "-"}
                    </>
                  }
                />
                <MetaRow
                  label="Vị trí"
                  value={
                    <>
                      <EnvironmentOutlined style={{ marginRight: 6 }} />
                      {artifact.location ?? "-"}
                    </>
                  }
                />
                <MetaRow
                  label="Tồn kho"
                  value={<Text strong>{artifact.quantityCurrent ?? 0}</Text>}
                />
              </Col>
              <Col span={12}>
                <MetaRow
                  label="Mã"
                  value={
                    <>
                      <BarcodeOutlined style={{ marginRight: 6 }} />
                      {artifact.code}
                    </>
                  }
                />
                <MetaRow
                  label="Trạng thái"
                  value={
                    artifact.status === "bosung" ? (
                      <Tag color="blue">Mới bổ sung</Tag>
                    ) : artifact.status === "con" ? (
                      <Tag color="green">Còn hàng</Tag>
                    ) : artifact.status === "ban" ? (
                      <Tag color="red">Đã bán / Hết</Tag>
                    ) : (
                      <Tag>{artifact.status}</Tag>
                    )
                  }
                />
                <MetaRow
                  label="Ngày tạo"
                  value={
                    artifact.createdAt
                      ? format(new Date(artifact.createdAt), "yyyy-MM-dd HH:mm")
                      : "-"
                  }
                />
                <MetaRow
                  label="Cập nhật"
                  value={
                    artifact.updatedAt
                      ? format(new Date(artifact.updatedAt), "yyyy-MM-dd HH:mm")
                      : "-"
                  }
                />
              </Col>
            </Row>

            <Divider />

            <Text type="secondary" style={{ fontSize: 12 }}>
              ID:{" "}
              {(artifact as any).id ??
                (artifact as any)._id ??
                (artifact as any).artifactId ??
                artifact.code ??
                "N/A"}
            </Text>
          </Card>
        </>
      )}
    </Modal>
  );
};

export default ArtifactDetailModal;
