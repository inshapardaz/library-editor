import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui Library Imports
import { Avatar, Center, List, rem, Skeleton, Space, Stack, Text, Title } from '@mantine/core';

// Local imports
import { useGetIssueArticlesQuery } from '@/store/slices/issues.api';
import Error from '@/components/error';
//------------------------------

const PRIMARY_COL_HEIGHT = rem(300);
//------------------------------

const IssueArticlesList = ({
    libraryId,
    periodicalId = null,
    volumeNumber = null,
    issueNumber = null
}) => {
    const { t } = useTranslation();

    const {
        refetch,
        data: articles,
        isError,
        isFetching,
    } = useGetIssueArticlesQuery({
        libraryId,
        periodicalId,
        volumeNumber,
        issueNumber,
    });

    if (isFetching) {
        return (<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />);
    }
    if (isError) {
        return (<Error title={t('book.error.loading.title')}
            detail={t('book.error.loading.detail')}
            onRetry={refetch} />)
    }


    if (!articles || !articles.data || articles.data.length < 1) {
        return (<Center h={100}><Text>{t('book.chapterCount', { count: 0 })}</Text></Center>);
    }

    return (<Stack>
        <Title order={3}>{t('book.chapters')}</Title>
        <Space h="md" />
        <List size="lg" spacing="md"> {articles.data.map((article =>
            <List.Item key={article.id}
                icon={
                    <Avatar color="cyan" radius="xl">{article.sequenceNumber}</Avatar>
                }>
                <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}`}>
                    {article.title}
                </Text>
            </List.Item>
        ))}
        </List>
    </Stack>);
}

IssueArticlesList.propTypes = {
    libraryId: PropTypes.string,
    periodicalId: PropTypes.string,
    volumeNumber: PropTypes.string,
    issueNumber: PropTypes.string,
    showTitle: PropTypes.bool,
}

export default IssueArticlesList;