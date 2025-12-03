import React, { useState } from "react";
import { Image, Tooltip } from "antd";
import { PictureOutlined } from "@ant-design/icons";

type Props = {
  src?: string | null;
  alt?: string;
  size?: number;
  style?: React.CSSProperties;
  /** "cover" will fill and crop; "contain" will preserve whole image (no crop) */
  fit?: "cover" | "contain";
  fallbackSrc?: string;
};

const ImageCell: React.FC<Props> = ({
  src,
  alt,
  size = 80,
  style,
  fit = "contain",
 
}) => {
  const height = Math.round((size * 3) / 4);
  const [broken, setBroken] = useState(false);

  const wrapperStyle: React.CSSProperties = {
    width: size,
    height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    overflow: "hidden",
    background: "#f5f5f5",
    boxShadow: src && !broken ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
    border: src && !broken ? "1px solid rgba(0,0,0,0.06)" : "1px dashed rgba(0,0,0,0.06)",
    ...style,
  };

  // Khi ko có src hoặc load lỗi -> hiển thị icon placeholder
  if (!src || broken) {
    return (
      <div style={wrapperStyle} aria-label="No image">
        <Tooltip title={broken ? "Ảnh không thể tải" : "Chưa có ảnh"}>
          <PictureOutlined style={{ fontSize: Math.max(18, size / 3), color: "#999" }} />
        </Tooltip>
      </div>
    );
  }

  // Không truyền width/height trực tiếp; dùng maxWidth/maxHeight + objectFit
  return (
    <div style={wrapperStyle}>
      <Image
        src={src}
        alt={alt}
        preview={{ mask: <div style={{ color: "#fff" }}>Xem ảnh</div> }}
        placeholder={<div style={{ width: size, height, background: "#eee" }} />}
        loading="lazy"
        onError={() => setBroken(true)}
        // style kiểm soát cách image scale giữ tỉ lệ
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: fit, // 'contain' sẽ tránh crop/méo; 'cover' sẽ crop để lấp đầy
          display: "block",
          borderRadius: 6,
        }}
      />
    </div>
  );
};

export default ImageCell;
