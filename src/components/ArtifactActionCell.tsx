import React, { useState } from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SearchOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import type { Artifact } from "../types";

type Props = {
  record: Artifact;
  hasPermission: (p: string) => boolean;
  onOpenModal: (
    type: "edit" | "import" | "export" | "adjust",
    record: Artifact
  ) => void;
  onOpenHistory: (record: Artifact) => void;
  onOpenGoogle: (record: Artifact) => void;
  onOpenDetail: (record: Artifact) => void;
  onDeleteArtifact: (record: Artifact) => void;
};

// Design system colors
const COLORS = {
  primary: "#2C3E50",
  secondary: "#34495E",
  accent: "#E74C3C",
  success: "#27AE60",
  warning: "#F39C12",
  background: "#F8FAFC",
  border: "#D5DBDB",
  text: "#2C3E50",
  textSecondary: "#7F8C8D",
  blueLight: "#E3F2FD",
  greenLight: "#E8F5E9",
  redLight: "#FFEBEE",
  orangeLight: "#FFF3E0",
  purpleLight: "#F9F0FF",
  cyanLight: "#E6FFFB",
};

const ArtifactActionCell: React.FC<Props> = ({
  record,
  hasPermission,
  onOpenModal,
  onOpenHistory,
  onOpenGoogle,
  onOpenDetail,
  onDeleteArtifact,
}) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const items: MenuProps["items"] = [
    hasPermission("EDIT_ARTIFACT") && {
      key: "edit",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(24, 144, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <EditOutlined style={{ color: "#1890ff", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Chỉnh sửa thông tin
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Cập nhật thông tin hiện vật
            </div>
          </div>
        </div>
      ),
    },
    hasPermission("DELETE_ARTIFACT") && {
      key: "delete",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(245, 34, 45, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <DeleteOutlined style={{ color: "#f5222d", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#f5222d",
                lineHeight: 1.2,
              }}
            >
              Xóa hiện vật
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Xóa vĩnh viễn khỏi hệ thống
            </div>
          </div>
        </div>
      ),
      danger: true,
    },
    (hasPermission("EDIT_ARTIFACT") || hasPermission("DELETE_ARTIFACT")) && {
      type: "divider",
      style: {
        margin: "6px 0",
        borderColor: COLORS.border,
      },
    },
    hasPermission("IMPORT_ARTIFACT") && {
      key: "import",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(82, 196, 26, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <DownloadOutlined style={{ color: "#52c41a", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Nhập kho
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Thêm số lượng vào kho
            </div>
          </div>
        </div>
      ),
    },
    hasPermission("EXPORT_ARTIFACT") && {
      key: "export",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(250, 173, 20, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <UploadOutlined style={{ color: "#faad14", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Xuất kho
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Giảm số lượng từ kho
            </div>
          </div>
        </div>
      ),
    },
    hasPermission("ADJUST_ARTIFACT") && {
      key: "adjust",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(114, 46, 209, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SlidersOutlined style={{ color: "#722ed1", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Điều chỉnh tồn
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Điều chỉnh số lượng tồn kho
            </div>
          </div>
        </div>
      ),
    },
    (hasPermission("IMPORT_ARTIFACT") ||
      hasPermission("EXPORT_ARTIFACT") ||
      hasPermission("ADJUST_ARTIFACT")) && {
      type: "divider",
      style: {
        margin: "6px 0",
        borderColor: COLORS.border,
      },
    },
    hasPermission("VIEW_ARTIFACT_TRANSACTIONS") && {
      key: "history",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(22, 119, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HistoryOutlined style={{ color: "#1677ff", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Lịch sử giao dịch
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Xem nhật ký nhập / xuất kho
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "google",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(24, 144, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SearchOutlined style={{ color: "#1890ff", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Tìm kiếm Google
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Tìm thông tin liên quan
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "detail",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(47, 84, 235, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <InfoCircleOutlined style={{ color: "#2f54eb", fontSize: 14 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                lineHeight: 1.2,
              }}
            >
              Xem chi tiết
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              Xem đầy đủ thông tin hiện vật
            </div>
          </div>
        </div>
      ),
    },
  ].filter(Boolean) as MenuProps["items"];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    setOpen(false);
    if (key === "edit") onOpenModal("edit", record);
    if (key === "delete") onDeleteArtifact(record);
    if (key === "import") onOpenModal("import", record);
    if (key === "export") onOpenModal("export", record);
    if (key === "adjust") onOpenModal("adjust", record);
    if (key === "history") onOpenHistory(record);
    if (key === "google") onOpenGoogle(record);
    if (key === "detail") onOpenDetail(record);
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      menu={{
        items,
        onClick,
        style: {
          borderRadius: 12,
          padding: "12px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          border: `1px solid ${COLORS.border}`,
          minWidth: 280,
          background: "white",
        },
      }}
      trigger={["click"]}
      placement="bottomRight"
      overlayStyle={{ minWidth: 320 }}
    >
      <Button
        type="text"
        shape="circle"
        style={{
          width: 40,
          height: 40,
          background: open
            ? "rgba(24, 144, 255, 0.08)"
            : isHovered
            ? "rgba(0, 0, 0, 0.04)"
            : "transparent",
          border: open
            ? "1px solid rgba(24, 144, 255, 0.3)"
            : "1px solid transparent",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: open ? "#1890ff" : COLORS.textSecondary,
          transition: "all 0.2s ease",
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ position: "relative" }}>
          <EllipsisOutlined
            style={{
              fontSize: 18,
              fontWeight: open ? "bold" : "normal",
              transform: open ? "scale(1.1)" : "scale(1)",
              transition: "all 0.2s ease",
            }}
          />

          {/* Status indicator dot */}
        </div>

        {/* Hover effect circle */}
        {isHovered && !open && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.03)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        )}
      </Button>
    </Dropdown>
  );
};

// Thêm CSS animation
const styles = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 0.4; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  
  .ant-dropdown-menu-item:hover {
    background: ${COLORS.background} !important;
    border-radius: 8px;
  }
  
  .ant-dropdown-menu-item-divider {
    background-color: ${COLORS.border} !important;
  }
`;

// Thêm styles vào document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ArtifactActionCell;
