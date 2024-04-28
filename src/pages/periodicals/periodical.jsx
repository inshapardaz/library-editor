import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Breadcrumb, Button, Layout, Space, theme } from "antd";
import { FaEdit, FaHome, FaPlus } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";

// Local Imports
import { useGetPeriodicalByIdQuery } from "~/src/store/slices/periodicalsSlice";
import PageHeader from "~/src/components/layout/pageHeader";
import IssuesList from "~/src/components/periodicals/issues/issuesList";
import ContentsContainer from "~/src/components/layout/contentContainer";
import Loading from "~/src/components/common/loader";
import Error from "~/src/components/common/error";
import PeriodicalInfo from "~/src/components/periodicals/periodicalInfo";
import PeriodicalDeleteButton from "~/src/components/periodicals/periodicalDeleteButton";
//--------------------------------------------------------
const { Content, Sider } = Layout;
//--------------------------------------------------------

const PeriodicalPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { libraryId, periodicalId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") ?? "DateCreated";
    const year = searchParams.get("year");
    const sortDirection = searchParams.get("sortDirection") ?? "descending";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const { data: periodical, error, isFetching } = useGetPeriodicalByIdQuery({ libraryId, periodicalId });

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const editButton = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/edit`}>
            <Button type="dashed" icon={<FaEdit />}>
                {t("actions.edit")}
            </Button>
        </Link>
    );

    const addIssueButton = (
        <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/issues/add`}>
            <Button type="dashed" icon={<FaPlus />}>
                {t("issue.actions.add.label")}
            </Button>
        </Link>
    );

    const deletePeriodicalButton = (<PeriodicalDeleteButton type="dashed" danger libraryId={libraryId} periodical={periodical} t={t}
        onDeleted={() => navigate(`/libraries/${libraryId}/periodicals`)}>
        {t('actions.delete')}
    </PeriodicalDeleteButton>)

    return (
        <>
            <PageHeader title={periodical.title} icon={<ImNewspaper style={{ width: 36, height: 36 }} />} actions={[addIssueButton, editButton, deletePeriodicalButton]}
                breadcrumb={< Breadcrumb
                    items={[
                        {
                            title: <Link to={`/libraries/${libraryId}`}><FaHome /></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals`}><Space><ImNewspaper />{t("header.periodicals")}</Space></Link>,
                        },
                        {
                            title: periodical?.title,
                        }]}
                />} />
            <ContentsContainer>
                <Layout
                    style={{ padding: "24px 0", background: colorBgContainer }}
                >
                    <Sider style={{ background: colorBgContainer }}
                        width={200}
                        breakpoint="lg"
                        collapsedWidth={0}>
                        <PeriodicalInfo libraryId={libraryId} periodical={periodical} t={t} selectedYear={year} />
                    </Sider>
                    <Content>
                        <IssuesList libraryId={libraryId} query={query} periodicalId={periodicalId} year={year} sortBy={sortBy} sortDirection={sortDirection} status={status} pageNumber={pageNumber} pageSize={pageSize} />
                    </Content>
                </Layout>
            </ContentsContainer>
        </>
    );
};

export default PeriodicalPage;
