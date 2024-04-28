// 3rd party libraries
import { Select } from 'antd';

// -------------------------------------------------

const EditingStatusSelect = ({ t, value, onChange, placeholder }) => {
    return (<Select placeholder={placeholder}
        value={value}
        onChange={val => onChange(val)} >
        <Select.Option value="Available">{t('editingStatus.Available')}</Select.Option>
        <Select.Option value="Typing">{t('editingStatus.Typing')}</Select.Option>
        <Select.Option value="Typed">{t('editingStatus.Typed')}</Select.Option>
        <Select.Option value="InReview">{t('editingStatus.InReview')}</Select.Option>
        <Select.Option value="Completed">{t('editingStatus.Completed')}</Select.Option>
    </Select>);
};

export default EditingStatusSelect;
