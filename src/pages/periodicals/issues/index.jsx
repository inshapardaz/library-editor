import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import moment from "moment";

// 3rd party libraries
import { Breadcrumb, Button, Layout, Space, Tabs, Typography, theme } from "antd";
import { FiEdit, FiLayers } from "react-icons/fi";
import { FaHome, FaRegClone, FaRegFileAlt, FaRegFileWord } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";

// Local imports
import { useGetIssueQuery } from "../../../features/api/issuesSlice";
import { useGetPeriodicalByIdQuery } from "../../../features/api/periodicalsSlice";
import helpers from "../../../helpers";
import PageHeader from "../../../components/layout/pageHeader";
import ContentsContainer from "../../../components/layout/contentContainer";
import IssueInfo from "../../../components/periodicals/issues/issueInfo";
import IssueDeleteButton from "../../../components/periodicals/issues/issueDeleteButton";
import Loading from "../../../components/common/loader";
import Error from "../../../components/common/error";

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
            key: "chapters",
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
                    <FaRegFileWord />
                    {t("issue.files.title")}
                </Space>
            ),
            children: (
                // <FilesList
                //     libraryId={libraryId}
                //     book={book}
                //     t={t}
                //     size="large"
                // />
                "Files"
            ),
        },
    ];

    const onChange = (key) => {
        navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}?section=${key}`);
    };

    const title = issue && moment(issue.issueDate).format(helpers.getDateFormatFromFrequency(issue.frequency));

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
                <Button.Group>
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
                        t={t}
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
