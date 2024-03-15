import { Menu } from "antd";

// -----------------------------------------
// Local Imports
import { getFonts } from '../../i18n';

// -----------------------------------------

const FontList = ({ selectedFont, t, language, onChanged }) => {

    const fonts = getFonts(t, language).map(f => ({ key: f.value, label: t(`fonts.${f.label}`) }))

    const onClick = ({ key }) => onChanged(key)
    return (<Menu mode="inline" items={fonts} selectedKeys={selectedFont} onClick={onClick} />)
}

export default FontList;
