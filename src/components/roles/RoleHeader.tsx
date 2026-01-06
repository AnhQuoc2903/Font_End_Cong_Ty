import React from 'react';
import { Row, Col, Space, Typography, Badge, Avatar } from 'antd';
import { KeyOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RoleHeaderProps {
  title: string;
  description: string;
  totalRoles: number;
}

const RoleHeader: React.FC<RoleHeaderProps> = ({
  title,
  description,
  totalRoles,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px 32px',
        color: 'white',
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Space direction="vertical" size={2}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              <KeyOutlined /> {title}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{description}</Text>
          </Space>
        </Col>
        <Col>
          <Badge
            count={totalRoles}
            showZero
            color="white"
            style={{ color: '#667eea' }}
          >
            <Avatar
              shape="square"
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
              }}
              icon={<TeamOutlined />}
              size="large"
            />
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

export default RoleHeader;