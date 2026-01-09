/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Space,
  Table,
  Typography,
  Tooltip,
  Popconfirm,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Category } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";
import {
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  EyeOutlined,
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
      title: (
        <div>
          <span>TÊN DANH MỤC</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 300,
      render: (text: string) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "8px 0",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(4px)";
            e.currentTarget.style.paddingLeft = "4px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
            e.currentTarget.style.paddingLeft = "0";
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(124, 58, 237, 0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <FolderOpenOutlined
                style={{
                  fontSize: 20,
                  color: "white",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px 12px 0 0",
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Text
                strong
                style={{
                  fontSize: 15,
                  color: "#1a1a1a",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {text}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div>
          <span>MÔ TẢ</span>
        </div>
      ),
      dataIndex: "description",
      key: "description",
      width: 350,
      render: (text: string) => {
        if (!text) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(107, 114, 128, 0.05), rgba(107, 114, 128, 0.02))",
                border: "1px dashed rgba(107, 114, 128, 0.3)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(107, 114, 128, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileTextOutlined
                  style={{
                    fontSize: 16,
                    color: "#6b7280",
                    opacity: 0.6,
                  }}
                />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  Không có mô tả
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      fontWeight: 500,
                    }}
                  >
                    Nhập để có mô tả
                  </Text>
                </div>
              </div>
            </div>
          );
        }

        const shouldTruncate = text.length > 100;
        const displayText = shouldTruncate
          ? `${text.substring(0, 100)}...`
          : text;

        return (
          <div
            style={{
              padding: "16px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02))",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(59, 130, 246, 0.15)";
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
            }}
            onClick={() => {
              if (shouldTruncate) {
                Modal.info({
                  title: (
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
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background:
                            "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FileTextOutlined
                          style={{ fontSize: 20, color: "white" }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#1a1a1a",
                        }}
                      >
                        Chi tiết mô tả
                      </span>
                    </div>
                  ),
                  content: (
                    <div
                      style={{
                        padding: "20px",
                        background: "rgba(59, 130, 246, 0.03)",
                        borderRadius: 12,
                        border: "1px solid rgba(59, 130, 246, 0.1)",
                        lineHeight: 1.6,
                        fontSize: 15,
                        color: "#374151",
                      }}
                    >
                      {text}
                    </div>
                  ),
                  width: 600,
                  okText: "Đóng",
                  okButtonProps: {
                    style: {
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                    },
                  },
                  bodyStyle: { padding: 24 },
                });
              }
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 40,
                height: 40,
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)",
                borderBottomLeftRadius: 40,
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileTextOutlined
                  style={{
                    fontSize: 16,
                    color: "#3b82f6",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#1a1a1a",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}
                >
                  {displayText}
                </Text>

                {shouldTruncate && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <EyeOutlined style={{ fontSize: 12, color: "#3b82f6" }} />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#3b82f6",
                          fontWeight: 600,
                        }}
                      >
                        Xem thêm
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {text.length} ký tự
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      title: (
        <div>
          <span>HÀNH ĐỘNG</span>
        </div>
      ),
      key: "actions",
      width: 200,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={8}>
          {hasPermission("CREATE_ARTIFACT") && (
            <>
              <Tooltip
                title="Chỉnh sửa"
                color="#7c3aed"
                overlayInnerStyle={{
                  borderRadius: 8,
                  fontWeight: 500,
                }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined style={{ fontSize: 16 }} />}
                  onClick={() => onEdit(record)}
                  style={{
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))",
                    color: "#7c3aed",
                    width: 40,
                    height: 40,
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.05)";
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.1))";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(124, 58, 237, 0.25)";
                    e.currentTarget.style.borderColor = "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor =
                      "rgba(124, 58, 237, 0.2)";
                  }}
                />
              </Tooltip>

              <Tooltip
                title="Xóa"
                color="#ef4444"
                overlayInnerStyle={{
                  borderRadius: 8,
                  fontWeight: 500,
                }}
              >
                <Popconfirm
                  title={
                    <div style={{ padding: "4px 0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          <DeleteOutlined
                            style={{
                              fontSize: 18,
                              color: "#ef4444",
                            }}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#1a1a1a",
                              marginBottom: 4,
                            }}
                          >
                            Xóa danh mục
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              color: "#6b7280",
                              lineHeight: 1.5,
                            }}
                          >
                            Bạn có chắc chắn muốn xóa danh mục này? <br />
                            Hành động này không thể hoàn tác.
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  description={null}
                  onConfirm={() => onDelete(record._id!)}
                  okText={<span style={{ fontWeight: 600 }}>Xóa</span>}
                  cancelText={<span style={{ fontWeight: 500 }}>Hủy</span>}
                  okButtonProps={{
                    danger: true,
                    style: {
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      border: "none",
                      borderRadius: 8,
                      height: 40,
                      padding: "0 24px",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    },
                  }}
                  cancelButtonProps={{
                    style: {
                      borderRadius: 8,
                      height: 40,
                      padding: "0 24px",
                      fontWeight: 500,
                      border: "1px solid rgba(124, 58, 237, 0.3)",
                      color: "#7c3aed",
                    },
                  }}
                  icon={null}
                  overlayStyle={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    boxShadow: "0 12px 40px rgba(124, 58, 237, 0.2)",
                    background: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                    style={{
                      borderRadius: 10,
                      background:
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
                      color: "#ef4444",
                      width: 40,
                      height: 40,
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-2px) scale(1.05)";
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(239, 68, 68, 0.25)";
                      e.currentTarget.style.borderColor = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor =
                        "rgba(239, 68, 68, 0.2)";
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
