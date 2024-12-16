import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Divider, Group, Image, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import { IconSeries, IconBooks } from '@/components/icon';
import If from '@/components/if';
import IconText from '@/components/iconText';
//-------------------------------------
const IMAGE_HEIGHT = 150;

const SeriesListItem = ({ libraryId, series }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <IconSeries width={IMAGE_HEIGHT} style={{ color: theme.colors.dark[1] }} />;

    return (<>
        <Group gap="sm" wrap="nowrap">
            <If condition={series.links?.image && !imgError} elseChildren={icon}>
                <Image w={IMAGE_HEIGHT} radius="sm" src={series.links.image} onError={() => setImgError(true)} />
            </If>
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
                <IconText icon={<IconBooks height={16} style={{ color: theme.colors.dark[2] }} />} text={t('author.bookCount', { count: series?.bookCount })} />
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
            image: PropTypes.string
        })
    })
}

export default SeriesListItem;