import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui Library Imports
import { Avatar, Center, Divider, Group, rem, Skeleton, Space, Stack, Text, Title, useMantineTheme } from '@mantine/core';

// Local imports
import { useGetIssueArticlesQuery } from '@/store/slices/issueArticles.api';
import { IconEdit, IconDelete } from '@/components/icon';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import IconText from '@/components/iconText';
import Error from '@/components/error';
import If from '@/components/if';
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
    const theme = useMantineTheme();

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
        return (<Error title={t('issues.error.loading.title')}
            detail={t('issues.error.loading.detail')}
            onRetry={refetch} />)
    }


    if (!articles || !articles.data || articles.data.length < 1) {
        return (<Center h={100}><Text>{t('issue.articleCount', { count: 0 })}</Text></Center>);
    }

    return (<Stack>
        <Title order={3}>{t('issue.articles.title')}</Title>
        <Space h="md" />

        <Stack
            align="stretch"
            justify="center"
            gap="md"
        >    {articles.data.map((article =>
            <Stack key={article.id}>
                <Group mt="md" >
                    <Avatar >{article.sequenceNumber}</Avatar>
                    <Text component={Link} to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}`}>
                        {article.title}
                    </Text>
                    <AuthorsAvatar libraryId={libraryId} authors={article?.authors} />
                    <span style={{ flex: 1 }}></span>
                    <If condition={article.links.update} >
                        <Divider />
                        <IconText
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />}
                            tooltip={t('actions.edit')}
                            link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/edit`}
                        />
                    </If>
                    <If condition={article.links.delete} >
                        <Divider orientation='vertical' />
                        <IconText
                            icon={<IconDelete height={16} style={{ color: theme.colors.dark[2] }} />}
                            tooltip={t('actions.delete')}
                            link={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber}/edit`}
                        />
                    </If>
                </Group>
                <Divider />
            </Stack>
        ))}
        </Stack>
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