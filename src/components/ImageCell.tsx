import React from "react";
import { Image, Tooltip } from "antd";

type Props = {
  src?: string | null;
  alt?: string;
  size?: number; // chiều rộng px
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
  const height = Math.round(size * 0.66);

  // Style chung cho container (có ảnh hoặc không)
  const containerClass = [
    "inline-flex items-center justify-center",
    "rounded-md border bg-white shadow-sm overflow-hidden",
    "hover:shadow-md transition-shadow duration-150",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!src) {
    // Placeholder khi chưa có ảnh
    return (
      <div
        className={[
          "flex items-center justify-center rounded-md border border-dashed",
          "border-gray-200 bg-gray-50 text-[11px] text-gray-400",
          "px-2",
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

  return (
    <Tooltip title={title || alt}>
      <div className={containerClass} style={{ width: size, height }}>
        <Image
          src={src}
          alt={alt}
          width={size}
          height={height}
          className="object-cover"
          // Đảm bảo Image không phá layout container
          rootClassName="!flex !w-full !h-full"
          preview={{ src }}
        />
      </div>
    </Tooltip>
  );
};

export default ImageCell;
