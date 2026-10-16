import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { ColorSwatch, Group, SegmentedControl, Stack, Text } from '@mantine/core';

// Local Imports
import { THEMES } from '@/theme';
import { selectedTheme, selectedUrduFont, setTheme, setUrduFont } from '@/store/slices/uiSlice';
//----------------------------------------------

// Swatches shown beside each theme's name: [surface, accent]
const SWATCHES = {
    nawishta: ['#f3ead8', '#163831'],
    white: ['#ffffff', '#1c7ed6'],
    black: ['#000000', '#74c0fc'],
};

// The site theme (Nawishta, plain white, plain black) and the Urdu typeface (Nastaleeq/Naskh),
// both remembered in local storage.
const AppearancePanel = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const theme = useSelector(selectedTheme);
    const urduFont = useSelector(selectedUrduFont);

    return (
        <Stack gap="md" miw={240}>
            <div>
                <Text fw={600} size="sm" mb="xs">{t('appearance.theme')}</Text>
                <SegmentedControl
                    fullWidth
                    orientation="vertical"
                    value={theme}
                    onChange={(value) => dispatch(setTheme(value))}
                    data={THEMES.map((value) => ({
                        value,
                        label: (
                            <Group gap="xs" wrap="nowrap">
                                {SWATCHES[value].map((color) => (
                                    <ColorSwatch key={color} color={color} size={14} withShadow />
                                ))}
                                <Text size="sm">{t(`appearance.themes.${value}`)}</Text>
                            </Group>
                        ),
                    }))}
                />
            </div>
            <div>
                <Text fw={600} size="sm" mb="xs">{t('appearance.urduFont')}</Text>
                <SegmentedControl
                    fullWidth
                    value={urduFont}
                    onChange={(value) => dispatch(setUrduFont(value))}
                    data={[
                        { value: 'nastaleeq', label: t('appearance.nastaleeq') },
                        { value: 'naskh', label: t('appearance.naskh') },
                    ]}
                />
            </div>
        </Stack>
    );
};

export default AppearancePanel;
