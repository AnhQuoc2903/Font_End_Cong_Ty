import { useState } from "react";
import {
  Avatar,
  Upload,
  message,
  Popconfirm,
  theme,
  Button,
  Typography,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const { Text } = Typography;

const { useToken } = theme;

interface ProfileAvatarProps {
  avatar?: string;
  onChange: (url?: string) => void;
}

export function ProfileAvatar({ avatar, onChange }: ProfileAvatarProps) {
  const { updateUser } = useAuth();
  const { token } = useToken();
  const [uploading, setUploading] = useState(false);

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: async (file) => {
      // Kiểm tra kích thước file
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Ảnh phải nhỏ hơn 5MB!");
        return false;
      }

      // Kiểm tra định dạng
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return false;
      }

      setUploading(true);
      try {
        const res = await userApi.uploadAvatar(file);
        message.success({
          content: "Cập nhật ảnh đại diện thành công",
          style: {
            marginTop: 50,
          },
        });
        onChange(res.data.avatar);
        updateUser({ avatar: res.data.avatar });
      } catch {
        message.error("Upload ảnh thất bại");
      } finally {
        setUploading(false);
      }
      return false;
    },
  };

  const handleDelete = async () => {
    try {
      await userApi.deleteAvatar();
      message.success("Đã xóa ảnh đại diện");
      onChange(undefined);
      updateUser({ avatar: undefined });
    } catch {
      message.error("Xóa ảnh thất bại");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: 24,
        }}
      >
        <Avatar
          size={140}
          src={avatar}
          icon={<UserOutlined style={{ fontSize: 60 }} />}
          style={{
            border: `4px solid ${token.colorBgContainer}`,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        />

        <Upload {...uploadProps}>
          <div
            className="profile-avatar-camera"
            style={{
              backgroundColor: token.colorPrimary,
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.4)",
            }}
          >
            <CameraOutlined
              style={{
                color: "#fff",
                fontSize: 18,
              }}
            />
          </div>
        </Upload>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <Upload {...uploadProps}>
          <Button
            type="default"
            size="small"
            loading={uploading}
            icon={<UploadOutlined />}
            style={{
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            Đổi ảnh
          </Button>
        </Upload>

        {avatar && (
          <Popconfirm
            title="Xóa ảnh đại diện?"
            description="Bạn có chắc chắn muốn xóa ảnh đại diện không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={handleDelete}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{
                borderRadius: 6,
                fontWeight: 500,
              }}
            >
              Xóa
            </Button>
          </Popconfirm>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          JPG, PNG tối đa 5MB
        </Text>
      </div>
    </div>
  );
}
