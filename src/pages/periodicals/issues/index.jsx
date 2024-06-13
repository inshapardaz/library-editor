import React from 'react';
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import moment from "moment";

// 3rd party libraries
import { Breadcrumb, Button, Layout, Space, Tabs, Typography, theme } from "antd";
import { FiEdit, FiLayers } from "/src/icons";
import { FaHome, FaRegClone, FaRegFileAlt, FaRegFile } from "/src/icons";
import { ImNewspaper } from "/src/icons";

// Local imports
import { useGetIssueQuery } from "/src/store/slices/issuesSlice";
import { useGetPeriodicalByIdQuery } from "/src/store/slices/periodicalsSlice";
import { getDateFormatFromFrequency } from "/src/util";
import PageHeader from "/src/components/layout/pageHeader";
import ContentsContainer from "/src/components/layout/contentContainer";
import IssueInfo from "/src/components/periodicals/issues/issueInfo";
import IssueDeleteButton from "/src/components/periodicals/issues/issueDeleteButton";
import FileList from "/src/components/periodicals/issues/files/filesList";
import Loading from "/src/components/common/loader";
import Error from "/src/components/common/error";

//--------------------------------------------------------
const { Content, Sider } = Layout;
//--------------------------------------------------------

const IssuePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [searchParams] = useSearchParams();
    const section = searchParams.get("section");
    const { libraryId, periodicalId, volumeNumber, issueNumber } = useParams();

    // Data queries
    //----------------------------------------------
    const { data: periodical, error: periodicalError, isFetching: isFetchingPeriodical } = useGetPeriodicalByIdQuery({ libraryId, periodicalId }, { skip: !libraryId || !periodicalId });
    const { data: issue, error, isFetching } = useGetIssueQuery({ libraryId, periodicalId, volumeNumber, issueNumber }, { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber || isFetchingPeriodical || periodicalError });

    const tabs = [
        {
            key: "articles",
            label: (
                <Space gutter={2}>
                    <FaRegClone />
                    {t("issue.articles.title")}
                </Space>
            ),
            children: (
                // <ChaptersList
                //     libraryId={libraryId}
                //     bookId={bookId}
                //     t={t}
                //     size="large"
                // />
                "articles"
            ),
        },
        {
            key: "pages",
            label: (
                <Space gutter={2}>
                    <FaRegFileAlt />
                    {t("pages.title")}
                </Space>
            ),
            children: (
                //<PagesList
                //     libraryId={libraryId}
                //     book={book}
                //     t={t}
                //     size="large"
                // />
                "pages"
            ),
        },
        {
            key: "files",
            label: (
                <Space gutter={2}>
                    <FaRegFile />
                    {t("issue.files.title")}
                </Space>
            ),
            children: (
                <FileList
                    libraryId={libraryId}
                    issue={issue}
                    t={t}
                    size="large"
                />
            ),
        },
    ];

    const onChange = (key) => {
        navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}?section=${key}`);
    };

    const title = issue && moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency));

    // render
    //----------------------------------------------
    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    return (<>
        <PageHeader
            title={periodical?.title}
            subTitle={<Typography.Text>{title}</Typography.Text>}
            icon={<FiLayers style={{ width: 36, height: 36 }} />}
            breadcrumb={<Breadcrumb
                items={[
                    {
                        title: <Link to={`/libraries/${libraryId}`}><FaHome /></Link>,
                    },
                    {
                        title: <Link to={`/libraries/${libraryId}/periodicals`}><Space><ImNewspaper />{t("header.periodicals")}</Space></Link>,
                    },
                    {
                        title: <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}`}><Space><ImNewspaper />{t("issue.volumeNumber.label")} {volumeNumber}</Space></Link>,
                    },
                    {
                        title: <Space><ImNewspaper />{t("issue.issueNumber.label")} {issueNumber}</Space>,
                    }
                ]} />}
            actions={[
                <Button.Group key="button-group">
                    <Button
                        block
                        icon={<FiEdit />}
                        onClick={() =>
                            navigate(
                                `/libraries/${libraryId}/periodicals/${periodical.id}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`
                            )
                        }
                    >
                        {t("actions.edit")}
                    </Button>
                    {/* <BookPublishButton
                        block
                        size="large"
                        libraryId={libraryId}
                        book={book}
                        t={t}
                    >
                        {t("actions.delete")}
                    </BookPublishButton>*/}
                    <IssueDeleteButton
                        block
                        size="large"
                        onDeleted={() => navigate(`/libraries/${libraryId}/periodicals/${periodical.id}`)}
                        issue={issue}
                        libraryId={libraryId}
                        t={t}
                        key="issue-delete-button"
                    >
                        {t("actions.delete")}
                    </IssueDeleteButton>
                </Button.Group>,
            ]}
        />
        <ContentsContainer>
            <Layout
                style={{ padding: "24px 0", background: colorBgContainer }}
            >
                <Sider
                    style={{ background: colorBgContainer }}
                    width={200}
                    breakpoint="lg"
                    collapsedWidth={0}
                >
                    <IssueInfo t={t}
                        libraryId={libraryId}
                        periodical={periodical}
                        issue={issue}
                        errorLoading={error}
                        isFetching={isFetching}
                    />
                </Sider>
                <Content style={{
                    margin: '0 16px',
                }}>
                    <Tabs
                        defaultActiveKey={section}
                        items={tabs}
                        onChange={onChange}
                    />

                </Content>
            </Layout>
        </ContentsContainer>
    </>);
}

export default IssuePage;
