// src/components/AdjustStockModal.tsx
import React, { useEffect } from "react";
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
  Divider,
} from "antd";
import {
  SlidersOutlined,
  InfoCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */

const { Title, Text } = Typography;

/* ================= COLORS ================= */
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
  purpleLight: "#F9F0FF",
  purple: "#722ed1",
  blueLight: "#E3F2FD",
  redLight: "#FFEBEE",
  greenLight: "#E8F5E9",
  orangeLight: "#FFF3E0",
  purpleDark: "#531dab",
  successLight: "#d5f4e1",
  errorLight: "#ffebee",
};

/* ================= PROPS ================= */
type Props = {
  open: boolean;
  artifactName?: string;
  currentQty?: number;
  form: any;
  onCancel: () => void;
  onOk: () => void;
};

const AdjustStockModal: React.FC<Props> = ({
  open,
  artifactName,
  currentQty = 0,
  form,
  onCancel,
  onOk,
}) => {
  /* ================= WATCH FORM ================= */
  const newQuantity = Form.useWatch("newQuantity", form);

const quantityChange =
  typeof newQuantity === "number" ? newQuantity - currentQty : 0;

const hasValue = typeof newQuantity === "number";
const isIncrease = hasValue && quantityChange > 0;
const noChange = hasValue && quantityChange === 0;


  /* ================= EFFECT ================= */
 useEffect(() => {
  if (open) {
    form.resetFields(); // 👈 để trống toàn bộ form
  }
}, [open, form]);


  /* ================= VALIDATION ================= */
  const validateNewQuantity = (_: any, value: number) => {
    if (value === undefined || value === null) {
      return Promise.reject(new Error("Vui lòng nhập số lượng tồn mới"));
    }
    if (value < 0) {
      return Promise.reject(new Error("Số lượng không được âm"));
    }
    if (value > 100000) {
      return Promise.reject(new Error("Số lượng tối đa là 100,000"));
    }
    return Promise.resolve();
  };

  /* ================= HELPERS ================= */
  const getStatusColor = () => {
    if (noChange) return COLORS.textSecondary;
    return isIncrease ? COLORS.success : COLORS.accent;
  };

  const getStatusText = () => {
    if (noChange) return "Không thay đổi";
    return isIncrease
      ? `Tăng ${Math.abs(quantityChange)} sản phẩm`
      : `Giảm ${Math.abs(quantityChange)} sản phẩm`;
  };

  const getStatusIcon = () => {
    if (noChange) return <MinusOutlined style={{ color: COLORS.textSecondary }} />;
    return isIncrease ? (
      <ArrowUpOutlined style={{ color: COLORS.success }} />
    ) : (
      <ArrowDownOutlined style={{ color: COLORS.accent }} />
    );
  };

  const getChangeTypeColor = () => {
    if (noChange) return "default";
    return isIncrease ? "success" : "error";
  };

  const getChangeTypeBackground = () => {
    if (noChange) return COLORS.light;
    return isIncrease ? COLORS.successLight : COLORS.errorLight;
  };

  /* ================= RENDER ================= */
  return (
    <Modal
      open={open}
      title={null}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
      centered
      width={680}
      okText="Xác nhận điều chỉnh"
      cancelText="Hủy bỏ"
      bodyStyle={{
        padding: 0,
        background: COLORS.background,
        borderRadius: 16,
        overflow: "hidden",
      }}
      okButtonProps={{
        style: {
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`,
          border: "none",
          borderRadius: 10,
          height: 44,
          fontWeight: 600,
          fontSize: 14,
          boxShadow: "0 2px 8px rgba(114, 46, 209, 0.3)",
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: 10,
          height: 44,
          borderColor: COLORS.border,
          fontWeight: 500,
        },
      }}
    >
      <div style={{ padding: 28 }}>
        {/* ===== HEADER ===== */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, alignItems: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 30,
              boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
            }}
          >
            <SlidersOutlined />
          </div>
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ margin: 0, color: COLORS.primary }}>
              ĐIỀU CHỈNH TỒN KHO
            </Title>
            {artifactName && (
              <Text 
                style={{ 
                  color: COLORS.textSecondary,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {artifactName}
              </Text>
            )}
          </div>
          <Tag 
            color="purple" 
            style={{ 
              borderRadius: 12, 
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: 13,
              border: "none",
            }}
          >
            Điều chỉnh
          </Tag>
        </div>

        <Divider style={{ margin: "20px 0", borderColor: COLORS.border }} />

        {/* ===== CURRENT & CHANGE ===== */}
        <Card 
          style={{ 
            marginBottom: 24, 
            background: "white",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <div style={{ padding: 12 }}>
                <Text 
                  style={{ 
                    color: COLORS.textSecondary,
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}
                >
                  TỒN KHO HIỆN TẠI
                </Text>
                <div 
                  style={{ 
                    fontSize: 42, 
                    fontWeight: 800,
                    color: COLORS.primary,
                    marginTop: 8,
                    lineHeight: 1,
                  }}
                >
                  {currentQty.toLocaleString()}
                </div>
                <Text 
                  style={{ 
                    color: COLORS.textSecondary,
                    fontSize: 12,
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  sản phẩm
                </Text>
              </div>
            </Col>

            <Col xs={24} md={12}>
              {typeof newQuantity === "number" && (
                <div 
                  style={{ 
                    padding: 12,
                    background: getChangeTypeBackground(),
                    borderRadius: 12,
                    border: `1px solid ${getStatusColor()}20`,
                  }}
                >
                  <Text 
                    style={{ 
                      color: COLORS.textSecondary,
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: 0.5,
                    }}
                  >
                    THAY ĐỔI
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: getStatusColor(),
                      fontWeight: 700,
                      fontSize: 20,
                      marginTop: 8,
                    }}
                  >
                    {getStatusIcon()}
                    {getStatusText()}
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: COLORS.purpleLight,
              borderRadius: 10,
              border: `1px solid ${COLORS.purple}20`,
            }}
          >
            <InfoCircleOutlined style={{ color: COLORS.purple, fontSize: 16, marginTop: 2 }} />
            <Text 
              style={{ 
                color: COLORS.purpleDark,
                fontSize: 13,
                flex: 1,
              }}
            >
             {!hasValue
  ? "Vui lòng nhập số lượng tồn kho mới"
  : noChange
  ? "Số lượng tồn kho sẽ được giữ nguyên"
  : isIncrease
  ? "Số lượng tồn kho sẽ được tăng lên sau khi điều chỉnh"
  : "Số lượng tồn kho sẽ được giảm xuống sau khi điều chỉnh"}

            </Text>
          </div>
        </Card>

        {/* ===== FORM ===== */}
        <div style={{ marginBottom: 24 }}>
          <Card
            style={{
              background: "white",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Form layout="vertical" form={form}>
              {/* === NEW QUANTITY === */}
              <div style={{ marginBottom: 16 }}>
                <Form.Item
                  label={
                    <span style={{ fontWeight: 600, color: COLORS.primary }}>
                      Số lượng tồn mới
                    </span>
                  }
                  name="newQuantity"
                  rules={[{ validator: validateNewQuantity }]}
                  help={
                    typeof newQuantity === "number" ? (
                      <div style={{ marginTop: 8 }}>
                        <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                          Tồn kho sau điều chỉnh:{" "}
                          <span style={{ color: COLORS.primary, fontWeight: 600 }}>
                            {newQuantity.toLocaleString()} sản phẩm
                          </span>
                        </Text>
                      </div>
                    ) : undefined
                  }
                >
                  <InputNumber
                    min={0}
                    max={100000}
                    style={{ 
                      width: "100%",
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      height: 44,
                    }}
                    placeholder="Nhập số lượng tồn kho mới"
                    controls={false}
                    size="large"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                   
                  />
                </Form.Item>
              </div>

              {/* === REASON === */}
              <div>
                <Form.Item 
                  label={
                    <span style={{ fontWeight: 600, color: COLORS.primary }}>
                      Lý do điều chỉnh
                    </span>
                  } 
                  name="reason"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập lý do điều chỉnh tồn kho (ví dụ: Kiểm kê, Hư hỏng, Nhập thêm,...)"
                    maxLength={500}
                    showCount
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      resize: "vertical",
                    }}
                  />
                </Form.Item>
              </div>
            </Form>
          </Card>
        </div>

        {/* ===== SUMMARY ===== */}
        <div
          style={{
            padding: 20,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Text 
            style={{ 
              color: COLORS.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              display: "block",
              marginBottom: 12,
            }}
          >
            TỔNG KẾT THAY ĐỔI
          </Text>
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div 
                  style={{ 
                    fontSize: 20, 
                    fontWeight: 700,
                    color: COLORS.textSecondary,
                    background: COLORS.light,
                    padding: "6px 14px",
                    borderRadius: 10,
                  }}
                >
                  {currentQty.toLocaleString()}
                </div>
                <div style={{ color: COLORS.textSecondary, fontSize: 18 }}>→</div>
                <div 
                  style={{ 
                    fontSize: 20, 
                    fontWeight: 700,
                    color: COLORS.primary,
                    background: COLORS.light,
                    padding: "6px 14px",
                    borderRadius: 10,
                  }}
                >
                  {typeof newQuantity === "number" ? newQuantity.toLocaleString() : "?"}
                </div>
              </div>
              
              {typeof newQuantity === "number" && !noChange && (
                <div 
                  style={{ 
                    fontSize: 14, 
                    color: COLORS.textSecondary,
                    fontStyle: "italic",
                  }}
                >
                  {isIncrease ? "Tăng" : "Giảm"} {Math.abs(quantityChange).toLocaleString()} sản phẩm
                </div>
              )}
            </div>

            <Tag
              color={getChangeTypeColor()}
              style={{
                borderRadius: 12,
                padding: "6px 16px",
                fontWeight: 700,
                fontSize: 14,
                minWidth: 90,
                textAlign: "center",
                border: "none",
                background: getChangeTypeBackground(),
                color: getStatusColor(),
              }}
            >
              {noChange
                ? "Không đổi"
                : `${isIncrease ? "+" : "-"}${Math.abs(quantityChange).toLocaleString()}`}
            </Tag>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdjustStockModal;