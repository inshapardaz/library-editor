import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// UI library import
import { Button, Container, Stack } from "@mantine/core";

// Local imports
import { LibraryContext } from '@/contexts'
import PageHeader from "@/components/pageHeader";
import BooksCarousel from "@/components/books/booksCarousel";
import IconNames from '@/components/iconNames';
import { IconEdit } from '@/components/icons';
//---------------------------------------------

const LibraryPage = () => {
        const { t } = useTranslation();
        const { libraryId } = useParams();
        const { library } = useContext(LibraryContext);

        return (<Container fluid mt="sm">
                <PageHeader
                        title={library?.name}
                        imageLink={library?.links.image}
                        defaultIcon={IconNames.Library}
                        actions={[
                                <Button key="edit-library"
                                        variant='default'
                                        component={Link}
                                        to={`/libraries/${libraryId}/edit`}
                                        leftSection={<IconEdit />}>
                                        {t('actions.edit')
                                        }</Button>
                        ]}
                        breadcrumbs={[
                                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                                { title: t('header.libraries'), icon: IconNames.Library },
                        ]}
                />
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
                </Stack>
        </Container>);

}

export default LibraryPage;