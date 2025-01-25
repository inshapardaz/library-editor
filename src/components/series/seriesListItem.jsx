import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Divider, Group, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import { IconSeries, IconBooks, IconEdit } from '@/components/icons';
import If from '@/components/if';
import Img from '@/components/img';
import IconText from '@/components/iconText';
import SeriesDeleteButton from './seriesDeleteButton';
//-------------------------------------
const IMAGE_HEIGHT = 150;

const SeriesListItem = ({ libraryId, series }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const icon = <IconSeries width={IMAGE_HEIGHT} style={{ color: theme.colors.dark[1] }} />;

    return (<>
        <Group gap="sm" wrap="nowrap">
            <Img w={IMAGE_HEIGHT} radius="sm" src={series.links.image} fallback={icon} />
            <Stack>
                <Text component={Link} to={`/libraries/${libraryId}/series/${series.id}`} truncate="end" fw={500}>{series.name}</Text>
                <If condition={series?.description}
                    elseChildren={(<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
                        {t('series.noDescription')}
                    </Text>)}>
                    <Tooltip label={series.description} withArrow>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                            {series.description}
                        </Text>
                    </Tooltip>
                </If>
                <Group>

                    <IconText icon={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />} text={t('author.bookCount', { count: series?.bookCount })} />
                    <If condition={series.links.update} >
                        <Divider orientation='vertical' />
                        <IconText
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                            tooltip={t('actions.edit')}
                            link={`/libraries/${libraryId}/series/${series.id}/edit`}
                        />
                    </If>
                    <If condition={series.links.delete} >
                        <Divider orientation='vertical' />
                        <SeriesDeleteButton libraryId={libraryId} t={t} series={series} />
                    </If>
                </Group>
            </Stack>
        </Group>
        <Divider />
    </>)
}

SeriesListItem.propTypes = {
    libraryId: PropTypes.string,
    series: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        bookCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default SeriesListItem;