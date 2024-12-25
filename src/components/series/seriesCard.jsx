import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library import
import { Card, Text, Group, useMantineTheme, Center, Image, Divider } from '@mantine/core';

// Local imports
import { IconSeries, IconBooks, IconEdit } from '@/components/icon';
import IconText from '../iconText';
import If from '@/components/if';
import SeriesDeleteButton from './seriesDeleteButton';
//---------------------------------------

const IMAGE_HEIGHT = 225;
const IMAGE_WIDTH = 150;

const SeriesCard = ({ libraryId, series }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <Center h={IMAGE_HEIGHT}><IconSeries width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <If condition={series.links?.image && !imgError} elseChildren={icon}>
                    <Image h={IMAGE_HEIGHT} radius="sm" src={series?.links?.image} onError={() => setImgError(true)} />
                </If>
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/series/${series.id}`} truncate="end" fw={500}>{series.name}</Text>
            </Group>

            <Group mt="md">
                <If condition={series.bookCount != null}>
                    <IconText
                        icon={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />}
                        text={series.bookCount}
                        tooltip={t('series.bookCount', { count: series.bookCount })} />
                </If>
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
        </Card>
    )
}

SeriesCard.propTypes = {
    libraryId: PropTypes.string,
    series: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        bookCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
};

export default SeriesCard