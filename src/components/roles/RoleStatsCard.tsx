import React from 'react';
import { Card} from 'antd';


interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon?: React.ReactNode;
}

const RoleStatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  color,
  backgroundColor,
  borderColor,
  icon,
}) => {
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        background: backgroundColor,
        border: `1px solid ${borderColor}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      bodyStyle={{ padding: '16px 20px' }}
      hoverable
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 16px rgba(${color}, 0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
          }}
        >
          {icon || value}
        </div>
        <div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>
            {title}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: color }}>
            {value} <span style={{ fontSize: 14, color: '#999' }}>{unit}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoleStatsCard;