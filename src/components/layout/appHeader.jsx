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
  Text,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

// Local Imports
import classes from './appHeader.module.css';

import Logo from '../logo';
import LanguageSwitch from './languageSwitch';
import DarkModeToggle from './darkModeToggle';
import Profile from './profile';
import LibrarySwitcher from './librarySwitcher';
import SearchBox from './searchBox';
import { IconHome, IconLibrary, IconLibraryEditor, IconDictionary, IconFont, IconTools, IconChevronDown } from '@/components/icons';
//----------------------------------------------

const AppHeader = () => {
  const { t } = useTranslation();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Group h="100%" gap={0}>
            <NavLink to={`/`} className={classes.link}>
              <Logo />
              <Space w="md" />
              {t('app')}
            </NavLink >
          </Group>
          <Group hiddenFrom="sm" >
            <SearchBox />
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm" wrap="nowrap">
            <Link to="/" className={classes.link}>
              <IconHome height="24px" />
              <Space w="md" />
              <Text visibleFrom="lg">
                {t('header.home')}
              </Text>
            </Link>
            <LibrarySwitcher className={classes.link}>
              <IconLibrary height="24px" />
              <Space w="md" />
              <Text visibleFrom="lg">
                {t('header.libraries')}
              </Text>
              <IconChevronDown />
            </LibrarySwitcher>
            <Link to="https://editor.nawishta.co.uk" className={classes.link}>
              <IconLibraryEditor height="24px" />
              <Space w="md" />
              <Text visibleFrom="lg">
                {t('header.libraryEditor')}
              </Text>
            </Link>
            <Link to="https://dictionaries.nawishta.co.uk" className={classes.link}>
              <IconDictionary height="24px" />
              <Space w="md" />
              <Text visibleFrom="lg">
                {t('header.dictionaries')}
              </Text>
            </Link>
            <Link to="https://fonts.nawishta.co.uk" className={classes.link}>
              <IconFont height="24px" />
              <Space w="md" />
              <Text visibleFrom="lg">
                {t('header.fonts')}
              </Text>
            </Link>
            <Link to="https://tools.nawishta.co.uk" className={classes.link}>
              <IconTools height="24px" />
              <Space w="md" />
              <Text visibleFrom="lg">
                {t('header.tools')}
              </Text>
            </Link>
          </Group>
          <Group visibleFrom="sm">
            <SearchBox />
          </Group>
          <Group visibleFrom="sm" wrap="nowrap">
            <LanguageSwitch />
            <DarkModeToggle />
            <Profile />
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
          <Link to="https://editor.nawishta.co.uk" className={classes.link}>
            <IconLibraryEditor height="24px" />
            <Space w="md" />
            {t('header.libraryEditor')}
          </Link>
          <Link to="https://dictionaries.nawishta.co.uk" className={classes.link}>
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
            <LanguageSwitch />
            <DarkModeToggle />
          </Group>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Profile />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box >
  );
}

export default AppHeader;