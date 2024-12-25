import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library import
import { Card, Text, Group, useMantineTheme, Center, Image, Divider } from '@mantine/core';
import moment from "moment";

// Local imports
import { getDateFormatFromFrequency } from '@/utils';
import { IconIssue, IconPages, IconEdit } from '@/components/icon';
import IconText from '@/components/iconText';
import If from '@/components/if';
import IssueDeleteButton from './issueDeleteButton';
//---------------------------------------
const IMAGE_HEIGHT = 400;
const IMAGE_WIDTH = 200;

const IssueCard = ({ libraryId, issue, frequency }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [imgError, setImgError] = useState(false);

    const icon = <Center h={IMAGE_HEIGHT}><IconIssue width={IMAGE_WIDTH} style={{ color: theme.colors.dark[1] }} /></Center>;
    const title = moment(issue.issueDate).format(getDateFormatFromFrequency(frequency));

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <If condition={issue.links?.image && !imgError} elseChildren={icon}>
                    <Image h={IMAGE_HEIGHT} radius="sm" src={issue?.links?.image} onError={() => setImgError(true)} />
                </If>
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`} truncate="end" fw={500}>{title}</Text>
            </Group>


            <Group>
                <IconText size="sm" text={t('issue.volumeNumber.title', { volumeNumber: issue.volumeNumber })}
                    link={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}`} />
                <Divider orientation="vertical" />
                <IconText size="sm" text={t('issue.issueNumber.title', { issueNumber: issue.issueNumber })} />
            </Group>
            <Group mt="md">
                <If condition={issue.pageCount != null}>
                    <IconText icon={<IconPages style={{ color: theme.colors.dark[2] }} />} text={issue.pageCount} />
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
                    <IssueDeleteButton libraryId={libraryId} t={t} issue={issue} frequency={frequency} />
                </If>
            </Group>
        </Card>
    )
}

IssueCard.propTypes = {
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
            delete: PropTypes.string,
        })
    })
};

export default IssueCard