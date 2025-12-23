import React, { useEffect, useState, useTransition } from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

type Props = {
  searchText: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange: (value?: string) => void;
  filterVisible?: boolean;
  onToggleFilter?: () => void;
};

const ArtifactFilterBar: React.FC<Props> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [inputValue, setInputValue] = useState(searchText);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  const handleChange = (val: string) => {
    setInputValue(val);
    startTransition(() => {
      onSearchChange(val);
    });
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        background: "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <Space size={12} wrap>
        {/* Search */}
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
          placeholder="Tìm theo mã hoặc tên hiện vật"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          style={{
            width: 280,
            height: 40,
            borderRadius: 8,
          }}
        />

        {/* Status filter */}
        <Select
          allowClear
          value={statusFilter}
          placeholder="Trạng thái"
          onChange={onStatusFilterChange}
          style={{ width: 200, height: 40 }}
          suffixIcon={<FilterOutlined />}
        >
          <Select.Option value="bosung">Mới bổ sung</Select.Option>
          <Select.Option value="con">Còn hàng</Select.Option>
          <Select.Option value="ban">Đã bán / Hết</Select.Option>
        </Select>
      </Space>
    </div>
  );
};

export default React.memo(ArtifactFilterBar);
