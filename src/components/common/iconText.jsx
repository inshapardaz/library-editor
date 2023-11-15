import React from 'react';

// 3rd party
import { Space } from 'antd';

// ------------------------------------------------
export function IconText({ icon, text, link = true ,onClick = () => {} }) {
  return (
    <Space onClick={onClick} style={{ cursor : link ? 'pointer' : 'default' }}>
      {React.createElement(icon)}
      {text}
    </Space>
  );
}
