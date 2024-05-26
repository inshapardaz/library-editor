import React from 'react';

// 3rd party imports
import { Col, Row, Space, Typography } from "antd";
1
// Local Imports
import "./styles.scss";

// ----------------------------------------------------

const PageHeader = ({ title, subTitle, breadcrumb, icon, actions }) => {
    //const { t } = useTranslation();

    let actionColumns = [];
    if (actions != null) {
        if (Array.isArray(actions)) {
            actionColumns = actions.map((a, index) => (
                <Col key={`header-action-${index}`}>{a}</Col>
            ));
        } else {
            actionColumns.push(<Col key="action">{actions}</Col>);
        }
    }

    return (
        <div className="header">
            <Row align="middle" gutter={8} style={{ flex: "1" }}>
                <Col>{icon}</Col>
                <Col flex="1">
                    <Space>
                        <Typography.Title level={2}>{title}</Typography.Title>
                        {subTitle}
                        {breadcrumb}
                    </Space>
                </Col>
                {actionColumns}
            </Row>
        </div>
    );
}

export default PageHeader;
