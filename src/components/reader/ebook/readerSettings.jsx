import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

// Ui Library import
import { Drawer, Select, Slider, Stack, Text } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

// Local Imports
import ReadViewToggle from "@/components/reader/readViewToggle";
import ReaderThemeSelector from "@/components/reader/readerThemeSelector";
import { getFonts } from '@/i18n';
import { setReaderFont, setReaderFontSize, setReaderLineHeight } from '@/store/slices/uiSlice';
//------------------------------

const lineHeightMin = 1;
const lineHeightMax = 3;
var lineHeightMarks = []
for (var i = lineHeightMin; i <= lineHeightMax; i = i + 0.5) {
    lineHeightMarks.push({ value: i.toFixed(1), label: `${i.toFixed(1)}` })
}

const fontSizetMin = 8;
const fontSizeMax = 38;
var fontSizeMarks = []
for (var j = fontSizetMin; j <= fontSizeMax; j = j + 5) {
    fontSizeMarks.push({ value: j, label: `${j}` })
}
//------------------------------

const ReaderSetting = ({ opened, onClose, language, showViews = true }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { height, width } = useViewportSize();

    const readerFont = useSelector(state => state.ui.readerFont);
    const onReaderFontChanged = (value) => dispatch(setReaderFont(value))
    const readerFontSize = useSelector(state => state.ui.readerFontSize);
    const readerlineHeight = useSelector(state => state.ui.readerLineHeight);

    const onFontSizeChanged = (size) => {
        dispatch(setReaderFontSize(size));
    }

    const onlineHeightChanged = (size) => {
        dispatch(setReaderLineHeight(size));
    }

    return (<Drawer opened={opened} onClose={onClose} title={t('book.chapters')}>
        <Stack>
            {showViews && (<>
                <Text c="dimmed">{t('reader.view')}</Text>
                <ReadViewToggle />
            </>)
            }
            <Text c="dimmed">{t('reader.theme')}</Text>
            <ReaderThemeSelector />
            <Text c="dimmed">{t('reader.font')}</Text>
            <Select data={getFonts(t, language)} value={readerFont} onChange={onReaderFontChanged} />

            <Text c="dimmed">{t('reader.fontSize')}</Text>
            <Slider
                value={readerFontSize}
                onChange={onFontSizeChanged}
                marks={fontSizeMarks}
                min={fontSizetMin}
                max={fontSizeMax}
                step={1}
            />

            <Text c="dimmed">{t('reader.lineHeight')}</Text>
            <Slider
                value={readerlineHeight}
                onChange={onlineHeightChanged}
                marks={lineHeightMarks}
                min={lineHeightMin}
                max={lineHeightMax}
                step={0.1}
            />
            <Text c="dimmed" size="xs">
                {`${height} x ${width}`}
            </Text>
        </Stack>
    </Drawer>);
};

ReaderSetting.propTypes = {
    language: PropTypes.string,
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    showViews: PropTypes.bool,
}

export default ReaderSetting;