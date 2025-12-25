/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
  InputNumber,
} from "antd";
import {
  UploadOutlined,
  CameraOutlined,
  BarcodeOutlined,
  TagOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  NumberOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

import { artifactApi } from "../../api/artifactApi";
import { categoryApi } from "../../api/categoryApi";

/* ================= TYPES ================= */

export type ArtifactImage = {
  url: string;
  publicId: string;
};

export type Artifact = {
  _id?: string;
  code?: string;
  name?: string;
  description?: string;
  location?: string;
  status?: string;
  images?: ArtifactImage[];
  category?: { _id?: string; name?: string } | null;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  artifact?: Artifact | null;
  onClose: () => void;
  onSuccess?: (artifact?: Artifact) => void;
};

const { Title, Text } = Typography;

/* ================= DESIGN SYSTEM ================= */
const COLORS = {
  primary: "#2C3E50",
  secondary: "#34495E",
  accent: "#E74C3C",
  light: "#ECF0F1",
  background: "#F8FAFC",
  success: "#27AE60",
  warning: "#F39C12",
  border: "#D5DBDB",
  textSecondary: "#7F8C8D",
  blueLight: "#E3F2FD",
  greenLight: "#E8F5E9",
  redLight: "#FFEBEE",
  orangeLight: "#FFF3E0",
};

/* ================= COMPONENT ================= */

const ArtifactFormModal: React.FC<Props> = ({
  open,
  mode,
  artifact,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState(false);

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    categoryApi.getAll().then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  /* ================= INIT MODAL ================= */

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      form.resetFields();
      setFileList([]);
      setCurrentArtifact(null);
      // Set default status to "Mới bổ sung"
      form.setFieldsValue({
        status: "bosung",
      });
      return;
    }

    if (mode === "edit" && artifact) {
      form.setFieldsValue({
        code: artifact.code,
        name: artifact.name,
        description: artifact.description,
        location: artifact.location,
        status: artifact.status || "con",
        categoryId: artifact.category?._id ?? null,
      });

      setCurrentArtifact(artifact);

      // map images[] -> UploadFile[]
      setFileList(
        artifact.images?.map((img, index) => ({
          uid: img.publicId,
          name: `image-${index + 1}`,
          status: "done",
          url: img.url,
        })) || []
      );
    }
  }, [open, mode, artifact, form]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      const payload: any = {
        code: values.code?.trim(),
        name: values.name?.trim(),
        description: values.description?.trim(),
        location: values.location?.trim(),
        status: values.status,
        categoryId: values.categoryId || null,
      };

      // CREATE
      if (mode === "create") {
        const qty = Number(values.initialQuantity ?? 0);
        if (qty < 0) {
          form.setFields([
            { name: "initialQuantity", errors: ["Số lượng phải >= 0"] },
          ]);
          return;
        }
        if (qty > 10000) {
          form.setFields([
            { name: "initialQuantity", errors: ["Số lượng quá lớn"] },
          ]);
          return;
        }
        payload.initialQuantity = qty;
      }

      let saved: Artifact;

      if (mode === "edit") {
        if (!currentArtifact?._id) {
          message.error("Không có ID hiện vật");
          return;
        }
        const res = await artifactApi.update(currentArtifact._id, payload);
        saved = res.data;
      } else {
        const res = await artifactApi.create(payload);
        saved = res.data;
      }

     const newFiles = fileList
      .filter((f) => !!f.originFileObj)
      .map((f) => f.originFileObj as File);

    let finalArtifact = saved;

    if (newFiles.length && saved._id) {
      await artifactApi.uploadImages(saved._id, newFiles);

      // 🔥 LẤY LẠI ARTIFACT SAU KHI UPLOAD ẢNH
      const refreshed = await artifactApi.get(saved._id);
      finalArtifact = refreshed.data;
    }

    message.success(
      mode === "create"
        ? "Tạo hiện vật thành công!"
        : "Cập nhật thành công!"
    );

    onSuccess?.(finalArtifact); // ✅ CHỈ 1 LẦN
    onClose();
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "❌ Lưu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE IMAGE ================= */

  const handleRemoveImage = async (file: UploadFile) => {
    if (!currentArtifact?._id) return true;

    // ảnh mới → chỉ remove UI
    if (!file.url) return true;

    try {
      await artifactApi.deleteImage(currentArtifact._id, file.uid);
      message.success("🗑️ Xóa ảnh thành công");
      return true;
    } catch (err) {
      message.error("❌ Xóa ảnh thất bại");
      return false;
    }
  };

  /* ================= PREVIEW IMAGE ================= */
  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  /* ================= RENDER STATUS TAG ================= */
  const renderStatusTag = (status: string) => {
    const statusConfig = {
      bosung: {
        color: "#3498DB",
        label: "Mới bổ sung",
        bgColor: COLORS.blueLight,
      },
      con: {
        color: COLORS.success,
        label: "Còn hàng",
        bgColor: COLORS.greenLight,
      },
      ban: {
        color: COLORS.accent,
        label: "Đã bán / Hết",
        bgColor: COLORS.redLight,
      },
    }[status];

    if (!statusConfig) return null;

    return (
      <Tag
        color={statusConfig.color}
        style={{
          borderRadius: 12,
          padding: "4px 12px",
          border: `1px solid ${statusConfig.color}`,
          background: statusConfig.bgColor,
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {statusConfig.label}
      </Tag>
    );
  };

  /* ================= RENDER STATUS SELECT ================= */
  const renderStatusSelect = () => {
    if (mode === "create") {
      return (
        <Select
          size="large"
          placeholder="Chọn trạng thái"
          style={{
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
          }}
          value="bosung"
          disabled={true}
          suffixIcon={<LockOutlined style={{ color: COLORS.textSecondary }} />}
          dropdownRender={(menu) => (
            <div style={{ padding: 8 }}>
              <div
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  marginBottom: 8,
                }}
              >
                TRẠNG THÁI HIỆN VẬT MỚI
              </div>
              {menu}
            </div>
          )}
        >
          <Select.Option value="bosung">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#3498DB",
                }}
              />
              <span>Mới bổ sung</span>
            </div>
          </Select.Option>
        </Select>
      );
    }

    // Edit mode - show current status as disabled
    const currentStatus = form.getFieldValue("status");

    return (
      <div>
        {/* Status Select (disabled in edit mode) */}
        <Select
          size="large"
          placeholder="Chọn trạng thái"
          style={{
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.light,
            cursor: "not-allowed",
          }}
          value={currentStatus}
          disabled={true}
          suffixIcon={<LockOutlined style={{ color: COLORS.textSecondary }} />}
          dropdownRender={() => (
            <div style={{ padding: 16, textAlign: "center" }}>
              <LockOutlined
                style={{
                  fontSize: 24,
                  color: COLORS.textSecondary,
                  marginBottom: 8,
                }}
              />
              <Text type="secondary">
                Trạng thái không thể thay đổi trong chế độ chỉnh sửa
              </Text>
            </div>
          )}
        >
          {/* Options are disabled anyway, but we keep them for structure */}
          <Select.Option value="bosung">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#3498DB",
                }}
              />
              <span>Mới bổ sung</span>
            </div>
          </Select.Option>
          <Select.Option value="con">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: COLORS.success,
                }}
              />
              <span>Còn hàng</span>
            </div>
          </Select.Option>
          <Select.Option value="ban">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: COLORS.accent,
                }}
              />
              <span>Đã bán / Hết</span>
            </div>
          </Select.Option>
        </Select>

        {/* Current Status Display (only in edit mode) */}
      </div>
    );
  };

  /* ================= RENDER ================= */

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 18,
            }}
          >
            {mode === "create" ? "➕" : "✏️"}
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {mode === "create" ? "Thêm hiện vật mới" : "Chỉnh sửa hiện vật"}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {mode === "create"
                ? "Nhập thông tin để thêm hiện vật mới vào hệ thống"
                : "Cập nhật thông tin hiện vật hiện có"}
            </Text>
          </div>
        </div>
      }
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      width={900}
      destroyOnClose
      okText={mode === "create" ? "Tạo hiện vật" : "Cập nhật"}
      cancelText="Hủy"
      centered
      bodyStyle={{
        padding: 0,
        background: COLORS.background,
        borderRadius: 12,
      }}
    >
      <div style={{ padding: 24 }}>
        <Row gutter={[32, 0]}>
          {/* ================= LEFT COLUMN - FORM ================= */}
          <Col span={14}>
            <Card
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                marginBottom: 24,
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Form layout="vertical" form={form}>
                {/* Code and Name Row */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <BarcodeOutlined style={{ color: COLORS.accent }} />
                          <span style={{ fontWeight: 600 }}>Mã hiện vật</span>
                        </div>
                      }
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã hiện vật",
                        },
                        { max: 50, message: "Mã hiện vật quá dài" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="VD: HV-001"
                        disabled={mode === "edit"}
                        style={{
                          borderRadius: 8,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <TagOutlined style={{ color: COLORS.accent }} />
                          <span style={{ fontWeight: 600 }}>Tên hiện vật</span>
                        </div>
                      }
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên hiện vật",
                        },
                        { max: 200, message: "Tên hiện vật quá dài" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="VD: Bình gốm cổ"
                        style={{
                          borderRadius: 8,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Category and Status Row */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <AppstoreOutlined style={{ color: COLORS.accent }} />
                          <span style={{ fontWeight: 600 }}>Danh mục</span>
                        </div>
                      }
                      name="categoryId"
                    >
                      <Select
                        size="large"
                        placeholder="Chọn danh mục"
                        allowClear
                        style={{
                          borderRadius: 8,
                          border: `1px solid ${COLORS.border}`,
                        }}
                        dropdownStyle={{
                          borderRadius: 8,
                        }}
                      >
                        {categories.map((c) => (
                          <Select.Option
                            key={c._id}
                            value={c._id}
                            style={{ padding: "8px 12px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: COLORS.primary,
                                }}
                              />
                              {c.name}
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <InfoCircleOutlined
                            style={{ color: COLORS.accent }}
                          />
                          <span style={{ fontWeight: 600 }}>Trạng thái</span>
                        </div>
                      }
                      name="status"
                    >
                      {renderStatusSelect()}
                    </Form.Item>
                  </Col>
                </Row>

                {/* Initial Quantity (Create only) */}
                {mode === "create" && (
                  <Form.Item
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <NumberOutlined style={{ color: COLORS.accent }} />
                        <span style={{ fontWeight: 600 }}>
                          Số lượng ban đầu
                        </span>
                      </div>
                    }
                    name="initialQuantity"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng" },
                      {
                        type: "number",
                        min: 0,
                        message: "Số lượng phải ≥ 0",
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      min={0} 
                      max={10000}
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        border: `1px solid ${COLORS.border}`,
                      }}
                      placeholder="VD: 10"
                    />
                  </Form.Item>
                )}

                {/* Location */}
                <Form.Item
                  label={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <EnvironmentOutlined style={{ color: COLORS.accent }} />
                      <span style={{ fontWeight: 600 }}>Vị trí lưu trữ</span>
                    </div>
                  }
                  name="location"
                >
                  <Input
                    size="large"
                    placeholder="VD: Kho A, Tầng 2"
                    style={{
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                </Form.Item>

                {/* Description */}
                <Form.Item
                  label={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <InfoCircleOutlined style={{ color: COLORS.accent }} />
                      <span style={{ fontWeight: 600 }}>Mô tả chi tiết</span>
                    </div>
                  }
                  name="description"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Mô tả chi tiết về hiện vật..."
                    maxLength={1000}
                    showCount
                    style={{
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                      resize: "vertical",
                    }}
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* ================= RIGHT COLUMN - IMAGES ================= */}
          <Col span={10}>
            <Card
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                height: "100%",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <CameraOutlined />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      Hình ảnh hiện vật
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tối đa 5 ảnh, mỗi ảnh tối đa 5MB
                    </Text>
                  </div>
                </div>

                {/* Image Stats */}
                <div
                  style={{
                    background: COLORS.light,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
                      Đã tải lên
                    </Text>
                    <Text strong style={{ fontSize: 12 }}>
                      {fileList.length}/5 ảnh
                    </Text>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: COLORS.border,
                      borderRadius: 2,
                      marginTop: 8,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(fileList.length / 5) * 100}%`,
                        height: "100%",
                        background: COLORS.primary,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>

                {/* Upload Area */}
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  multiple
                  maxCount={5}
                  accept="image/*"
                  onChange={({ fileList: newFileList }) => {
                    if (newFileList.length > 5) {
                      message.warning(
                        "⚠️ Chỉ được tối đa 5 ảnh cho mỗi hiện vật"
                      );
                    }

                    // ⚠️ LUÔN cắt còn 5
                    setFileList(newFileList.slice(0, 5));
                  }}
                  onRemove={handleRemoveImage}
                  onPreview={handlePreview}
                  style={{ width: "100%" }}
                  itemRender={(originNode, file) => (
                    <div style={{ position: "relative" }}>
                      {originNode}
                      {file.status === "uploading" && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(255,255,255,0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              border: `2px solid ${COLORS.border}`,
                              borderTopColor: COLORS.primary,
                              animation: "spin 1s linear infinite",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                >
                  {fileList.length < 5 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: COLORS.textSecondary,
                        cursor: "pointer",
                        borderRadius: 8,
                        border: `2px dashed ${COLORS.border}`,
                        transition: "all 0.3s",
                        padding: 20,
                      }}
                    >
                      <UploadOutlined
                        style={{ fontSize: 32, marginBottom: 8 }}
                      />
                      <Text style={{ fontWeight: 500 }}>Thêm ảnh</Text>
                      <Text style={{ fontSize: 11, marginTop: 4 }}>
                        PNG, JPG, JPEG
                      </Text>
                    </div>
                  )}
                </Upload>

                {/* Preview Modal */}
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => setPreviewVisible(false)}
                  centered
                  bodyStyle={{ padding: 0 }}
                >
                  <img
                    alt="Preview"
                    style={{ width: "100%", display: "block" }}
                    src={previewImage}
                  />
                </Modal>

                {/* Status Preview - Only show in edit mode */}
                {mode === "edit" && form.getFieldValue("status") && (
                  <>
                    <Divider style={{ margin: "24px 0" }} />
                    <div>
                      <Text
                        strong
                        style={{
                          display: "block",
                          marginBottom: 12,
                          fontSize: 13,
                        }}
                      >
                        TRẠNG THÁI HIỆN TẠI:
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: COLORS.light,
                          padding: "12px 16px",
                          borderRadius: 8,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        {renderStatusTag(form.getFieldValue("status"))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .ant-upload.ant-upload-select-picture-card:hover {
          border-color: ${COLORS.primary};
        }
        
        .ant-select-dropdown {
          border-radius: 8px !important;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1) !important;
        }
        
        .ant-select-item-option-selected {
          background: ${COLORS.light} !important;
        }
      `}</style>
    </Modal>
  );
};

export default ArtifactFormModal;
