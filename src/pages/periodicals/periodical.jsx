import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Layout } from "antd";
import { FaEdit, FaPlus } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import PageHeader from "../../components/layout/pageHeader";
import IssuesList from "../../components/periodicals/issues/issuesList";
import ContentsContainer from "../../components/layout/contentContainer";
import { useGetPeriodicalByIdQuery } from "../../features/api/periodicalsSlice";
import Loading from "../../components/common/loader";
import Error from "../../components/common/error";

//--------------------------------------------------------
const { Content } = Layout;
//--------------------------------------------------------

function PeriodicalPage() {
    const { t } = useTranslation();
    const { libraryId, periodicalId } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") ?? "DateCreated";
    const sortDirection = searchParams.get("sortDirection") ?? "descending";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const { data: periodical, error, isFetching } = useGetPeriodicalByIdQuery({ libraryId, periodicalId });

    if (isFetching) return <Loading />;
    if (error) return <Error />;

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
                {t("issues.actions.add")}
            </Button>
        </Link>
    );

    return (
        <>
            <PageHeader title={periodical.title} icon={<ImBooks style={{ width: 36, height: 36 }} />} actions={[editButton, addIssueButton]} />
            <ContentsContainer>
                <Content style={{ padding: "0 24px", minHeight: 280 }}>
                    <IssuesList libraryId={libraryId} query={query} periodicalId={periodicalId} sortBy={sortBy} sortDirection={sortDirection} status={status} pageNumber={pageNumber} pageSize={pageSize} />
                </Content>
            </ContentsContainer>
        </>
    );
}
export default PeriodicalPage;
