import { useParams } from "react-router-dom";

// UI library import
import { Container, Stack } from "@mantine/core";

// Local imports
import LibraryHeader from "@/components/library/header";
import LatestBooks from "@/components/books/latestBooks";
import FavioriteBooks from "@/components/books/favoriteBooks";
// import SuggestedBooks from "@/components/books/suggestedBooks";
import LastReadBooks from "@/components/books/lastReadBooks";
//---------------------------------------------

const LibraryPage = () => {
        const { libraryId } = useParams();

        return (
                <Stack align="stretch"
                        justify="center"
                        gap="md">
                        <LibraryHeader />
                        <Container fluid >
                                <Stack align="stretch"
                                        justify="center"
                                        gap="md">
                                        <LastReadBooks libraryId={libraryId} />
                                        <LatestBooks libraryId={libraryId} />
                                        <FavioriteBooks libraryId={libraryId} />
                                        {/* <SuggestedBooks libraryId={libraryId} /> */}
                                </Stack>
                        </Container>
                </Stack>);

}

export default LibraryPage;