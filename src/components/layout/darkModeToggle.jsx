import { useDispatch, useSelector } from 'react-redux';

// Ui Library
import { useMantineColorScheme, useComputedColorScheme, Switch } from '@mantine/core';

// Local imports
import { selectedTheme, setUiMode } from '../../store/slices/uiSlice';
import { IconMoon, IconSun } from '../icons';

// ----------------------------

const DarkModeToggle = () => {
    const dispatch = useDispatch();
    // The plain white/black themes fix the colour scheme, so the switch only applies to Nawishta
    const isNawishta = useSelector(selectedTheme) === 'nawishta';
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onChange = () => {
        const newMode = computedColorScheme === 'light' ? 'dark' : 'light'
        dispatch(setUiMode(newMode));
        setColorScheme(newMode)
    }

    return (
        <Switch
            disabled={!isNawishta}
            size="lg"
            checked={computedColorScheme === 'light'}
            onChange={onChange}
            onLabel={<IconSun height={16} stroke={2.5} />}
            offLabel={<IconMoon height={16} stroke={2.5} />}
        />
    );
}

export default DarkModeToggle;