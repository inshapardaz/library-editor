import { Select } from "antd";
import { FaAlignJustify } from "react-icons/fa";
import { PiTextColumnsBold, PiFileTextLight } from "react-icons/pi";

const { Option } = Select;

const layouts = [{
    "key": "normal",
    "value": "normal",
    "icon": <PiFileTextLight />
}, {
    "key" : "singleColumnPoetry",
    "value" : "singleColumnPoetry",
    "icon": <FaAlignJustify />
}, {
    "key": "twoColumnPoetry",
    "value": "twoColumnPoetry",
    "icon": <PiTextColumnsBold />
}
]
const ArticleLayoutSelect = ({ value, onChange, placeholder, t, disabled = false, style = null }) => {
    return (<Select placeholder={placeholder}
        defaultValue={value}
        onChange={val => onChange(val)}
        style={style}
        disabled={disabled}>
            {layouts.map(item => (
            <Option key={item.key} value={item.value} >
              <div>
                {item.icon}
                {t(`layouts.${item.key}.label`)}
              </div>
            </Option>
          ))}
        </Select>);

}

export default ArticleLayoutSelect;
