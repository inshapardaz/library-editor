import { useParams } from "react-router-dom";

// UI library import
import { Stack } from "@mantine/core";

// Local imports
import BooksCarousel from "@/components/books/booksCarousel";
//---------------------------------------------

const LibraryPage = () => {
        const { libraryId } = useParams();

        return (
                <Stack align="stretch"
                        justify="center"
                        m="md"
                        gap="md" >
                        <Stack align="stretch"
                                justify="center"
                                gap="md">
                                <BooksCarousel libraryId={libraryId} status="ProofRead" />
                                <BooksCarousel libraryId={libraryId} status="BeingTyped" />
                        </Stack>
                </Stack>);

}

export default LibraryPage;