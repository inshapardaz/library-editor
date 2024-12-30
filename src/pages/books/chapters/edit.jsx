import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// UI Library Import
import { Card, Container, Grid, Group, rem, Skeleton } from "@mantine/core";

// Local Imports
import { useGetBookQuery, useGetChapterQuery } from '@/store/slices/books.api';

import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import Error from '@/components/error';

//----------------------------------------

const PRIMARY_COL_HEIGHT = rem(300);


const ChapterEditorPage = () => {
    const { t } = useTranslation();
    const { libraryId, bookId, chapterNumber } = useParams();
    const isEditing = useMemo(() => chapterNumber != null, [chapterNumber]);

    // Data operations
    const {
        data: book,
        error: errorLoadingBook,
        isFetching: loadingBook,
        refetch: refetchBook
    } = useGetBookQuery({
        libraryId,
        bookId
    });

    const {
        data: chapter,
        error: errorLoadingChapter,
        isFetching: loadingChapter,
        refetch: refetchChapter
    } = useGetChapterQuery({
        libraryId,
        bookId,
        chapterNumber
    }, {
        skip: !chapterNumber
    });

    // Render

    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    if (loadingBook || loadingChapter) {
        return (<Container fluid mt="sm">
            <Grid
                mih={50}
            >
                <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
            </Grid>
        </Container>);
    }
    if (errorLoadingBook || errorLoadingChapter) {
        return (<Container fluid mt="sm">
            <Error title={t('chapter.error.loading.title')}
                detail={t('chapter.error.loading.detail')}
                onRetry={() => {
                    refetchBook();
                    refetchChapter();
                }} />
        </Container>)
    }


    const title = isEditing ? chapter.title : t('chapter.actions.add.title')
    return (<Container fluid mt="sm">
        <PageHeader title={title}
            subTitle={
                <Group visibleFrom='md'>

                </Group>
            }
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('header.books'), href: `/libraries/${libraryId}/books`, icon: IconNames.Books },
                { title: book.title, href: `/libraries/${libraryId}/books/${bookId}`, icon: IconNames.Book },
                { title: t('book.chapters'), href: `/libraries/${libraryId}/books/${bookId}/chapters`, icon: IconNames.Chapters },
            ]}
            actions={[]} />
        <Container size="responsive">
            <Card withBorder>

            </Card>
        </Container>
    </Container>
    );
}

export default ChapterEditorPage;