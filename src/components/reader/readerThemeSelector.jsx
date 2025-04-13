import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//UI Library Imports

// Ui Library Imports
import { ColorSwatch, SegmentedControl, Stack } from "@mantine/core";
import { setReaderTheme } from '@/store/slices/uiSlice';


// Local imports
//-----------------------------------
const ReaderThemeSelector = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const readerTheme = useSelector(state => state.ui.readerTheme);
    const onReaderThemeChange = (value) => dispatch(setReaderTheme(value))

    const themes = [{
        value: "White",
        label: (<Stack align="center">
            <ColorSwatch color="var(--reader-theme-white-background)" />
            {t('reader.themes.white')}
        </Stack>)
    }, {
        value: "Dark",
        label: (<Stack align="center">
            <ColorSwatch color="var(--reader-theme-dark-background)" />
            {t('reader.themes.dark')}
        </Stack>)
    }, {
        value: "Sepia",
        label: (<Stack align="center">
            <ColorSwatch color="var(--reader-theme-sepia-background)" />
            {t('reader.themes.sepia')}
        </Stack>)
    }, {
        value: "Grey",
        label: (<Stack align="center">
            <ColorSwatch color="var(--reader-theme-grey-background)" />
            {t('reader.themes.grey')}
        </Stack>)
    }];

    return <SegmentedControl size="md" onChange={onReaderThemeChange} value={readerTheme} data={themes} />
}

export default ReaderThemeSelector;