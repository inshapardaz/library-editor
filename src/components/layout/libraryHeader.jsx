import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

// ui library imports
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
    Button,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

// Local imports
import classes from './appHeader.module.css';

import { IconBooks, IconLibrary, IconChevronDown, IconAuthors, IconSeries, IconPoetries, IconPeriodicals, IconWritings } from '@/components/icons';
import Logo from '@/components/logo';
import LanguageSwitch from './languageSwitch';
import DarkModeToggle from './darkModeToggle';
import LibrarySwitcher from './librarySwitcher';
import Profile from './profile';
import SearchBox from './searchBox';
import CategoriesMenu from './categoriesMenu';
import ToolsMenu from './tools';

//----------------------------------------------

const LibraryHeader = ({ library }) => {
    const { t } = useTranslation();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    return (
        <Box>
            <header className={classes.header}>
                <Group justify="space-between" h="100%" wrap="nowrap">
                    <Group h="100%" gap={0}>
                        <LibrarySwitcher className={classes.link} library={library}>
                            <NavLink to={`/`} className={classes.link}>
                                <Logo />
                                <Space w="md" />
                                <Text visibleFrom="lg" size="sm">
                                    {library.name}
                                </Text>
                                <Space w="lg" />
                                <IconChevronDown
                                    size={16}
                                />
                            </NavLink >
                        </LibrarySwitcher>
                    </Group>
                    <Group hiddenFrom="sm" >
                        <SearchBox />
                    </Group>

                    <Group h="100%" gap={0} visibleFrom="sm" wrap="nowrap">
                        <CategoriesMenu library={library}
                            className={classes.link}
                            target='books'
                            allLabel={t('books.allBooks')}
                            countFunc={i => i.bookCount}
                            title={t('header.books')}
                            icon={<IconBooks height="24px" />}
                            extraLink={(<><div>
                                <Text fw={500} fz="sm">
                                    {t('bookUpload.title')}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {t('bookUpload.description')}
                                </Text>
                            </div>
                                <Button.Group>
                                    <Button component={Link} to={`/libraries/${library.id}/books/add`}
                                        variant="default">{t('book.actions.add.title')}</Button>
                                    <Button component={Link} to={`/libraries/${library.id}/books/upload`}
                                        variant="default">{t('bookUpload.title')}</Button>
                                </Button.Group>
                            </>)}
                        />
                        <CategoriesMenu library={library}
                            className={classes.link}
                            target='writings'
                            allLabel={t('writings.all')}
                            countFunc={i => i.articleCount}
                            title={t('header.writings')}
                            icon={<IconWritings height="24px" />} />
                        <CategoriesMenu library={library}
                            className={classes.link}
                            target='poetry'
                            allLabel={t('poetries.all')}
                            countFunc={i => i.poetryCount}
                            title={t('header.poetry')}
                            icon={<IconPoetries height="24px" />} />
                        <NavLink to={`/libraries/${library.id}/authors`} className={classes.link}>
                            <IconAuthors height="24px" />
                            <Space w="md" />
                            <Text visibleFrom="lg" size="sm">
                                {t('header.authors')}
                            </Text>
                        </NavLink >
                        <NavLink to={`/libraries/${library.id}/series`} className={classes.link}>
                            <IconSeries height="24px" />
                            <Space w="md" />
                            <Text visibleFrom="lg" size="sm">
                                {t('header.series')}
                            </Text>
                        </NavLink >
                        <CategoriesMenu library={library}
                            className={classes.link}
                            target='periodicals'
                            allLabel={t('periodicals.all')}
                            countFunc={i => i.periodicalCount}
                            title={t('header.periodicals')}
                            icon={<IconPeriodicals height="24px" />} />
                        <ToolsMenu />
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
                title={
                    <Group><IconLibrary height="24px" />
                        <Space w="md" />
                        {library.name}
                    </Group>
                }
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />
                    <NavLink to={`/libraries/${library.id}`} className={classes.link} onClick={closeDrawer}>
                        <IconLibrary height="24px" />
                        <Space w="md" />
                        {t('header.home')}
                    </NavLink >
                    <CategoriesMenu library={library}
                        target="books"
                        allLabel={t('books.allBooks')}
                        onClick={closeDrawer}
                        countFunc={i => i.bookCount}
                        title={t('header.books')}
                        icon={<IconBooks height="24px" />} />
                    <CategoriesMenu library={library}
                        target="writings"
                        allLabel={t('writings.all')}
                        onClick={closeDrawer}
                        countFunc={i => i.articleCount}
                        title={t('header.writings')}
                        icon={<IconWritings height="24px" />} />
                    <CategoriesMenu library={library}
                        target="poetry"
                        allLabel={t('poetries.all')}
                        onClick={closeDrawer}
                        countFunc={i => i.poetryCount}
                        title={t('header.poetry')}
                        icon={<IconPoetries height="24px" />} />
                    <NavLink to={`/libraries/${library.id}/authors`} className={classes.link} onClick={closeDrawer}>
                        <IconAuthors height="24px" />
                        <Space w="md" />
                        {t('header.authors')}
                    </NavLink >
                    <NavLink to={`/libraries/${library.id}/series`} className={classes.link} onClick={closeDrawer}>
                        <IconSeries height="24px" />
                        <Space w="md" />
                        {t('header.series')}
                    </NavLink >
                    <CategoriesMenu library={library}
                        target="periodicals"
                        allLabel={t('periodicals.all')}
                        onClick={closeDrawer}
                        countFunc={i => i.periodicalCount}
                        title={t('header.periodicals')}
                        icon={<IconPeriodicals height="24px" />} />
                    <Divider my="sm" />
                    <LibrarySwitcher className={classes.link} onClick={closeDrawer}>
                        <Group mx="lg">
                            <IconLibrary height="24px" />
                            {t('header.libraries')}
                            <IconChevronDown
                                width={rem(16)}
                                height={rem(16)}
                            />
                        </Group>
                    </LibrarySwitcher>

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


LibraryHeader.propTypes = {
    library: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    })
};

export default LibraryHeader;