import React from "react";
import { Button, Input, Select, Space } from "antd";

type Props = {
  canCreate: boolean;
  onCreate: () => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange: (value?: string) => void;
};

const ArtifactFilterBar: React.FC<Props> = ({
  canCreate,
  onCreate,
  searchText,
  onSearchTextChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      {canCreate && (
        <Button type="primary" onClick={onCreate}>
          Thêm hiện vật
        </Button>
      )}

      <Input
        placeholder="Tìm theo mã hoặc tên"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        style={{ width: 250 }}
      />

      <Select
        allowClear
        placeholder="Lọc theo trạng thái"
        style={{ width: 180 }}
        value={statusFilter}
        onChange={(val) => onStatusFilterChange(val)}
      >
        <Select.Option value="bosung">Mới bổ sung</Select.Option>
        <Select.Option value="con">Còn hàng</Select.Option>
        <Select.Option value="ban">Đã bán / Hết</Select.Option>
      </Select>
    </Space>
  );
};

export default ArtifactFilterBar;
