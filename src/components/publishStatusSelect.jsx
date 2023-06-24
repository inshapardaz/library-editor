import React from 'react';

// 3rd party libraries
import { Select } from 'antd';

// -------------------------------------------------

const PublishStatusSelect = ({ t, value, onChange, placeholder }) => {
    return (<Select placeholder={placeholder}
                defaultValue={value}
                onChange={val => onChange(val)} >
        <Select.Option value="Published">{ t('bookStatus.Published') }</Select.Option>
        <Select.Option value="AvailableForTyping">{ t('bookStatus.AvailableForTyping') }</Select.Option>
        <Select.Option value="BeingTyped">{ t('bookStatus.BeingTyped') }</Select.Option>
        <Select.Option value="ReadyForProofRead">{ t('bookStatus.ReadyForProofRead') }</Select.Option>
        <Select.Option value="ProofRead">{ t('bookStatus.ProofRead') }</Select.Option>
    </Select>);
};

export default PublishStatusSelect;
