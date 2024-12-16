import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Divider, Group, Image, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import { IconPages } from '@/components/icon';
import IconText from '@/components/iconText';
import FrequencyIcon from './frequencyIcon';
import { IconPeriodical } from '@/components/icon';
import If from '@/components/if';
//-------------------------------------
const IMAGE_WIDTH = 150;

const PeriodicalListItem = ({ libraryId, periodical }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);


    const icon = <IconPeriodical width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} />;

    return (<>
        <Group gap="sm" wrap="nowrap">
            <If condition={periodical.links?.image && !imgError} elseChildren={icon}>
                <Image w={IMAGE_WIDTH} radius="sm" src={periodical?.links?.image} onError={() => setImgError(true)} />
            </If>
            <Stack>
                <Group justify="space-between">
                    <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodical.id}`} truncate="end" fw={500}>{periodical.title}</Text>
                </Group>
                <If condition={periodical?.description}
                    elseChildren={<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
                        {t('periodical.noDescription')}
                    </Text>}>
                    <Tooltip label={periodical.description} withArrow>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                            {periodical.language}
                        </Text>
                    </Tooltip>
                </If>
                <Group mt="md">
                    <FrequencyIcon frequency={periodical.frequency} showLabel c="dimmed" size="sm" height={16} style={{ color: theme.colors.gray[6] }} />
                    <If condition={periodical.issueCount != null} >
                        <>
                            <Divider orientation="vertical" />
                            <IconText icon={<IconPages height={16} style={{ color: theme.colors.dark[2] }} />} text={t('periodical.issueCount', { count: periodical.issueCount })} />
                        </>
                    </If>
                </Group>
            </Stack >
        </Group>
        <Divider />
    </>)
}

PeriodicalListItem.propTypes = {
    libraryId: PropTypes.string,
    periodical: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        language: PropTypes.string,
        issueCount: PropTypes.number,
        frequency: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
}

export default PeriodicalListItem;