// src/components/GoogleSearchModal.tsx
import React from "react";
import { Modal, List, Card, Spin, Empty } from "antd";
import type { GoogleResult } from "../api/aiApi";
import { PictureOutlined } from "@ant-design/icons";

type Props = {
  open: boolean;
  query: string;
  loading: boolean;
  results: GoogleResult[];
  onClose: () => void;
};

const GoogleSearchModal: React.FC<Props> = ({
  open,
  query,
  loading,
  results,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      title={`Kết quả tìm kiếm: "${query}"`}
      onCancel={onClose}
      footer={null}
      width={900}
      bodyStyle={{ padding: 12 }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin tip="Đang tìm..." />
        </div>
      ) : results.length === 0 ? (
        <Empty description="Không tìm thấy kết quả" />
      ) : (
        <List
          grid={{ gutter: 12, column: 3 }}
          dataSource={results}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <a
                    href={item.contextLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "block" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: 160,
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
                        <PictureOutlined style={{ fontSize: 40, color: "#ccc" }} />
                      )}
                    </div>
                  </a>
                }
              >
                <Card.Meta
                  title={
                    <a
                      href={item.contextLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                  }
                  description={
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {item.snippet || item.contextLink}
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default GoogleSearchModal;