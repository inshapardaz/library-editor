import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import {
    Group,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem,
    Space,
    Tooltip,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

// Local Imports
import classes from './appHeader.module.css';

import Logo from '../logo';
import LanguageSwitch from './languageSwitch';
import DarkModeToggle from './darkModeToggle';
import AppearanceMenu from './appearanceMenu';
import ProfileDropDown from './profileDropDown';
import LibrarySwitcher from './librarySwitcher';
import { IconHome, IconLibrary, IconLibraryEditor, IconDictionary, IconFont, IconTools, IconChevronDown } from '@/components/icons';
import ToolsMenu from './tools';
import { LANGUAGE_TOOLS, LIBRARY_EDITOR_URL } from '@/config';
import AppSwitcher from './appSwitcher';
//----------------------------------------------

const AppHeader = () => {
    const { t } = useTranslation();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    return (
        <Box>
            <header className={classes.header}>
                <Group justify="space-between" h="100%" wrap="nowrap">
                    <Group h="100%" gap={0}>
                        <Logo home />
                        <NavLink to={`/`} className={classes.link}>
                            {t('app')}
                        </NavLink >
                    </Group>
                    <Group h="100%" gap={0} visibleFrom="sm" wrap="nowrap">
                        <Tooltip label={t('header.home')}>
                            <Link to="/" className={classes.link}>
                                <IconHome height="24px" />
                            </Link>
                        </Tooltip>
                        <LibrarySwitcher className={classes.link}>
                            <Tooltip label={t('header.libraries')}>
                                <Group gap={0} wrap="nowrap">
                                    <IconLibrary height="24px" />
                                    <IconChevronDown />
                                </Group>
                            </Tooltip>
                        </LibrarySwitcher>
                        <Tooltip label={t('header.libraryEditor')}>
                            <Link to={LIBRARY_EDITOR_URL} className={classes.link}>
                                <IconLibraryEditor height="24px" />
                            </Link>
                        </Tooltip>
                        <Tooltip label={t('header.dictionaries')}>
                            <Link to={LANGUAGE_TOOLS} className={classes.link}>
                                <IconDictionary height="24px" />
                            </Link>
                        </Tooltip>
                        <Tooltip label={t('header.fonts')}>
                            <Link to="https://fonts.nawishta.co.uk" className={classes.link}>
                                <IconFont height="24px" />
                            </Link>
                        </Tooltip>
                        <ToolsMenu />
                    </Group>
                    <Group visibleFrom="sm" wrap="nowrap">
                        <AppSwitcher />
                        <LanguageSwitch />
                        <AppearanceMenu />
                        <DarkModeToggle />
                        <ProfileDropDown />
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title={<Group>
                    <Logo />
                    <Space w="md" />
                    {t('app')}
                </Group>}
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />

                    <Link to="/" className={classes.link}>
                        <IconHome height="24px" />
                        <Space w="md" />
                        {t('header.home')}
                    </Link>
                    <LibrarySwitcher >
                        <Group className={classes.link}>
                            <IconLibrary height="24px" />
                            {t('header.libraries')}
                        </Group>
                    </LibrarySwitcher>
                    <Link to={LIBRARY_EDITOR_URL} className={classes.link}>
                        <IconLibraryEditor height="24px" />
                        <Space w="md" />
                        {t('header.libraryEditor')}
                    </Link>
                    <Link to={LANGUAGE_TOOLS} className={classes.link}>
                        <IconDictionary height="24px" />
                        <Space w="md" />
                        {t('header.dictionaries')}
                    </Link>
                    <Link to="https://fonts.nawishta.co.uk" className={classes.link}>
                        <IconFont height="24px" />
                        <Space w="md" />
                        {t('header.fonts')}
                    </Link>
                    <Link to="https://tools.nawishta.co.uk" className={classes.link}>
                        <IconTools height="24px" />
                        <Space w="md" />
                        {t('header.tools')}
                    </Link>

                    <Divider my="sm" />


                    <Divider my="sm" />

                    <Group my="sm" >
                        <AppSwitcher />
                        <LanguageSwitch />
                        <AppearanceMenu />
                        <DarkModeToggle />
                    </Group>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <ProfileDropDown />
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box >
    );
}

export default AppHeader;
