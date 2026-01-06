/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal, Form, message, Card, Space, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import { artifactApi } from "../../api/artifactApi";
import { aiApi } from "../../api/aiApi";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";

import ArtifactFormModal from "../../components/artifact/ArtifactFormModal";
import StockModal from "../../components/artifact/StockModal";
import AdjustStockModal from "../../components/artifact/AdjustStockModal";
import HistoryModal from "../../components/artifact/HistoryModal";
import ArtifactDetailModal from "../../components/artifact/ArtifactDetailModal";
import GoogleSearchModal from "../../components/artifact//GoogleSearchModal";
import { ArtifactStatsCards } from "../../components/artifact/ArtifactStatsCards";
import SearchFilterBar from "../../components/artifact/ArtifactFilterBar";
import { ArtifactTable } from "../../components/artifact/ArtifactTable";
import type {
  Artifact,
  GoogleResult,
  ArtifactTransaction,
} from "../../components/artifact/types";
import { socket } from "../../socket";

const { Title, Text } = Typography;

const COLORS = {
  primary: "#1890ff",
  background: "#fafafa",
  cardBg: "#ffffff",
  border: "#f0f0f0",
  text: "#262626",
  textSecondary: "#8c8c8c",
};

const ArtifactsPage: React.FC = () => {
  const [data, setData] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

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

  // pagination sync with URL
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const handleTableChange = (pagination: any) => {
    setSearchParams({ page: pagination.current.toString() });
  };

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
    const reload = () => {
      fetchData();
    };

    // load lần đầu
    fetchData();

    // nghe thay đổi chung (create / edit / delete)
    socket.on("artifact:changed", reload);

    // 🔥 nghe thay đổi ảnh
    socket.on("artifact:image:changed", reload);

    return () => {
      socket.off("artifact:changed", reload);
      socket.off("artifact:image:changed", reload);
    };
  }, []);

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

  const handleDeleteArtifact = (record: Artifact) => {
    Modal.confirm({
      title: `Xóa hiện vật "${record.name}"?`,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      icon: <DeleteOutlined />,
      centered: true,
      onOk: async () => {
        try {
          await artifactApi.remove(record._id);
          message.success("Đã xóa hiện vật");
          fetchData();
        } catch (err: any) {
          console.error(err);
          message.error(err?.response?.data?.message || "Xóa thất bại");
        }
      },
    });
  };

  const handleExportExcel = async () => {
    try {
      const res = await artifactApi.exportExcel();

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `danh-sach-hien-vat-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      message.error("Xuất Excel thất bại");
    }
  };

  // Summary stats
  const summaryStats = useMemo(() => {
    const total = data.length;

    const newItems = data.filter((item) => item.status === "bosung").length;

    const inStock = data.filter(
      (item) => item.status === "con" && item.quantityCurrent > 0
    ).length;

    const outOfStock = data.filter((item) => item.status === "ban").length;

    return { total, inStock, outOfStock, newItems };
  }, [data]);

  return (
    <div
      style={{ padding: 24, background: COLORS.background, minHeight: "100vh" }}
    >
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0, color: COLORS.text }}>
              Quản lý hiện vật
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Tổng cộng {summaryStats.total} hiện vật trong hệ thống
            </Text>
          </div>

          <Space>
            <Button
              onClick={handleExportExcel}
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 8,
              }}
            >
              Xuất Excel
            </Button>
            {hasPermission("CREATE_ARTIFACT") && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal("create")}
                style={{
                   background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: 8,
                    height: 40,
                    padding: "0 20px",
                    fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                }}
              >
                Thêm hiện vật
              </Button>
            )}
          </Space>
        </div>

        {/* Stats Cards */}
        <ArtifactStatsCards stats={summaryStats} />

        {/* Search and Filter Bar */}
        <SearchFilterBar
          searchText={searchText}
          onSearchChange={onSearchTextChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          filterVisible={filterVisible}
          onToggleFilter={() => setFilterVisible(!filterVisible)}
        />

        {/* Table */}
        <Card
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <ArtifactTable
            data={filteredData}
            loading={loading}
            page={page}
            hasPermission={hasPermission}
            onTableChange={handleTableChange}
            onOpenModal={openModal}
            onOpenHistory={openHistory}
            onOpenGoogle={openGoogleFor}
            onOpenDetail={(record) => {
              setSelectedArtifact(record);
              setDetailOpen(true);
            }}
            onDeleteArtifact={handleDeleteArtifact}
          />
        </Card>
      </Card>

      {/* Modals */}
      <ArtifactFormModal
        open={modalType === "create" || modalType === "edit"}
        mode={modalType === "create" ? "create" : "edit"}
        artifact={selectedArtifact}
        onClose={() => setModalType(null)}
        onSuccess={(updated) => {
          if (!updated?._id) return;

          setData((prev) =>
            prev.map((item) =>
              item._id === updated._id
                ? { ...item, ...updated } 
                : item
            )
          );

          setModalType(null);
        }}
      />

      <StockModal
        open={modalType === "import" || modalType === "export"}
        mode={modalType === "import" ? "import" : "export"}
        artifactName={selectedArtifact?.name}
        currentQuantity={selectedArtifact?.quantityCurrent ?? 0}
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

      {/* Global Styles */}
      <style>{`
        .artifact-row:hover {
          background: rgba(24, 144, 255, 0.02) !important;
        }
        
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          border-bottom: 2px solid #f0f0f0 !important;
          font-weight: 600 !important;
          color: #262626 !important;
          padding: 16px 12px !important;
        }
        
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0 !important;
          padding: 16px 12px !important;
        }
        
        .ant-table-wrapper .ant-table {
          border-radius: 8px;
        }
        
        .ant-table-wrapper .ant-table-container {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default ArtifactsPage;
