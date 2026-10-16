import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { ActionIcon, Menu } from '@mantine/core';

// Local Imports
import { IconApps } from '@/components/icons';
import { MAIN_SITE, LIBRARIES_URL, LIBRARY_EDITOR_URL, DICTIONARY_URL } from '@/config';
//----------------------------------------------

// The Nawishta apps, in menu order. This app is the library editor; the URLs are configurable (config.js).
const APPS = [
    { key: 'home', label: 'apps.home', href: MAIN_SITE },
    { key: 'libraries', label: 'apps.libraries', href: LIBRARIES_URL },
    { key: 'editor', label: 'apps.editor', href: LIBRARY_EDITOR_URL, current: true },
    { key: 'dictionary', label: 'apps.dictionary', href: DICTIONARY_URL },
];

// Header menu for jumping between the Nawishta apps.
const AppSwitcher = () => {
    const { t } = useTranslation();

    return (
        <Menu position="bottom-end" withinPortal>
            <Menu.Target>
                <ActionIcon variant="subtle" size="lg" aria-label={t('apps.title')}>
                    <IconApps height={20} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>{t('apps.title')}</Menu.Label>
                {APPS.map(({ key, label, href, current }) => (
                    <Menu.Item
                        key={key}
                        component="a"
                        href={href}
                        aria-current={current ? 'true' : undefined}
                        fw={current ? 700 : 400}
                    >
                        {t(label)}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default AppSwitcher;
