/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Space,
  Table,
  Typography,
  Tooltip,
  Popconfirm,
  Avatar,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Category } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";
import {
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

type Props = {
  data: Category[];
  loading: boolean;
  page: number;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
  onChange: (pagination: any) => void;
};

const CategoryTable: React.FC<Props> = ({
  data,
  loading,
  page,
  onEdit,
  onDelete,
  onChange,
}) => {
  const { hasPermission } = useAuth();

  const columns: ColumnsType<Category> = [
    {
      title: "STT",
      key: "index",
      width: 80,
      align: "center",
      render: (_t, _r, i) => (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            color: "#2C3E50",
          }}
        >
          {i + 1}
        </div>
      ),
    },
    {
      title: "TÊN DANH MỤC",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text: string) => (
        <Space size={12}>
          <Avatar
            size={36}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 8,
            }}
            icon={<FolderOutlined />}
          />
          <div>
            <Text strong style={{ display: "block", fontSize: 14 }}>
              {text}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Text
          type={text ? undefined : "secondary"}
          style={{ fontStyle: text ? "normal" : "italic" }}
        >
          {text || "Không có mô tả"}
        </Text>
      ),
    },

    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      width: 180,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          {hasPermission("CREATE_ARTIFACT") && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                  style={{
                    borderRadius: 6,
                    background: "#f6ffed",
                    color: "#52c41a",
                    width: 36,
                    height: 36,
                  }}
                />
              </Tooltip>

              <Tooltip title="Xóa">
                <Popconfirm
                  title="Xóa danh mục"
                  description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
                  onConfirm={() => onDelete(record._id!)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    style={{
                      borderRadius: 6,
                      background: "#fff2f0",
                      color: "#ff4d4f",
                      width: 36,
                      height: 36,
                    }}
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #f0f0f0",
      }}
    >
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        onChange={onChange}
        pagination={{
          current: page,
          pageSize: 10,
          showTotal: (total, range) => (
            <span style={{ color: "#595959", fontSize: 13 }}>
              Hiển thị {range[0]}-{range[1]} trong tổng số {total} danh mục
            </span>
          ),
          style: {
            margin: "16px 24px",
            padding: "12px 20px",
            background: "#fafafa",
            borderRadius: 8,
          },
        }}
        scroll={{ x: 1000 }}
        style={{
          borderRadius: 12,
        }}
        rowClassName={() => "table-row"}
        onRow={(record) => ({
          onClick: () => console.log("Row clicked", record),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
};

export default CategoryTable;
