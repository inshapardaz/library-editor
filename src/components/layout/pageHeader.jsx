//import { useTranslation } from "react-i18next";

// 3rd party imports
import { /* Breadcrumb,*/ Col, Row, Space, Typography } from "antd";
//import { FaHome } from 'react-icons/fa';

// Local Imports
import styles from "../../styles/common.module.scss";

// ----------------------------------------------------

function PageHeader({ title, subTitle, icon, actions }) {
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
        <div className={styles.header}>
            <Row align="middle" gutter={8} style={{ flex: "1" }}>
                <Col>{icon}</Col>
                <Col flex="1">
                    <Space>
                        <Typography.Title level={2}>{title}</Typography.Title>
                        {subTitle}
                    </Space>
                </Col>
                {actionColumns}
                {/* <Col>
        <Breadcrumb>
            <Breadcrumb.Item href="/">
            <FaHome />
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('libraries.title')}</Breadcrumb.Item>
        </Breadcrumb>
      </Col> */}
            </Row>
        </div>
    );
}

export default PageHeader;
