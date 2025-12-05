// src/components/AdjustStockModal.tsx
import React from "react";
import { Modal, Form, InputNumber, Input } from "antd";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  currentQty,
  form,
  onCancel,
  onOk,
}) => {
  return (
    <Modal
      open={open}
      title={`Điều chỉnh tồn - ${artifactName || ""}`}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Tồn hiện tại">
          <InputNumber value={currentQty} disabled style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Tồn mới"
          name="newQuantity"
          rules={[{ required: true, message: "Vui lòng nhập tồn mới" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Lý do" name="reason">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdjustStockModal;
