/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Form,
  message,
  Dropdown,
  type MenuProps,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SearchOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

import { artifactApi } from "../api/artifactApi";
import { aiApi } from "../api/aiApi";
import { useAuth } from "../context/AuthContext";
import ArtifactFilterBar from "../components/ArtifactFilterBar";
import ImageCell from "../components/ImageCell";
import ArtifactFormModal from "../components/ArtifactFormModal";
import StockModal from "../components/StockModal";
import AdjustStockModal from "../components/AdjustStockModal";
import HistoryModal from "../components/HistoryModal";
import ArtifactDetailModal from "../components/ArtifactDetailModal";
import GoogleSearchModal from "../components/GoogleSearchModal";

export type Artifact = {
  createdBy: any;
  updatedAt: any;
  createdAt: any;
  _id: string;
  code: string;
  name: string;
  description?: string;
  location?: string;
  quantityCurrent: number;
  status?: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  category?: { _id?: string; name?: string } | null;
};

type GoogleResult = {
  title: string;
  imageUrl: string;
  contextLink?: string;
  snippet?: string;
};

type ArtifactTransaction = {
  _id: string;
  type: "IMPORT" | "EXPORT" | "ADJUST";
  quantityChange: number;
  reason?: string;
  createdAt: string;
  createdBy?: { fullName?: string; email?: string };
};

const ArtifactsPage: React.FC = () => {
  const [data, setData] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [modalType, setModalType] = useState<
    "create" | "edit" | "import" | "export" | "adjust" | null
  >(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null
  );
  const [form] = Form.useForm();
  const { hasPermission } = useAuth();

  // search / filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const debounceRef = useRef<number | undefined>(undefined);

  // Google modal
  const [googleOpen, setGoogleOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleResults, setGoogleResults] = useState<GoogleResult[]>([]);

  // history
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<ArtifactTransaction[]>([]);

  // fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await artifactApi.getList();
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải danh sách hiện vật");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // helpers
  const shorten = (s = "", n = 30) =>
    s && s.length > n ? s.slice(0, n) + "..." : s || "-";
  const removeVietnameseTones = (str = "") => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // search debounce
  const onSearchTextChange = (val: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearchText(val);
    }, 250);
  };

  const openModal = (type: typeof modalType, record?: Artifact) => {
    setModalType(type);
    setSelectedArtifact(record || null);
    form.resetFields();
  };

  const handleImportExport = async () => {
    if (!selectedArtifact || !modalType) return;
    const values = await form.validateFields();
    try {
      if (modalType === "import") {
        await artifactApi.import(selectedArtifact._id, {
          quantity: values.quantity,
          reason: values.reason,
        });
        message.success("Nhập kho thành công");
      } else if (modalType === "export") {
        await artifactApi.export(selectedArtifact._id, {
          quantity: values.quantity,
          reason: values.reason,
        });
        message.success("Xuất kho thành công");
      }
      setModalType(null);
      await fetchData();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Google search flow
  const openGoogleFor = async (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    const q =
      `${artifact.name} ${artifact.description || ""}`.trim() || artifact.name;
    setGoogleOpen(true);
    setGoogleLoading(true);
    setGoogleResults([]);
    try {
      const res = await aiApi.searchGoogle(q);
      setGoogleResults(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi gọi Google Search");
    } finally {
      setGoogleLoading(false);
    }
  };

  const openHistory = async (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await artifactApi.getTransactions(artifact._id);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải lịch sử giao dịch");
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchText && !statusFilter) return data;
    const text = removeVietnameseTones(searchText.trim());

    return data.filter((item) => {
      const haystack = removeVietnameseTones(
        `${item.code || ""} ${item.name || ""}`
      );
      if (text && !haystack.includes(text)) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      return true;
    });
  }, [data, searchText, statusFilter]);

  const columns: ColumnsType<Artifact> = useMemo(
    () => [
      { title: "STT", key: "index", width: 60, render: (_t, _r, i) => i + 1 },
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 140,
        render: (v) => shorten(v, 24),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        width: 140,
        render: (v) => shorten(v, 36),
      },
      {
        title: "Ảnh",
        key: "image",
        width: 160,
        align: "center",
        render: (_: any, record: Artifact) => (
          <ImageCell src={record.imageUrl} alt={record.name} size={96} />
        ),
      },
      {
        title: "Danh mục",
        key: "category",
        dataIndex: ["category", "name"],
        width: 70,
        render: (v) => shorten(v as string, 24),
      },
      {
        title: "Tồn kho",
        dataIndex: "quantityCurrent",
        key: "quantityCurrent",
        width: 100,
        align: "center",
      },
      {
        title: "Vị trí",
        dataIndex: "location",
        key: "location",
        width: 160,
        render: (v) => shorten(v, 24),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (status: string | undefined) => {
          if (!status) return <Tag>-</Tag>;

          const colorMap: Record<string, string> = {
            bosung: "cyan",
            con: "green",
            ban: "red",
          };
          const labelMap: Record<string, string> = {
            bosung: "Bổ sung",
            con: "Còn hàng",
            ban: "Hết hàng",
          };

          return (
            <Tag color={colorMap[status] || "default"}>
              {labelMap[status] ||
                status.charAt(0).toUpperCase() + status.slice(1)}
            </Tag>
          );
        },
      },
      {
        key: "action",
        width: 72,
        align: "center",
        render: (_: any, record: Artifact) => {
          const items: MenuProps["items"] = [
            hasPermission("EDIT_ARTIFACT")
              ? { key: "edit", label: "Sửa", icon: <EditOutlined /> }
              : null,
            hasPermission("DELETE_ARTIFACT")
              ? { key: "delete", label: "Xóa", icon: <DeleteOutlined /> }
              : null,
            hasPermission("IMPORT_ARTIFACT")
              ? {
                  key: "import",
                  label: "Nhập kho",
                  icon: <PlusCircleOutlined />,
                }
              : null,
            hasPermission("EXPORT_ARTIFACT")
              ? {
                  key: "export",
                  label: "Xuất kho",
                  icon: <MinusCircleOutlined />,
                }
              : null,
            hasPermission("ADJUST_ARTIFACT")
              ? {
                  key: "adjust",
                  label: "Điều chỉnh tồn",
                  icon: <SlidersOutlined />,
                }
              : null,
            hasPermission("VIEW_ARTIFACT_TRANSACTIONS")
              ? { key: "history", label: "Lịch sử", icon: <HistoryOutlined /> }
              : null,
            { key: "google", label: "Tìm Google", icon: <SearchOutlined /> },
            {
              key: "detail",
              label: "Xem chi tiết",
              icon: <InfoCircleOutlined />,
            },
          ].filter(Boolean) as MenuProps["items"];

          const onMenuClick: MenuProps["onClick"] = async ({ key }) => {
            try {
              if (key === "edit") {
                openModal("edit", record);
              } else if (key === "delete") {
                Modal.confirm({
                  title: `Xóa hiện vật "${record.name}"?`,
                  content: "Hành động này không thể hoàn tác.",
                  okText: "Xóa",
                  okType: "danger",
                  cancelText: "Hủy",
                  onOk: async () => {
                    try {
                      await artifactApi.remove(record._id);
                      message.success("Đã xóa hiện vật");
                      fetchData();
                    } catch (err: any) {
                      console.error(err);
                      message.error(
                        err?.response?.data?.message || "Xóa thất bại"
                      );
                    }
                  },
                });
              } else if (key === "import") {
                openModal("import", record);
              } else if (key === "export") {
                openModal("export", record);
              } else if (key === "adjust") {
                openModal("adjust", record);
              } else if (key === "history") {
                openHistory(record);
              } else if (key === "google") {
                openGoogleFor(record);
              } else if (key === "detail") {
                setSelectedArtifact(record);
                setDetailOpen(true);
              }
            } catch (err) {
              console.error(err);
            }
          };

          return (
            <Dropdown
              menu={{ items, onClick: onMenuClick }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button icon={<EllipsisOutlined />} size="small" />
            </Dropdown>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasPermission]
  );

  // RENDER
  return (
    <>
      <ArtifactFilterBar
        canCreate={hasPermission("CREATE_ARTIFACT")}
        onCreate={() => openModal("create")}
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        size="middle"
      />

      <ArtifactFormModal
        open={modalType === "create" || modalType === "edit"}
        mode={modalType === "create" ? "create" : "edit"}
        artifact={selectedArtifact}
        onClose={() => setModalType(null)}
        onSuccess={() => {
          setModalType(null);
          fetchData();
        }}
      />

      <StockModal
        open={modalType === "import" || modalType === "export"}
        mode={modalType === "import" ? "import" : "export"}
        artifactName={selectedArtifact?.name}
        form={form}
        onCancel={() => setModalType(null)}
        onOk={handleImportExport}
      />

      <AdjustStockModal
        open={modalType === "adjust"}
        artifactName={selectedArtifact?.name}
        currentQty={selectedArtifact?.quantityCurrent}
        form={form}
        onCancel={() => setModalType(null)}
        onOk={async () => {
          if (!selectedArtifact) return;
          const values = await form.validateFields();
          try {
            await artifactApi.adjust(selectedArtifact._id, {
              newQuantity: values.newQuantity,
              reason: values.reason,
            });
            message.success("Điều chỉnh tồn thành công");
            setModalType(null);
            fetchData();
          } catch (err: any) {
            console.error(err);
            message.error(
              err?.response?.data?.message || "Điều chỉnh thất bại"
            );
          }
        }}
      />

      <HistoryModal
        open={historyOpen}
        loading={historyLoading}
        artifactName={selectedArtifact?.name}
        history={history}
        onClose={() => setHistoryOpen(false)}
      />

      <GoogleSearchModal
        open={googleOpen}
        query={`${selectedArtifact?.name ?? ""} ${
          selectedArtifact?.description ?? ""
        }`}
        loading={googleLoading}
        results={googleResults}
        onClose={() => setGoogleOpen(false)}
      />

      <ArtifactDetailModal
        open={detailOpen}
        artifactId={selectedArtifact?._id}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
};

export default ArtifactsPage;
