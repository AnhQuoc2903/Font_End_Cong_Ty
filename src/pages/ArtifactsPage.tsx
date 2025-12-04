/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Modal,
  Space,
  Table,
  Form,
  message,
  List,
  Tooltip,
  Dropdown,
  type MenuProps,
  Tag,
  Spin,
  Card,
  Popconfirm,
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SearchOutlined,
  PictureOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { artifactApi } from "../api/artifactApi";
import { aiApi } from "../api/aiApi"; // <-- import default
import { useAuth } from "../context/AuthContext";
import ArtifactFilterBar from "../components/ArtifactFilterBar";
import ImageCell from "../components/ImageCell";
import ArtifactFormModal from "../components/ArtifactFormModal";
import StockModal from "../components/StockModal";
import AdjustStockModal from "../components/AdjustStockModal";
import HistoryModal from "../components/HistoryModal";

export type Artifact = {
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

type VisionAnalysis = {
  labels: string[];
  entities: string[]; // web entities
  similarImages: string[];
  pages: { url?: string; title?: string }[];
  texts: string[];
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
  // state
  const [data, setData] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Vision modal
  const [visionOpen, setVisionOpen] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState<VisionAnalysis | null>(null);
  const [visionImageUrl, setVisionImageUrl] = useState<string | null>(null);

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

  const onSelectGoogleImage = async (imageUrl: string) => {
    setVisionImageUrl(imageUrl);
    setVisionOpen(true);
    setVisionLoading(true);
    setVisionResult(null);
    try {
      const res = await aiApi.analyzeImage(imageUrl);
      setVisionResult(res.data || null);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi phân tích ảnh");
      setVisionResult(null);
    } finally {
      setVisionLoading(false);
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

  // filter data
  const filteredData = useMemo(() => {
    if (!searchText && !statusFilter) return data;
    const text = removeVietnameseTones(searchText.trim());
    return data.filter((item) => {
      const combined = removeVietnameseTones(
        `${item.code} ${item.name} ${item.description || ""} ${
          item.location || ""
        } ${item.category?.name || ""}`
      );
      if (text && !combined.includes(text)) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      return true;
    });
  }, [data, searchText, statusFilter]);

  // columns
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
        width: 220,
        render: (_: any, record: Artifact) => {
          const items: MenuProps["items"] = [
            hasPermission("IMPORT_ARTIFACT")
              ? { key: "import", label: "Nhập kho" }
              : null,
            hasPermission("EXPORT_ARTIFACT")
              ? { key: "export", label: "Xuất kho" }
              : null,
            hasPermission("ADJUST_ARTIFACT")
              ? { key: "adjust", label: "Điều chỉnh tồn" }
              : null,
          ].filter(Boolean) as MenuProps["items"];

          const onMenuClick: MenuProps["onClick"] = ({ key }) => {
            if (key === "import") openModal("import", record);
            if (key === "export") openModal("export", record);
            if (key === "adjust") openModal("adjust", record);
          };

          return (
            <Space
              size="small"
              align="center"
              style={{ display: "flex", minWidth: 180 }}
            >
              {hasPermission("EDIT_ARTIFACT") && (
                <Tooltip title="Chỉnh sửa">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => openModal("edit", record)}
                  />
                </Tooltip>
              )}

              {hasPermission("DELETE_ARTIFACT") && (
                <Popconfirm
                  title={`Xóa hiện vật "${record.name}"?`}
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={async () => {
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
                  }}
                >
                  <Tooltip title="Xóa">
                    <Button icon={<DeleteOutlined />} size="small" danger />
                  </Tooltip>
                </Popconfirm>
              )}

              <Tooltip title="Tìm hình ảnh & thông tin trên Google">
                <Button
                  icon={<SearchOutlined />}
                  size="small"
                  onClick={() => openGoogleFor(record)}
                />
              </Tooltip>

              {hasPermission("VIEW_ARTIFACT_TRANSACTIONS") && (
                <Tooltip title="Lịch sử">
                  <Button
                    icon={<HistoryOutlined />}
                    size="small"
                    onClick={() => openHistory(record)}
                  />
                </Tooltip>
              )}

              <Dropdown
                menu={{ items, onClick: onMenuClick }}
                trigger={["click"]}
              >
                <Button size="small" icon={<EllipsisOutlined />} />
              </Dropdown>
            </Space>
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
        scroll={{ x: 1200 }} // cho table ngang khi nhiều column
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

      <Modal
        open={googleOpen}
        onCancel={() => setGoogleOpen(false)}
        footer={null}
        title={`Kết quả Google cho: ${selectedArtifact?.name}`}
        width={920}
      >
        {googleLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        ) : googleResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            Không có kết quả
          </div>
        ) : (
          <List
            grid={{ gutter: 12, column: 3 }}
            dataSource={googleResults}
            renderItem={(item) => (
              <List.Item style={{ cursor: "pointer" }}>
                <Card
                  hoverable
                  onClick={() => onSelectGoogleImage(item.imageUrl)}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 150,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fafafa",
                    }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <PictureOutlined
                        style={{ fontSize: 40, color: "#ccc" }}
                      />
                    )}
                  </div>
                  <Card.Meta
                    title={
                      <a
                        href={item.contextLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shorten(item.title, 80)}
                      </a>
                    }
                    description={shorten(
                      item.snippet || item.contextLink || "",
                      120
                    )}
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Modal>

      <Modal
        open={visionOpen}
        onCancel={() => setVisionOpen(false)}
        footer={null}
        title="Cloudinary AI – Phân tích hình ảnh"
        width={900}
      >
        {visionLoading ? (
          <Spin
            style={{ display: "block", textAlign: "center", padding: 40 }}
          />
        ) : visionResult ? (
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ minWidth: 360 }}>
              <Image src={visionImageUrl!} width={360} />
            </div>

            <div style={{ flex: 1 }}>
              <h3>🏷 Nhãn AI (Tags)</h3>
              {visionResult.labels.length
                ? visionResult.labels.map((t) => <Tag key={t}>{t}</Tag>)
                : "Không có nhãn"}

              <h3 style={{ marginTop: 16 }}>📝 OCR – Text nhận dạng</h3>
              {visionResult.texts.length ? (
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {visionResult.texts.join("\n")}
                </pre>
              ) : (
                "Không phát hiện văn bản"
              )}

              <h3 style={{ marginTop: 16 }}>🖼 Ảnh tương tự</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {visionResult.similarImages.map((img) => (
                  <Image key={img} src={img} width={120} height={90} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          "Không có dữ liệu"
        )}
      </Modal>
    </>
  );
};

export default ArtifactsPage;
