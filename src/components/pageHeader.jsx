import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Ui library import
import { Anchor, Box, Breadcrumbs, Divider, Flex, Group, Menu, rem, Skeleton, Spoiler, Stack, Text, Title, useMantineTheme } from '@mantine/core';

// Local import
import If from '@/components/if';
import Img from '@/components/img';
import { Icon, IconChevronUp, IconTick } from './icons';
//----------------------------------
export const PageHeaderSkeleton = () => {
    return (<Flex
        mih={50}
        m="md"
        gap="md"
        justify="flex-start"
        align="flex-end"
        direction="row"
        wrap="wrap"
    >
        <Skeleton height={rem(96)} radius="md" />
        <Skeleton height={rem(45)} radius="md" />
        <span style={{ flex: '1' }} />
        <Skeleton height={rem(45)} width={rem(150)} radius="md" />
    </Flex>)
}

//----------------------------------
const BreadcrumbsMenu = ({ index, item }) => {
    const [opened, setOpened] = useState(false);
    return (<Menu key={item.key ?? `breadcrumb-${index}`} opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
        <Menu.Target>
            <Anchor underline="hover" c="dimmed">
                <Group wrap='nowrap' gap='xs'>
                    <If condition={item.icon}>
                        <Icon name={item.icon} height={16} />
                    </If>
                    <Text size='xs'>{item.title}</Text>
                    <IconChevronUp style={{
                        transform: opened ? "rotate(0)" : "rotate(180deg)",
                        transitionDuration: "250ms"
                    }} />
                </Group>
            </Anchor>
        </Menu.Target>
        <Menu.Dropdown>
            {item.items.map(v => (
                <Menu.Item key={item.key ?? `breadcrumb-${index}-${v.href}`}
                    component={Link} to={v.href}
                    disabled={v.selected}
                    leftSection={<Icon name={v.icon} l height={16} />}
                    rightSection={v.selected ? <IconTick height={16} /> : null}>
                    <Text size='xs'>{v.title}</Text>
                </Menu.Item>))}
        </Menu.Dropdown>
    </Menu>
    );
}
BreadcrumbsMenu.propTypes = {
    index: PropTypes.number,
    item: PropTypes.shape({
        key: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            href: PropTypes.string,
            icon: PropTypes.string,
        }))
    }),
}
//----------------------------------
const PageHeader = ({ title, subTitle, details, imageLink, defaultIcon, breadcrumbs = [], actions = [] }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const renderBreadcrumb = () => {
        return breadcrumbs.map((item, index) => {
            if (item.items) {
                return (<BreadcrumbsMenu key={item.key ?? `breadcrumb-${index}`} item={item} index={index} />);
            } else if (item.href) {
                return (
                    <Anchor component={Link} to={item.href} key={item.key ?? `breadcrumb-${index}`} underline="hover" c="dimmed" size='xs'>
                        <Group wrap='nowrap' gap='xs'>
                            <If condition={item.icon}>
                                <Icon name={item.icon} height={16} />
                            </If>
                            <Text size='xs'>{item.title}</Text>
                        </Group>
                    </Anchor>
                );
            } else {
                return (
                    <Group wrap='nowrap' gap='xs' key={item.key ?? `breadcrumb-${index}`} underline="hover" c="dimmed" size='xs'>
                        <If condition={item.icon}>
                            <Icon name={item.icon} height={16} />
                        </If>
                        <Text size='xs'>{item.title}</Text>
                    </Group>
                );
            }
        })
    }
    return (<Flex m="md" direction="column" gap="sm">
        <Flex
            gap="sm"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
        >
            <Box visibleFrom='sm'>
                <Img
                    src={imageLink}
                    h={32}
                    w="auto"
                    radius="md"
                    alt={title}
                    fit="contain"
                    fallback={<Icon name={defaultIcon} height={64} style={{ color: theme.colors.dark[1] }} />}
                />
            </Box>
            <Stack justify="center">
                <Group>
                    <Title order={3}>{title}</Title>
                    <If condition={subTitle}>
                        <Stack style={{ alignSelf: 'flex-end' }}>
                            <Title order={4}>{subTitle}</Title>
                        </Stack>
                    </If>
                    <Breadcrumbs separatorMargin="xs" mt="xs">
                        {renderBreadcrumb()}
                    </Breadcrumbs>
                </Group>
            </Stack>
            <span style={{ flex: '1' }} />
            <Stack>
                <If condition={actions}>
                    <Group justify="flex-end">
                        {actions}
                    </Group>
                </If>
            </Stack>
        </Flex>
        <If condition={details}>
            <Divider />
            <Flex
                gap="sm"
                justify="space-between"
                align="center"
                direction="row"
                wrap="nowrap"
            >
                <Spoiler showLabel={t('actions.showMore')} hideLabel={t('actions.hide')} >
                    <Text c="dimmed">{details}</Text>
                </Spoiler>
            </Flex>
        </If>
    </Flex>
    );
}

PageHeader.propTypes = {
    title: PropTypes.node,
    subTitle: PropTypes.node,
    details: PropTypes.node,
    imageLink: PropTypes.string,
    defaultIcon: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        href: PropTypes.string,
        icon: PropTypes.string,
    })),
    actions: PropTypes.any
}

export default PageHeader;
