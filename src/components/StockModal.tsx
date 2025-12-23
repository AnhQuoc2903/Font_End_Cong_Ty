// src/components/StockModal.tsx
import React from "react";
import {
  Modal,
  Form,
  InputNumber,
  Input,
  Typography,
  Card,
  Row,
  Col,
  Tag,
} from "antd";
import {
  DownloadOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  NumberOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */

const { Title, Text } = Typography;

// Design system colors
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

type Props = {
  open: boolean;
  mode: "import" | "export";
  artifactName?: string;
  form: any;
  onCancel: () => void;
  onOk: () => void;
  currentQuantity?: number;
};

const StockModal: React.FC<Props> = ({
  open,
  mode,
  artifactName,
  form,
  onCancel,
  onOk,
  currentQuantity = 0,
}) => {
  const titlePrefix = mode === "import" ? "NHẬP KHO" : "XUẤT KHO";
  const isImport = mode === "import";
  const icon = isImport ? <DownloadOutlined /> : <UploadOutlined />;
  const color = isImport ? COLORS.success : COLORS.warning;
  const bgColor = isImport ? COLORS.greenLight : COLORS.orangeLight;

  // Validate export quantity
  const validateExportQuantity = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng nhập số lượng"));
    }
    if (value <= 0) {
      return Promise.reject(new Error("Số lượng phải lớn hơn 0"));
    }
    if (!isImport && value > currentQuantity) {
      return Promise.reject(
        new Error(
          `Số lượng xuất không được vượt quá ${currentQuantity} (tồn kho hiện tại)`
        )
      );
    }
    if (value > 10000) {
      return Promise.reject(new Error("Số lượng quá lớn"));
    }
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onOk();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const getAfterText = () => {
    if (isImport) {
      return `Tồn kho sau khi nhập: ${
        currentQuantity + (form.getFieldValue("quantity") || 0)
      }`;
    } else {
      const exportQty = form.getFieldValue("quantity") || 0;
      const after = currentQuantity - exportQty;
      return `Tồn kho sau khi xuất: ${after >= 0 ? after : 0}`;
    }
  };

  return (
    <Modal
      open={open}
      title={null}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      centered
      width={520}
      bodyStyle={{
        padding: 0,
        background: COLORS.background,
        borderRadius: 12,
      }}
      okText={isImport ? "Xác nhận nhập kho" : "Xác nhận xuất kho"}
      cancelText="Hủy bỏ"
      okButtonProps={{
        style: {
          background: color,
          border: "none",
          borderRadius: 8,
          height: 40,
          fontWeight: 600,
        },
      }}
      cancelButtonProps={{
        style: {
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          height: 40,
          fontWeight: 500,
        },
      }}
    >
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${color}, ${
                isImport ? "#73d13d" : "#ffc53d"
              })`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
            }}
          >
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <Title level={4} style={{ margin: 0, color: COLORS.text }}>
              {titlePrefix} HIỆN VẬT
            </Title>
            {artifactName && (
              <Text type="secondary" style={{ fontSize: 14 }}>
                {artifactName}
              </Text>
            )}
          </div>
          <Tag
            color={isImport ? "green" : "orange"}
            style={{
              borderRadius: 16,
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {isImport ? "NHẬP" : "XUẤT"}
          </Tag>
        </div>

        {/* Current Stock Info */}
        <Card
          style={{
            background: COLORS.light,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            marginBottom: 24,
          }}
          bodyStyle={{ padding: "16px 20px" }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background:
                      currentQuantity > 0 ? COLORS.success : COLORS.accent,
                  }}
                />
                <Text
                  strong
                  style={{ fontSize: 12, color: COLORS.textSecondary }}
                >
                  TỒN KHO HIỆN TẠI
                </Text>
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginTop: 4,
                }}
              >
                {currentQuantity}
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  background: bgColor,
                  padding: "12px",
                  borderRadius: 8,
                  border: `1px solid ${color}33`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <InfoCircleOutlined style={{ fontSize: 12, color }} />
                  <Text
                    strong
                    style={{ fontSize: 11, color, textTransform: "uppercase" }}
                  >
                    {isImport ? "THÊM VÀO KHO" : "LẤY TỪ KHO"}
                  </Text>
                </div>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    lineHeight: 1.4,
                  }}
                >
                  {isImport
                    ? "Số lượng nhập sẽ được cộng vào tồn kho hiện tại"
                    : "Số lượng xuất sẽ được trừ từ tồn kho hiện tại"}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Form */}
        <Form layout="vertical" form={form}>
          {/* Quantity Input */}
          <Card
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              marginBottom: 20,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Form.Item
              name="quantity"
              rules={[{ validator: validateExportQuantity }]}
              help={form.getFieldValue("quantity") && getAfterText()}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <NumberOutlined
                    style={{ color: COLORS.textSecondary, fontSize: 14 }}
                  />
                  <Text strong style={{ fontSize: 13, color: COLORS.text }}>
                    SỐ LƯỢNG {isImport ? "NHẬP" : "XUẤT"}
                  </Text>
                </div>
                <InputNumber
                  min={1}
                  max={isImport ? 10000 : currentQuantity}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    fontSize: 16,
                  }}
                  placeholder={`Nhập số lượng cần ${isImport ? "thêm" : "lấy"}`}
                  size="large"
                  controls={false}
                  onChange={() => {
                    // Force update help text
                    form.validateFields(["quantity"]);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {isImport
                      ? "Số lượng nhập tối đa: 10,000 sản phẩm"
                      : `Số lượng xuất tối đa: ${currentQuantity} sản phẩm`}
                  </Text>

                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Đơn vị: sản phẩm
                  </Text>
                </div>
              </div>
            </Form.Item>
          </Card>

          {/* Reason Input */}
          <Card
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Form.Item name="reason">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <FileTextOutlined
                    style={{ color: COLORS.textSecondary, fontSize: 14 }}
                  />
                  <Text strong style={{ fontSize: 13, color: COLORS.text }}>
                    LÝ DO / GHI CHÚ
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 11, marginLeft: "auto" }}
                  >
                    Không bắt buộc
                  </Text>
                </div>
                <Input.TextArea
                  rows={3}
                  placeholder={`Nhập lý do ${
                    isImport ? "nhập" : "xuất"
                  } kho...`}
                  maxLength={500}
                  showCount
                  style={{
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    resize: "vertical",
                  }}
                />
              </div>
            </Form.Item>
          </Card>

          {/* Warning for export */}
          {!isImport && currentQuantity === 0 && (
            <div
              style={{
                background: COLORS.redLight,
                border: `1px solid ${COLORS.accent}33`,
                borderRadius: 10,
                padding: "16px",
                marginTop: 16,
                display: "flex",
                gap: 12,
              }}
            >
              <ExclamationCircleOutlined
                style={{ color: COLORS.accent, fontSize: 16, flexShrink: 0 }}
              />
              <div>
                <Text
                  strong
                  style={{
                    color: COLORS.accent,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Cảnh báo: Hết hàng
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    lineHeight: 1.4,
                  }}
                >
                  Hiện vật này đang hết hàng. Không thể xuất kho khi tồn kho
                  bằng 0. Vui lòng nhập thêm hàng trước khi xuất.
                </Text>
              </div>
            </div>
          )}
        </Form>
      </div>

      {/* Custom CSS */}
      <style>{`
        .ant-input-number:hover {
          border-color: ${color} !important;
        }
        
        .ant-input-number-focused {
          border-color: ${color} !important;
          box-shadow: 0 0 0 2px ${color}1a !important;
        }
        
        .ant-input-textarea:hover {
          border-color: ${color} !important;
        }
        
        .ant-input-textarea-focused {
          border-color: ${color} !important;
          box-shadow: 0 0 0 2px ${color}1a !important;
        }
        
        .ant-modal-close {
          top: 20px !important;
          right: 20px !important;
        }
        
        .ant-modal-close-x {
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          background: ${COLORS.light};
          border-radius: 50%;
        }
      `}</style>
    </Modal>
  );
};

export default StockModal;
