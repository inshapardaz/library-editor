import React from 'react';

// 3rd party libraries
import { theme } from "antd";

// Local imports
import './styles.scss'

// -----------------------------------------

const ContentsContainer = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadius },
    } = theme.useToken();

    return (<div
        className="container"
        style={{
            background: colorBgContainer,
            borderRadius: borderRadius
        }}>
        {children}
    </div>);
}

export default ContentsContainer;
