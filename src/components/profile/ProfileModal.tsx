import { Modal, ConfigProvider } from "antd";
import {
  CloseOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ProfilePage from "../../pages/profile/ProfilePage";
import "./Profile.css";


export default function ProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const vibrantColors = {
    primary: "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    gradientStart: "#8b5cf6",
    gradientEnd: "#3b82f6",
    gold: "#fbbf24",
    purple: "#a855f7",
  };



  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusLG: 20,
          colorPrimary: vibrantColors.primary,
        },
        components: {
          Modal: {
            paddingContentHorizontal: 0,
            borderRadiusLG: 20,
            boxShadow: `0 20px 60px ${vibrantColors.primary}30`,
          },
        },
      }}
    >
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={1450}
        destroyOnClose
        closeIcon={
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${vibrantColors.error}10, ${vibrantColors.warning}10)`,
              border: `2px solid ${vibrantColors.error}30`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
            className="modal-close-btn"
          >
            <CloseOutlined
              style={{
                fontSize: 16,
                color: vibrantColors.error,
                transition: "all 0.3s",
              }}
            />
          </div>
        }
        centered
        className="profile-modal"
        maskStyle={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        modalRender={(node) => (
          <div
            style={{
              boxShadow: `0 30px 80px ${vibrantColors.primary}40`,
              borderRadius: 24,
              overflow: "hidden",
              border: `2px solid ${vibrantColors.primary}30`,
            }}
          >
            {node}
          </div>
        )}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "8px 0",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 52,
                height: 52,
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${vibrantColors.primary}50`,
              }}
            >
              <UserOutlined
                style={{
                  fontSize: 26,
                  color: "white",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    background: `linear-gradient(135deg, ${vibrantColors.gradientStart}, ${vibrantColors.gradientEnd})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: `0 2px 10px ${vibrantColors.primary}40`,
                  }}
                >
                  Thông tin cá nhân
                </span>
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: `linear-gradient(135deg, ${vibrantColors.success}20, ${vibrantColors.info}20)`,
                    border: `1px solid ${vibrantColors.success}50`,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <SettingOutlined
                    style={{
                      fontSize: 12,
                      color: vibrantColors.success,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: vibrantColors.success,
                      letterSpacing: "0.3px",
                    }}
                  >
                    PERSONAL PROFILE
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: vibrantColors.primary,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${vibrantColors.success}, ${vibrantColors.info})`,
                    animation: "pulse 2s infinite",
                  }}
                />
                Quản lý và cập nhật thông tin tài khoản của bạn
              </div>
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${vibrantColors.primary}15, ${vibrantColors.info}15)`,
                border: `1px solid ${vibrantColors.primary}40`,
                minWidth: 120,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: vibrantColors.primary,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 2,
                  opacity: 0.8,
                }}
              >
                Trạng thái
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: vibrantColors.success,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: vibrantColors.success,
                    animation: "pulse 1.5s infinite",
                  }}
                />
                Đang hoạt động
              </div>
            </div>
          </div>
        }
        styles={{
          header: {
            padding: "28px 32px 20px",
            borderBottom: `2px solid ${vibrantColors.primary}20`,
            marginBottom: 0,
            background: `linear-gradient(135deg, ${vibrantColors.primary}08, ${vibrantColors.info}08)`,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: "relative",
            overflow: "hidden",
          },
          body: {
            padding: 0,
            background: `linear-gradient(135deg, ${vibrantColors.primary}03, ${vibrantColors.info}03)`,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
        }}
      >
        <div className="profile-modal-body">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${vibrantColors.primary}15 0%, transparent 70%)`,
                transform: "translate(30%, -30%)",
                pointerEvents: "none",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${vibrantColors.info}15 0%, transparent 70%)`,
                transform: "translate(-30%, 30%)",
                pointerEvents: "none",
                opacity: 0.6,
              }}
            />
            <ProfilePage />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
