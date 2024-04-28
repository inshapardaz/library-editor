// 3rd party libraries
import { Select } from 'antd';

// -------------------------------------------------

const CopyrightSelect = ({ t, value, onChange, placeholder }) => {
    return (<Select placeholder={placeholder}
        defaultValue={value}
        onChange={val => onChange(val)} >
        <Select.Option value="Unknown">{t('copyrights.Unknown')}</Select.Option>
        <Select.Option value="Copyright">{t('copyrights.Copyright')}</Select.Option>
        <Select.Option value="PublicDomain">{t('copyrights.PublicDomain')}</Select.Option>
        <Select.Option value="Open">{t('copyrights.Open')}</Select.Option>
        <Select.Option value="CreativeCommons">{t('copyrights.CreativeCommons')}</Select.Option>
    </Select>);
};

export default CopyrightSelect;
