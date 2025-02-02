import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';

// UI Library Imports
import { useMantineTheme, Stack, Button, Divider } from "@mantine/core";

// Local Imports
import {
    IconPages,
    IconEdit,
    IconVolumeNumber,
    IconIssueNumber,
    IconIssueArticle
} from '@/components/icons';

import IconText from '@/components/iconText';
import If from '@/components/if';
// import PublishButton from './publishButton';
import { getBookStatusText, BookStatusIcon } from '@/components/books/bookStatusIcon';
import IssueDeleteButton from './issueDeleteButton';

//------------------------------------------------------

const IssueInfo = ({ libraryId, periodical, issue }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const theme = useMantineTheme();

    if (!periodical || !issue) {
        return null;
    }

    return (<Stack>
        <IconText size="sm" icon={<BookStatusIcon status={issue.status} height={24} style={{ color: theme.colors.dark[2] }} />} text={getBookStatusText({ status: issue.status, t })} />

        <IconText icon={<IconVolumeNumber style={{ color: theme.colors.dark[2] }} />}
            text={t('issue.volumeNumber.title', { volumeNumber: issue.volumeNumber })}
            link={`/libraries/${libraryId}/periodicals/${periodical.id}/volumes/${issue.volumeNumber}`} />

        <IconText icon={<IconIssueNumber style={{ color: theme.colors.dark[2] }} />}
            text={t('issue.issueNumber.title', { issueNumber: issue.issueNumber })} />

        <IconText icon={<IconPages style={{ color: theme.colors.dark[2] }} />}
            text={t('issue.pageCount', { count: issue.pageCount })} />
        <IconText icon={<IconIssueArticle style={{ color: theme.colors.dark[2] }} />}
            text={t('issue.articleCount', { count: issue.articleCount })} />


        <Divider />
        <If condition={issue.links.update}>
            <Button fullWidth variant='outline' leftSection={<IconEdit />} component={Link}
                to={`/libraries/${libraryId}/periodicals/${periodical.id}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`}>{t('actions.edit')}</Button>
        </If>
        {/* 
        <If condition={issue.pageCount > 0}>
            <PublishButton fullWidth variant='outline' color="green" libraryId={libraryId} book={book} />
        </If> */}

        <If condition={issue.links.delete}>
            <IssueDeleteButton type="button" fullWidth variant='outline' color="red" t={t} issue={issue} frequency={periodical?.frequency} onDeleted={() => navigate(`/libraries/${libraryId}/books/`)} />
        </If>


        {/* Page status api not available
         <If condition={book && book.pageStatus && book.pageStatus.length > 0}>
            <Divider />
            <Text>{t('book.pagesStatus')}</Text>
            <Stack gap="sm">
                {book.pageStatus?.map(s =>
                (<Group key={s.status} component={Link} to={`/libraries/${libraryId}/books/${book.id}/?section=pages&status=${s.status}`}>
                    <EditingStatusIcon editingStatus={s.status} t={t} style={{ color: theme.colors.dark[2] }} />
                    <Tooltip label={`${t(`editingStatus.${s.status}`)} : ${s.count}`}>
                        <Progress size="lg" value={s.percentage} color={getStatusColor(s.status)} style={{ flex: 1 }} />
                    </Tooltip>
                </Group>
                )
                )}
            </Stack>
        </If> */}
    </Stack>);
};

IssueInfo.propTypes = {
    libraryId: PropTypes.string,
    periodical: PropTypes.shape({
        id: PropTypes.number,
        frequency: PropTypes.string
    }),
    issue: PropTypes.shape({
        id: PropTypes.number,
        issueNumber: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueDate: PropTypes.string,
        periodicalId: PropTypes.number,
        periodicalName: PropTypes.string,
        pageCount: PropTypes.number,
        articleCount: PropTypes.number,
        status: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
        }),
        contents: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            bookId: PropTypes.number,
            fileName: PropTypes.string,
            mimeType: PropTypes.string,
            language: PropTypes.string,
        })),
        // pageStatus: PropTypes.arrayOf(PropTypes.shape({
        //     status: PropTypes.string,
        //     count: PropTypes.number,
        //     percentage: PropTypes.number,
        // }))
    })
};

export default IssueInfo;