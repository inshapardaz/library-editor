import React from 'react';

// 3rd party libraries
import { Button, Result } from "antd";

// ---------------------------------

const Error = ({ t, onCommand }) => {
  return (<Result
    status="warning"
    title="There are some problems with your operation."
    extra={
      <Button type="primary" key="console" onClick={onCommand}>
        {t('actions.retry')}
      </Button>
    }
  />)
}

export default Error;
