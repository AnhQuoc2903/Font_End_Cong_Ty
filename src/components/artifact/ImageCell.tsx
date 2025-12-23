import React from "react";
import { Image, Tooltip } from "antd";

type Props = {
  src?: string | null;
  alt?: string;
  size?: number; // chiều rộng (px)
  title?: string;
  className?: string;
};

const ImageCell: React.FC<Props> = ({
  src,
  alt,
  size = 96,
  title,
  className,
}) => {
  // chiều cao theo tỉ lệ ảnh ngang (3:2)
  const height = Math.round(size * 0.66);

  // container chung
  const containerClass = [
    "inline-flex items-center justify-center",
    "rounded-md border bg-white shadow-sm overflow-hidden",
    "hover:shadow-md transition-shadow duration-150",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ❌ Không có ảnh → placeholder
  if (!src) {
    return (
      <div
        className={[
          "flex items-center justify-center rounded-md border border-dashed",
          "border-gray-200 bg-gray-50 text-[11px] text-gray-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width: size, height }}
      >
        Chưa có ảnh
      </div>
    );
  }

  // ✅ Có ảnh
  return (
    <Tooltip title={title || alt}>
      <div className={containerClass} style={{ width: size, height }}>
        <Image
          src={src}
          alt={alt}
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
          preview={{ src }}
          fallback="" // tránh vỡ layout nếu ảnh lỗi
        />
      </div>
    </Tooltip>
  );
};

export default ImageCell;
