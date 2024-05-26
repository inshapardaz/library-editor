import React from 'react';

// 3rd party libraries
import { Select } from 'antd';

// local imports
import { languages } from '/src/store/slices/uiSlice';

// -------------------------------------------------

const languageOptions = Object.values(languages)
    .map(l => ({ key: l.key, label: l.name }));
// ----------------------------------------------

const LanguageSelect = ({ value, onChange, placeholder, disabled = false, style = null }) => {
    return (<Select placeholder={placeholder}
        defaultValue={value}
        onChange={val => onChange(val)}
        style={style}
        disabled={disabled} >
        {languageOptions.map(item => <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}
    </Select>)
};

export default LanguageSelect;
