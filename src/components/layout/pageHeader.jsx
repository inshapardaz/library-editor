//import { useTranslation } from "react-i18next";

// 3rd party imports
import { /* Breadcrumb,*/  Col, Row, Typography } from 'antd';
//import { FaHome } from 'react-icons/fa';

// Local Imports
import styles from '../../styles/common.module.scss'

// ----------------------------------------------------

function PageHeader ({title, icon}) {
  //const { t } = useTranslation();

  return (<div  className={styles.header}>
    <Row align="middle" gutter={8}>
      <Col>{icon}</Col>
      <Col flex="1 1auto">
        <Typography.Title level={2}>{title}</Typography.Title>
      </Col>
      {/* <Col>
        <Breadcrumb>
            <Breadcrumb.Item href="/">
            <FaHome />
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('libraries.title')}</Breadcrumb.Item>
        </Breadcrumb>
      </Col> */}
    </Row>
  </div>);
}

export default PageHeader;
