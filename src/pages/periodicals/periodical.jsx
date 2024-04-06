import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Col, Row } from "antd";
import { FaEdit, FaPlus } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";

// Local Imports
import PageHeader from "../../components/layout/pageHeader";
import IssuesList from "../../components/periodicals/issues/issuesList";
import ContentsContainer from "../../components/layout/contentContainer";
import { useGetPeriodicalByIdQuery } from "../../features/api/periodicalsSlice";
import Loading from "../../components/common/loader";
import Error from "../../components/common/error";
import PeriodicalInfo from "../../components/periodicals/periodicalInfo";

//--------------------------------------------------------

function PeriodicalPage() {
    const { t } = useTranslation();
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

    return (
        <>
            <PageHeader title={periodical.title} icon={<ImNewspaper style={{ width: 36, height: 36 }} />} actions={[editButton, addIssueButton]} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <PeriodicalInfo libraryId={libraryId} periodical={periodical} t={t} selectedYear={year} />
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <IssuesList libraryId={libraryId} query={query} periodicalId={periodicalId} year={year} sortBy={sortBy} sortDirection={sortDirection} status={status} pageNumber={pageNumber} pageSize={pageSize} />
                    </Col>
                </Row>
            </ContentsContainer>
        </>
    );
}
export default PeriodicalPage;
