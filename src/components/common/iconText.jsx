import React from 'react';

// 3rd party
import { Space } from 'antd';

// ------------------------------------------------
export function IconText({ icon, text, onClick = () => {} }) {
  return (
    <Space onClick={onClick} style={{ cursor : 'pointer' }}>
      {React.createElement(icon)}
      {text}
    </Space>
  );
}
