/* eslint-disable @typescript-eslint/no-explicit-any */
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

const MetaRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div style={{ marginBottom: 14 }}>
    <Text
      type="secondary"
      style={{
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      {label}
    </Text>
    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{value ?? "-"}</div>
  </div>
);

const ArtifactDetailModal: React.FC<any> = ({
  open,
  artifactId,
  onClose,
}) => {
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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={820}
      style={{
        top: 20,
      }}
      bodyStyle={{
        padding: 0,
        background: "#f9fafc",
        borderRadius: 18,
      }}
      title={
        artifact ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Title level={4} style={{ margin: 0 }}>
              {artifact.name}
            </Title>
          </div>
        ) : (
          "Chi tiết hiện vật"
        )
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : !artifact ? (
        <div style={{ padding: 40, textAlign: "center", color: "#8c8c8c" }}>
          Không có dữ liệu
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          {/* --- ẢNH --- */}
          <Card
            style={{
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 20,
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              border: "none",
            }}
            bodyStyle={{ padding: 0 }}
          >
            {artifact.imageUrl ? (
              <Image
                src={artifact.imageUrl}
                alt={artifact.name}
                width="100%"
                height={380}
                style={{
                  objectFit: "cover",
                  transition: "0.35s ease",
                }}
                preview={{
                  mask: (
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 16,
                        background: "rgba(0,0,0,0.4)",
                        padding: "6px 14px",
                        borderRadius: 6,
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
                  height: 360,
                  background: "#f2f2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "#aaa",
                }}
              >
                <HistoryOutlined style={{ fontSize: 50 }} />
                <div style={{ marginTop: 10 }}>Chưa có ảnh</div>
              </div>
            )}
          </Card>

          {/* --- MÔ TẢ--- */}
          <Card
            style={{
              borderRadius: 14,
              marginBottom: 20,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={5} style={{ marginBottom: 12 }}>
              Mô tả hiện vật
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              {artifact.description ? (
                <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {artifact.category?.description ?? "-"}
                </Text>
              ) : (
                <Text type="secondary">Không có mô tả</Text>
              )}
            </Paragraph>
          </Card>

          {/* --- THÔNG TIN CHI TIẾT --- */}
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title level={5} style={{ marginBottom: 20 }}>
              Thông tin chi tiết
            </Title>

            <Row gutter={[24, 12]}>
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
                  label="Mã hiện vật"
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
                  label="Cập nhật gần nhất"
                  value={
                    artifact.updatedAt
                      ? format(new Date(artifact.updatedAt), "yyyy-MM-dd HH:mm")
                      : "-"
                  }
                />
              </Col>
            </Row>

            <Divider style={{ margin: "14px 0" }} />

            <Text type="secondary" style={{ fontSize: 12 }}>
              ID:{" "}
              {(artifact as any).id ??
                (artifact as any)._id ??
                artifact.code ??
                "N/A"}
            </Text>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default ArtifactDetailModal;
