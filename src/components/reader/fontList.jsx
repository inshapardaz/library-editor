import { Menu } from "antd";

// -----------------------------------------

const FontList = ({ selectedFont, t, onChanged }) => {

    const fonts = [{
        key: 'AlviLahoriNastaleeq',
        label: t('fonts.alviLahoriNastaleeq'),
    },
    {
        key: 'FajerNooriNastalique',
        label: t('fonts.fajerNooriNastalique'),
    },
    {
        key: 'gulzar-nastalique',
        label: t('fonts.gulzarNastalique'),
    },
    {
        key: 'EmadNastaleeq',
        label: t('fonts.emadNastaleeq'),
    },
    {
        key: 'NafeesWebNaskh',
        label: t('fonts.nafeesWebNaskh'),
    },
    {
        key: 'NafeesNastaleeq',
        label: t('fonts.nafeesNastaleeq'),
    },
    {
        key: 'MehrNastaleeq',
        label: t('fonts.mehrNastaleeq'),
    },
    {
        key: 'AdobeArabic',
        label: t('fonts.adobeArabic'),
    },
    {
        key: 'Dubai',
        label: t('fonts.dubai'),
    },
    {
        key: 'Noto Naskh Arabic',
        label: t('fonts.notoNaskhArabic'),
    },

    {
        key: 'Noto Nastaliq Urdu',
        label: t('fonts.notoNastaliqUrdu'),
    },
    {
        key: 'Jameel Noori Nastaleeq',
        label: t('fonts.jameelNooriNastaleeq'),
    },
    {
        key: 'jameel-khushkhati',
        label: t('fonts.jameelKhushkhati'),
    },
    {
        key: 'JameelNooriNastaleeqKasheeda',
        label: t('fonts.jameelNooriNastaleeqKasheeda'),
    }];

    const onClick = ({ key }) => onChanged(key)
    return (<Menu mode="inline" items={fonts} selectedKeys={selectedFont} onClick={onClick} />)
}

export default FontList;
