// src/components/HistoryModal.tsx
import React from "react";
import { Modal, Tag, Typography, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

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
  artifactName?: string;
  history: ArtifactTransaction[];
  onClose: () => void;
};

const HistoryModal: React.FC<Props> = ({
  open,
  loading,
  artifactName,
  history,
  onClose,
}) => {
  const columns: ColumnsType<ArtifactTransaction> = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: ArtifactTransaction["type"]) => {
        if (type === "IMPORT") {
          return <Tag color="blue">Nhập kho</Tag>;
        }
        if (type === "EXPORT") {
          return <Tag color="red">Xuất kho</Tag>;
        }
        return <Tag color="orange">Điều chỉnh</Tag>;
      },
    },
    {
      title: "Số lượng thay đổi",
      dataIndex: "quantityChange",
      key: "quantityChange",
      width: 160,
      render: (value: number) => (
        <Text strong className={value > 0 ? "text-green-700" : "text-red-700"}>
          {value > 0 ? `+${value}` : value}
        </Text>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (reason?: string) =>
        reason ? <Text>{reason}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (value: string) => {
        const dateStr = new Date(value).toLocaleString();
        return <Text>{dateStr}</Text>;
      },
    },
    {
      title: "Người thực hiện",
      key: "createdBy",
      dataIndex: "createdBy",
      width: 180,
      render: (createdBy?: { fullName?: string; email?: string }) =>
        createdBy?.fullName || createdBy?.email || (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Lịch sử giao dịch{" "}
            {artifactName && (
              <span className="text-sm font-normal text-gray-700">
                – {artifactName}
              </span>
            )}
          </span>
        </div>
      }
    >
      <div className="mt-2">
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={history}
          size="small"
          pagination={false}
          className="max-h-[60vh] overflow-y-auto"
        />
        {history.length === 0 && !loading && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Chưa có giao dịch nào
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HistoryModal;
