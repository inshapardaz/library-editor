import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Center, Divider, Group, Image, Stack, Text, useMantineTheme } from '@mantine/core';
import moment from "moment";

// Local Imports
import { getDateFormatFromFrequency } from '@/utils';
import { IconIssue, IconPages, IconIssueArticle, IconVolumeNumber, IconIssueNumber, IconEdit, IconDelete } from '@/components/icon';
import IconText from '@/components/iconText';
import If from '@/components/if';
//-------------------------------------
const IMAGE_WIDTH = 150;

const IssueListItem = ({ libraryId, issue, frequency }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <Center w={IMAGE_WIDTH}><IconIssue width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} /></Center>;
    const title = moment(issue.issueDate).format(getDateFormatFromFrequency(frequency));

    return (<>
        <Group gap="sm" wrap="nowrap">
            <If condition={issue.links?.image && !imgError} elseChildren={icon}>
                <Image w={IMAGE_WIDTH} radius="sm" src={issue?.links?.image} onError={() => setImgError(true)} />
            </If>
            <Stack>
                <Group justify="space-between">
                    <Text component={Link} to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`} truncate="end" fw={500}>{title}</Text>
                </Group>
                <Group mt="md">
                    <IconText size="sm" icon={<IconVolumeNumber style={{ color: theme.colors.dark[2] }} />}
                        text={t('issue.volumeNumber.title', { volumeNumber: issue.volumeNumber })}
                        link={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}`} />
                    <Divider orientation="vertical" />
                    <IconText size="sm" icon={<IconIssueNumber style={{ color: theme.colors.dark[2] }} />}
                        text={t('issue.issueNumber.title', { issueNumber: issue.issueNumber })} />
                </Group>
                <Group mt="md">
                    <If condition={issue.pageCount != null}>
                        <IconText size="sm" icon={<IconPages style={{ color: theme.colors.dark[2] }} />} text={t('issue.pageCount', { count: issue.pageCount })} />
                    </If>
                    <If condition={issue.articleCount != null}>
                        <Divider orientation="vertical" />
                        <IconText size="sm" icon={<IconIssueArticle style={{ color: theme.colors.dark[2] }} />} text={t('issue.articleCount', { count: issue.articleCount })} />
                    </If>
                    <If condition={issue.links.update} >
                        <Divider orientation='vertical' />
                        <IconText
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                            tooltip={t('actions.delete')}
                            link={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`}
                        />
                    </If>
                    <If condition={issue.links.delete} >
                        <Divider orientation='vertical' />
                        <IconText
                            icon={<IconDelete height={16} style={{ color: theme.colors.dark[2] }} />}
                            tooltip={t('actions.delete')}
                            link={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`}
                        />
                    </If>
                </Group>
            </Stack>
        </Group>
        <Divider />
    </>
    )
}

IssueListItem.propTypes = {
    libraryId: PropTypes.string,
    frequency: PropTypes.string,
    issue: PropTypes.shape({
        id: PropTypes.number,
        issueNumber: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueDate: PropTypes.string,
        periodicalId: PropTypes.number,
        periodicalName: PropTypes.string,
        pageCount: PropTypes.number,
        articleCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default IssueListItem;