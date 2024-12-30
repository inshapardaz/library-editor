import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library import
import { Card, Text, Group, Tooltip, useMantineTheme, Center, Image, Divider } from '@mantine/core';

// Local imports
import { IconPeriodical, IconEdit } from '@/components/icons';
import IconText from '@/components/iconText';
import FrequencyIcon from './frequencyIcon'
import If from '@/components/if'
import PeriodicalDeleteButton from './periodicalDeleteButton';
//---------------------------------------
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 200;
const PeriodicalCard = ({ libraryId, periodical }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <Center h={IMAGE_HEIGHT}><IconPeriodical width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <If condition={periodical.links?.image && !imgError} elseChildren={icon}>
                    <Image w={IMAGE_WIDTH} radius="sm" src={periodical?.links?.image} onError={() => setImgError(true)} />
                </If>
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodical.id}`} truncate="end" fw={500}>{periodical.title}</Text>
            </Group>

            <If condition={periodical?.description}
                elseChildren={<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
                    {t('periodical.noDescription')}
                </Text>}>
                <Tooltip label={periodical.description} withArrow>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                        {periodical.description}
                    </Text>
                </Tooltip>
            </If>

            <Group mt="md">
                <FrequencyIcon frequency={periodical.frequency} showLabel c="dimmed" size="sm" height={16} style={{ color: theme.colors.gray[6] }} />
                <If condition={periodical.issueCount != null}>
                    <>
                        <Divider orientation="vertical" />
                        <IconText icon={<IconPeriodical height={16} style={{ color: theme.colors.dark[2] }} />}
                            text={t('periodical.issueCount', { count: periodical.issueCount })} />
                    </>
                </If>
            </Group>
            <Group justify="space-between" mt="md" mb="xs">
                <If condition={periodical.links.update} >
                    <Divider />
                    <IconText
                        icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                        tooltip={t('actions.edit')}
                        link={`/libraries/${libraryId}/periodicals/${periodical.id}/edit`}
                    />
                </If>
                <If condition={periodical.links.delete} >
                    <Divider orientation='vertical' />
                    <PeriodicalDeleteButton libraryId={libraryId} t={t} periodical={periodical} />
                </If>
            </Group>
        </Card >
    )
}

PeriodicalCard.propTypes = {
    libraryId: PropTypes.string,
    periodical: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        language: PropTypes.string,
        frequency: PropTypes.string,
        issueCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
        })
    })
};

export default PeriodicalCard