import React from 'react';
import { useNavigate } from "react-router-dom";

// 3rd party
import { Space, Typography } from 'antd';

// ------------------------------------------------
const IconText = ({
    icon,
    text,
    secondaryText = null,
    href = null,
    onClick = () => { }
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (href) {
            navigate(href);
        } else {
            onClick();
        }
    }
    return (
        <Space onClick={handleClick} style={{ cursor: href ? 'pointer' : 'default' }}>
            {React.createElement(icon)}
            {text}
            {secondaryText && <Typography.Text type="secondary">{secondaryText}</Typography.Text>}
        </Space>
    );
};

export default IconText;
