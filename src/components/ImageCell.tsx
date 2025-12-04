import React from "react";
import { Image, Tooltip } from "antd";

type Props = {
  src?: string | null;
  alt?: string;
  size?: number; // square size px
  title?: string;
};

const ImageCell: React.FC<Props> = ({ src, alt, size = 96, title }) => {
  const placeholderStyle: React.CSSProperties = {
    width: size,
    height: size * 0.66,
    background: "#f5f7fa",
    borderRadius: 6,
    display: "flex",
  justifyContent: "center",   
  alignItems: "center",
    color: "#999",
    fontSize: 12,
    border: "1px solid #f0f0f0",
  };

  if (!src) {
    return <div style={placeholderStyle}>Chưa có ảnh</div>;
  }

  return (
    <Tooltip title={title || alt}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={Math.round(size * 0.66)}
        style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #f0f0f0" }}
        preview={{ src }}
      />
    </Tooltip>
  );
};

export default ImageCell;