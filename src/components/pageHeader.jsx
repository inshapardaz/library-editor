import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui library import
import { Anchor, Box, Breadcrumbs, Divider, Flex, Group, Image, rem, Skeleton, Spoiler, Stack, Text, Title, useMantineTheme } from '@mantine/core';

// Local import
import If from '@/components/if';
import { Icon } from './icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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
const PageHeader = ({ title, subTitle, details, imageLink, defaultIcon, breadcrumbs = [], actions = [] }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    return (<Flex
        mih={50}
        m="md"
        gap="md"
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
                {actions}
            </Group>
            <If condition={subTitle}>
                <Title order={4}>{subTitle}</Title>
            </If>
        </Stack>
        <span style={{ flex: '1' }} />
        <If condition={breadcrumbs}>
            <Breadcrumbs>
                {breadcrumbs.map((item, index) => (
                    <Anchor component={Link} to={item.href} key={`breadcrumb-${index}`} underline="hover" c="dimmed">
                        <Group wrap='nowrap' gap='xs'>
                            <If condition={item.icon}>
                                <Icon name={item.icon} l height={16} />
                            </If>
                            {item.title}
                        </Group>
                    </Anchor>
                ))}
            </Breadcrumbs>
        </If>
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