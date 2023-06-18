import React from 'react';
import { Space } from 'antd';

// ------------------------------------------------
export function IconText({ icon, text }) {
  return (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
}
