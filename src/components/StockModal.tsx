// src/components/StockModal.tsx
import React from "react";
import { Modal, Form, InputNumber, Input } from "antd";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  open: boolean;
  mode: "import" | "export";
  artifactName?: string;
  form: any;
  onCancel: () => void;
  onOk: () => void;
};

const StockModal: React.FC<Props> = ({
  open,
  mode,
  artifactName,
  form,
  onCancel,
  onOk,
}) => {
  const titlePrefix = mode === "import" ? "Nhập kho" : "Xuất kho";

  return (
    <Modal
      open={open}
      title={`${titlePrefix} - ${artifactName || ""}`}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
      centered
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Lý do" name="reason">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StockModal;
