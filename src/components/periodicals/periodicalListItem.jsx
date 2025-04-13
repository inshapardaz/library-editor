import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Divider, Group, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import { IconPages, IconEdit } from '@/components/icons';
import IconText from '@/components/iconText';
import FrequencyIcon from './frequencyIcon';
import { IconPeriodical } from '@/components/icons';
import If from '@/components/if';
import Img from '@/components/img';
import PeriodicalDeleteButton from './periodicalDeleteButton';
//-------------------------------------
const IMAGE_WIDTH = 150;

const PeriodicalListItem = ({ libraryId, periodical }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();


    const icon = <IconPeriodical width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} />;

    return (<>
        <Group gap="sm" wrap="nowrap">
            <Img w={IMAGE_WIDTH} radius="sm" src={periodical?.links?.image} fallback={icon} />
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
        frequency: PropTypes.any,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default PeriodicalListItem;