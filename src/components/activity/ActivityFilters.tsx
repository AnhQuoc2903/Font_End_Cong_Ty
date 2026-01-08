import React from "react";
import { Space, Select, DatePicker, Button } from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

const { RangePicker } = DatePicker;

interface ActivityFiltersProps {
  onExport: () => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ onExport }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const actionFilter = searchParams.get("action") || undefined;

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_USER: "Tạo người dùng",
      UPDATE_USER: "Cập nhật người dùng",
      DELETE_USER: "Xóa người dùng",
    };
    return labels[action] || action;
  };

  return (
    <Space 
      align="center" 
      wrap 
      size="middle" 
      style={{ 
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "24px"
      }}
    >
      <Space wrap size="middle">
        <Select
          allowClear
          placeholder="Lọc theo hành động"
          style={{ 
            width: 200, 
            borderRadius: "8px",
            height: 40
          }}
          suffixIcon={<FilterOutlined />}
          onChange={(value) => {
            setSearchParams({
              page: "1",
              ...(value ? { action: value } : {}),
            });
          }}
          value={actionFilter}
        >
          {["CREATE_USER", "UPDATE_USER", "DELETE_USER"].map((action) => (
            <Select.Option key={action} value={action}>
              {getActionLabel(action)}
            </Select.Option>
          ))}
        </Select>

        <RangePicker
          style={{ 
            borderRadius: "8px",
            height: 40
          }}
          placeholder={["Từ ngày", "Đến ngày"]}
          onChange={(dates) => {
            if (dates) {
              setSearchParams({
                page: "1",
                dateRange: dates
                  .map((d) => d?.format("YYYY-MM-DD"))
                  .join(","),
              });
            } else {
              const params = new URLSearchParams(searchParams);
              params.delete("dateRange");
              setSearchParams(params);
            }
          }}
        />
      </Space>

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={onExport}
        style={{
          height: 40,
          padding: "0 20px",
          borderRadius: 8,
          background: "linear-gradient(135deg, #0a9f47 0%, #21c55d 100%)",
          border: "none",
          color: "#fff",
          fontWeight: 500,
          boxShadow: "0 2px 8px rgba(10, 159, 71, 0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #0a9f47 0%, #16a34a 100%)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(10, 159, 71, 0.4)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #0a9f47 0%, #21c55d 100%)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(10, 159, 71, 0.3)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Xuất file
      </Button>
    </Space>
  );
};

export default ActivityFilters;