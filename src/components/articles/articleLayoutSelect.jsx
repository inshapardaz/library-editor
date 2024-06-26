import React from 'react';

// 3rd party libraries
import { Select, Space } from "antd";

// Local Imports
import { FaAlignJustify, PiTextColumnsBold, PiFileTextLight } from "/src/icons";
// ------------------------------------------------------
const { Option } = Select;
// ------------------------------------------------------

const layouts = [{
    "key": "normal",
    "value": "normal",
    "icon": <PiFileTextLight />
}, {
    "key": "singleColumnPoetry",
    "value": "singleColumnPoetry",
    "icon": <FaAlignJustify />
}, {
    "key": "twoColumnPoetry",
    "value": "twoColumnPoetry",
    "icon": <PiTextColumnsBold />
}]

const ArticleLayoutSelect = ({ value, onChange, placeholder, t, disabled = false, style = null }) => {
    return (<Select placeholder={placeholder}
        defaultValue={value}
        onChange={val => onChange(val)}
        style={style}
        disabled={disabled}>
        {layouts.map(item => (
            <Option key={item.key} value={item.value}  >
                <Space>
                    {item.icon}
                    {t(`layouts.${item.key}.label`)}
                </Space>
            </Option>
        ))}
    </Select>);

};

export default ArticleLayoutSelect;
