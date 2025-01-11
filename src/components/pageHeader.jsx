import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Ui library import
import { Anchor, Box, Breadcrumbs, Divider, Flex, Group, Image, Menu, rem, Skeleton, Spoiler, Stack, Text, Title, useMantineTheme } from '@mantine/core';

// Local import
import If from '@/components/if';
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
    return (<Menu key={`breadcrumb-${index}`} opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
        <Menu.Target>
            <Anchor key={`breadcrumb-${index}`} underline="hover" c="dimmed">
                <Group wrap='nowrap' gap='xs'>
                    <If condition={item.icon}>
                        <Icon name={item.icon} height={16} />
                    </If>
                    {item.title}
                    <IconChevronUp style={{
                        transform: opened ? "rotate(0)" : "rotate(180deg)",
                        transitionDuration: "250ms"
                    }} />
                </Group>
            </Anchor>
        </Menu.Target>
        <Menu.Dropdown>
            {item.items.map(v => (
                <Menu.Item key={v.value}
                    component={Link} to={v.href}
                    disabled={v.selected}
                    leftSection={<Icon name={v.icon} l height={16} />}
                    rightSection={v.selected ? <IconTick height={16} /> : null}>
                    {v.title}
                </Menu.Item>))}
        </Menu.Dropdown>
    </Menu>
    );
}
BreadcrumbsMenu.propTypes = {
    index: PropTypes.number,
    item: PropTypes.shape({
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
    const [imgError, setImgError] = useState(false);

    const renderBreadcrumb = () => {
        return breadcrumbs.map((item, index) => {
            if (item.items) {
                return (<BreadcrumbsMenu key={`breadcrumb-${index}`} item={item} index={index} />);
            }
            return (
                <Anchor component={Link} to={item.href} key={`breadcrumb-${index}`} underline="hover" c="dimmed">
                    <Group wrap='nowrap' gap='xs'>
                        <If condition={item.icon}>
                            <Icon name={item.icon} l height={16} />
                        </If>
                        {item.title}
                    </Group>
                </Anchor>
            );
        })
    }
    return (<Flex
        mih={50}
        m="md"
        gap="sm"
        justify="flex-start"
        align="flex-end"
        direction="row"
        wrap="wrap"
    >
        <Box visibleFrom='sm'>
            <If condition={imageLink && !imgError}
                elseChildren={<Icon name={defaultIcon} height={rem(64)} style={{ color: theme.colors.dark[1] }} />}>
                <Image
                    src={imageLink}
                    h={96}
                    w="auto"
                    radius="md"
                    alt={title}
                    fit="contain"
                    onError={() => setImgError(true)}
                />
            </If>
        </Box>
        <Stack>
            <Group>
                <Title order={2}>{title}</Title>
            </Group>
            <If condition={subTitle}>
                <Title order={4}>{subTitle}</Title>
            </If>
        </Stack>
        <span style={{ flex: '1' }} />
        <Stack>
            <If condition={actions}>
                <Group justify="flex-end">
                    {actions}
                </Group>
            </If>
            <If condition={breadcrumbs}>
                <Breadcrumbs>
                    {renderBreadcrumb()}
                </Breadcrumbs>
            </If>
        </Stack>
        <If condition={details}>
            <Box style={{ width: '100%' }}>
                <Divider />
                <Spoiler maxHeight={60} showLabel={t('actions.showMore')} hideLabel={t('actions.hide')}>
                    <Text c="dimmed">{details}</Text>
                </Spoiler>
            </Box>
        </If>
    </Flex>);
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