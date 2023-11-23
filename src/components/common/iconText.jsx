import React from 'react';

// 3rd party
import { Space, Typography } from 'antd';

// ------------------------------------------------
export function IconText({ icon, text, secondaryText = null, link = true ,onClick = () => {} }) {
  return (
    <Space onClick={onClick} style={{ cursor : link ? 'pointer' : 'default' }}>
      {React.createElement(icon)}
      {text}
      {secondaryText && <Typography.Text type="secondary">{secondaryText}</Typography.Text>}
    </Space>
  );
}
