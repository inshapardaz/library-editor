import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ui library imports
import {
    Popover,
    Group,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Divider,
    Collapse,
    Button,
    Center,
    NavLink,
    Badge,
    Space,
    Stack,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

// Local imports
import classes from './appHeader.module.css';

import { useGetCategoriesQuery } from '@/store/slices/categories.api';
import { IconCategory, IconChevronDown, IconRefreshAlert } from '@/components/icons';
import If from '@/components/if'

//----------------------------------------------

const CategoriesMenu = ({ library, title, icon, className, target, allLabel, extraLink, countFunc = () => null, onClick = () => { } }) => {
    const { t } = useTranslation();
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const { data: categories, isFetching, error }
        = useGetCategoriesQuery({ libraryId: library.id }, { skip: library == null });

    const categoriesList = categories?.data?.map ? categories.data.filter(i => countFunc(i) > 0).map((item) => (
        <UnstyledButton className={classes.subLink} key={item.name} onClick={onClick} >
            <Group wrap="nowrap" align="flex-start">
                <NavLink
                    key={item.id}
                    component={Link}
                    to={`/libraries/${library.id}/${target}?category=${item.id}`}
                    label={item.name}
                    rightSection={
                        <Badge size="xs" color='gray' circle>
                            {countFunc(item)}
                        </Badge>
                    }
                    leftSection={<ThemeIcon size={34} variant="default" radius="md">
                        <IconCategory height={22} />
                    </ThemeIcon>}
                />
            </Group>
        </UnstyledButton>
    )) : [];

    if (!library) return null;

    const emptyPlaceholder = (<Stack>
        <Center>
            <Text c="dimmed">{t('categories.empty.title')}</Text>
        </Center>
        <Center>
            <Text component={Link} to={`/libraries/${library.id}/${target}`} fz="sm" onClick={onClick}>
                {allLabel}
            </Text>
        </Center>
    </Stack>);

    return (
        <>
            <Popover width={600} position="bottom" radius="md" shadow="md" disabled={isFetching} withinPortal visibleFrom="sm" className={className}>
                <Popover.Target>
                    <UnstyledButton className={classes.link}>
                        {icon}
                        <Space w="md" />
                        <Text visibleFrom="lg" size="sm">
                            {title}
                        </Text>
                        <IconChevronDown />
                    </UnstyledButton >
                </Popover.Target>

                <Popover.Dropdown style={{ overflow: 'hidden' }}>
                    <If condition={error}>
                        <>
                            <Text c="dimmed">{t('categories.errors.loading.subTitle')}</Text>
                            <Button rightSection={<IconRefreshAlert />}>{t('actions.retry')}</Button>
                        </>
                    </If>
                    <If condition={!error}>
                        <>
                            <Group justify="space-between" px="md">
                                <Text fw={500}>{t('header.categories')}</Text>
                                <Text component={Link} to={`/libraries/${library.id}/${target}`} fz="sm" onClick={onClick}>
                                    {allLabel}
                                </Text>
                            </Group>

                            <Divider my="sm" />

                            <If condition={categoriesList.length > 0} elseChildren={
                                emptyPlaceholder
                            }>
                                <SimpleGrid cols={2} spacing={0}>
                                    {categoriesList}
                                </SimpleGrid>
                            </If>
                            <If condition={extraLink}>
                                <div className={classes.dropdownFooter}>
                                    <Group justify="space-between">
                                        {extraLink}
                                    </Group>
                                </div>
                            </If>
                        </>
                    </If>
                </Popover.Dropdown>
            </Popover>
            <UnstyledButton className={classes.link} onClick={toggleLinks} hiddenFrom="sm" px="md">
                <>
                    {icon}
                    <Space w="md" />
                    <Text>
                        {title}
                    </Text>
                    <span style={{ width: '100%' }} />
                    <IconChevronDown
                        size={16}
                    />
                </>
            </UnstyledButton>
            <Collapse in={linksOpened} hiddenFrom="sm">
                <If condition={categoriesList && categoriesList.length > 0}
                    elseChildren={emptyPlaceholder}>
                    <UnstyledButton className={classes.subLink} key={`all-${target}`} onClick={onClick} >
                        <Group wrap="nowrap" align="flex-start">
                            <NavLink
                                component={Link}
                                to={`/libraries/${library.id}/${target}`}
                                label={allLabel}
                                leftSection={<ThemeIcon size={34} variant="default" radius="md">
                                    <IconCategory height={22} />
                                </ThemeIcon>}
                            />
                        </Group>
                    </UnstyledButton>
                    {categoriesList}
                </If>
            </Collapse>
        </>)
}

CategoriesMenu.propTypes = {
    library: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    className: PropTypes.any,
    target: PropTypes.string,
    allLabel: PropTypes.string,
    extraLink: PropTypes.any,
    title: PropTypes.string,
    icon: PropTypes.node,
    countFunc: PropTypes.func,
    onClick: PropTypes.func
};


export default CategoriesMenu;
