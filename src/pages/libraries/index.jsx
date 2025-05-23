// import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// Local Import
import { SortDirection } from "@/models";
import LibrariesList from "@/components/library/librariesList";
import { Container } from "@mantine/core";

// -----------------------------------------
const LibraryHomePage = () => {
    // const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    return (
        <Container fluid mt="sm">
            <LibrariesList
                query={query}
                sortBy={sortBy}
                sortDirection={sortDirection}
                pageNumber={pageNumber}
                pageSize={pageSize}
                showSearch />
        </Container>
    )
}

export default LibraryHomePage;