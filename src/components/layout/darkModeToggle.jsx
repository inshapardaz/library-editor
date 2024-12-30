import { useDispatch } from 'react-redux';

// Ui Library
import cx from 'clsx';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group } from '@mantine/core';

// Local imports
import { setUiMode } from '../../store/slices/uiSlice';
import classes from './darkModeToggle.module.css';
import { IconMoon, IconSun } from '../icons';

// ----------------------------

const DarkModeToggle = () => {
    const dispatch = useDispatch();
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onClick = () => {
        const newMode = computedColorScheme === 'light' ? 'dark' : 'light'
        dispatch(setUiMode(newMode));
        setColorScheme(newMode)
    }

    return (
        <Group justify="center">
            <ActionIcon onClick={onClick}
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
            >
                <IconSun height="24px" className={cx(classes.icon, classes.light)} stroke={1.5} />
                <IconMoon height="24px" className={cx(classes.icon, classes.dark)} stroke={1.5} />
            </ActionIcon>
        </Group>
    );
}

export default DarkModeToggle;