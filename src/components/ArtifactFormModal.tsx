/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ArtifactFormModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { artifactApi } from "../api/artifactApi";

import { categoryApi } from "../api/categoryApi";

export type Artifact = {
  _id?: string;
  code?: string;
  name?: string;
  description?: string;
  location?: string;
  status?: string;
  imageUrl?: string | null;
  category?: { _id?: string; name?: string } | null;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  artifact?: Artifact | null;
  onClose: () => void;
  onSuccess?: (artifact?: Artifact) => void;
};

const ArtifactFormModal: React.FC<Props> = ({
  open,
  mode,
  artifact,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      form.resetFields();
      setFileList([]);
      setCurrentArtifact(null);
    } else {
      form.setFieldsValue({
        code: artifact?.code,
        name: artifact?.name,
        description: artifact?.description,
        location: artifact?.location,
        status: artifact?.status,
        categoryId: artifact?.category?._id ?? null,
      });
      setCurrentArtifact(artifact ?? null);
      setFileList(
        artifact?.imageUrl
          ? [
              {
                uid: "1",
                name: "image",
                status: "done",
                url: artifact.imageUrl,
              },
            ]
          : []
      );
    }
  }, [open, mode, artifact, form]);

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

      const chosenFile = fileList?.[0]?.originFileObj as File | undefined;
      if (mode === "create") {
        const initial = values.initialQuantity;
        const qty =
          initial === undefined || initial === "" ? 0 : Number(initial);
        if (Number.isNaN(qty) || qty < 0) {
          form.setFields([
            { name: "initialQuantity", errors: ["Số lượng phải >= 0"] },
          ]);
          setSubmitting(false);
          return;
        }
        payload.initialQuantity = qty;
      }

      let saved: Artifact | null = null;

      if (mode === "edit") {
        if (!currentArtifact?._id) {
          message.error("Không có id hiện vật để cập nhật");
          setSubmitting(false);
          return;
        }
        const res = await artifactApi.update(currentArtifact._id, payload);
        saved = res.data;
        setCurrentArtifact(saved ?? null);
      } else {
        const res = await artifactApi.create(payload);
        saved = res.data;
        if (!saved || !saved._id) {
          message.error("Tạo thất bại: server không trả id");
          setSubmitting(false);
          return;
        }
        setCurrentArtifact(saved);
      }

      if (chosenFile && saved && saved._id) {
        try {
          await artifactApi.uploadImage(saved._id, chosenFile);
          const ref = await artifactApi.get(saved._id);
          const updated = ref.data;
          setCurrentArtifact(updated ?? null);
          if (updated?.imageUrl) {
            setFileList([
              {
                uid: "1",
                name: "image",
                status: "done",
                url: updated.imageUrl,
              },
            ]);
          }
          message.success(
            mode === "create"
              ? "Tạo hiện vật thành công"
              : "Cập nhật thành công"
          );
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          message.error("Lưu thành công nhưng upload ảnh thất bại");
        }
      } else {
        message.success(
          mode === "create" ? "Tạo hiện vật thành công" : "Cập nhật thành công"
        );
      }

      if (onSuccess) onSuccess(saved ?? undefined);
    } catch (err: any) {
      console.error("Save artifact error:", err);
      const backendMsg = err?.response?.data?.message;
      const backendField = err?.response?.data?.field;

      if (backendField) {
        form.setFields([
          { name: backendField, errors: [backendMsg || "Lỗi từ server"] },
        ]);
      }

      if (backendField === "code") {
        message.error(backendMsg || "Mã đã tồn tại");
      } else {
        message.error(backendMsg || "Lưu thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentArtifact?._id) {
      setFileList([]);
      return;
    }
    try {
      await artifactApi.deleteImage(currentArtifact._id);
      const refetch = await artifactApi.get(currentArtifact._id);
      setCurrentArtifact(refetch.data?.artifact ?? refetch.data);
      setFileList([]);
      message.success("Xóa ảnh thành công");
    } catch (err) {
      console.error(err);
      message.error("Xóa ảnh thất bại");
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Tạo hiện vật" : "Sửa hiện vật"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      width={720}
      destroyOnClose
      okText={mode === "create" ? "Tạo" : "Lưu"}
      centered
    >
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Form layout="vertical" form={form}>
            <Form.Item label="Mã" name="code" rules={[{ required: true }]}>
              <Input disabled={mode === "edit"} />
            </Form.Item>

            <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Danh mục" name="categoryId">
              <Select allowClear placeholder="Chọn danh mục">
                {categories.map((c) => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item label="Vị trí" name="location">
              <Input />
            </Form.Item>

            {mode === "create" && (
              <Form.Item
                label="Số lượng ban đầu"
                name="initialQuantity"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === "" || value === null)
                        return Promise.resolve();
                      const n = Number(value);
                      if (!Number.isFinite(n) || n < 0)
                        return Promise.reject(new Error("Số lượng phải >= 0"));
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" min={0} placeholder="0" />
              </Form.Item>
            )}

            <Form.Item label="Trạng thái" name="status">
              <Select disabled={mode === "edit"} placeholder="Chọn trạng thái">
                {mode === "create" && (
                  <Select.Option value="bosung">Mới bổ sung</Select.Option>
                )}
                {mode === "edit" && (
                  <>
                    <Select.Option value="bosung">Mới bổ sung</Select.Option>
                    <Select.Option value="con">Còn hàng</Select.Option>
                    <Select.Option value="ban">Đã bán / Hết</Select.Option>
                  </>
                )}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div style={{ width: 260 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Ảnh hiện vật</div>

          {fileList.length > 0 ? (
            <>
              <Image
                src={
                  fileList[0].url ??
                  URL.createObjectURL(fileList[0].originFileObj)
                }
                width={220}
              />
              <Button
                danger
                block
                style={{ marginTop: 8 }}
                onClick={handleRemoveImage}
              >
                Xóa ảnh
              </Button>
            </>
          ) : currentArtifact?.imageUrl ? (
            <>
              <Image src={currentArtifact.imageUrl} width={220} />
              <Button
                danger
                block
                style={{ marginTop: 8 }}
                onClick={handleRemoveImage}
              >
                Xóa ảnh
              </Button>
            </>
          ) : (
            <div
              style={{
                width: 220,
                height: 140,
                background: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#999" }}>Chưa có ảnh</span>
            </div>
          )}

          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList: nl }) => setFileList(nl)}
            maxCount={1}
            accept="image/*"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} block style={{ marginTop: 8 }}>
              Chọn ảnh
            </Button>
          </Upload>
        </div>
      </div>
    </Modal>
  );
};

export default ArtifactFormModal;
