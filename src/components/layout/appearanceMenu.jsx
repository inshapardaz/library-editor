import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { ActionIcon, Popover } from '@mantine/core';

// Local Imports
import { IconFont } from '@/components/icons';
import AppearancePanel from './appearancePanel';
//----------------------------------------------

const AppearanceMenu = () => {
    const { t } = useTranslation();

    return (
        <Popover position="bottom-end" shadow="md" withinPortal>
            <Popover.Target>
                <ActionIcon variant="transparent" size="lg" aria-label={t('appearance.title')}>
                    <IconFont height={20} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <AppearancePanel />
            </Popover.Dropdown>
        </Popover>
    );
};

export default AppearanceMenu;
