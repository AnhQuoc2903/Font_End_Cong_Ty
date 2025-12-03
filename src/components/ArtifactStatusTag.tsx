import React from "react";
import { Tag } from "antd";

type Props = {
  status?: string;
};

const ArtifactStatusTag: React.FC<Props> = ({ status }) => {
  switch (status) {
    case "con":
      return <Tag color="green">Còn hàng</Tag>;
    case "ban":
      return <Tag color="red">Đã bán / Hết</Tag>;
    case "bosung":
      return <Tag color="blue">Mới bổ sung</Tag>;
    default:
      return status ? <Tag>{status}</Tag> : null;
  }
};

export default ArtifactStatusTag;
