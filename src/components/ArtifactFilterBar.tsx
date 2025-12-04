// ArtifactFilterBar.transition.tsx
import React, { useState, useTransition, useEffect } from "react";
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
  const [inputValue, setInputValue] = useState(searchText || "");
  const [isPending, startTransition] = useTransition();

  // keep local input in sync if parent changes searchText externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(searchText || "");
  }, [searchText]);

  const handleChange = (val: string) => {
    setInputValue(val);
    // defer the expensive update (filter) so UI stays snappy
    startTransition(() => {
      onSearchTextChange(val);
    });
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      {canCreate && (
        <Button type="primary" onClick={onCreate}>
          Thêm hiện vật
        </Button>
      )}

      <Input
        placeholder="Tìm theo mã hoặc tên"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: 250 }}
        allowClear
        onPressEnter={() => onSearchTextChange(inputValue)}
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

      {/* Optional visual hint */}
      {isPending ? <span>Loading…</span> : null}
    </Space>
  );
};

export default React.memo(ArtifactFilterBar);
