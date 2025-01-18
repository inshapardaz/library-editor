import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// Ui library imports
import { ActionIcon, Button, Card, Flex, Grid, Group, LoadingOverlay, NumberInput, rem, SimpleGrid, Stack, Switch, Text, Textarea, TextInput, Tooltip } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { randomId } from '@mantine/hooks';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';

// Local Import
import { LibraryContext } from '@/contexts'
import { useAddBookContentMutation, useAddBookMutation, useUpdateBookImageMutation } from '@/store/slices/books.api';
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconLink, IconSave, IconDelete, IconUplaodDocument, IconUploadAccept, IconUploadReject } from '@/components/icons';
import ProcessStatusIcon from '@/components/ProcessStatusIcon';
import If from '@/components/if';
import { ProcessStatus } from "@/models";
import { pdfjsLib } from '@/utils/pdf'
import { readBinaryFile, loadPdfPage, dataURItoBlob } from '@/utils';
import AuthorsSelect from '@/components/authors/authorsSelect';
import CategoriesSelect from '@/components/categories/categoriesSelect';
import CopyrightSelect from '@/components/copyrightSelect';
import LanguageSelect from '@/components/languageSelect';
import PublishStatusSelect from '@/components/publishStatusSelect';
import SeriesSelect from '@/components/series/seriesSelect';
//-----------------------------------
const removeFileExtension = (filename) => {
    if (typeof filename !== "string") {
        throw new Error("Input must be a string");
    }
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return filename; // No extension or the filename starts with a dot
    }
    return filename.slice(0, lastDotIndex);
}


const getTitlePage = async (file) => {
    const pdfFile = await readBinaryFile(file)
    const pdf = await pdfjsLib.getDocument({ data: pdfFile }).promise;
    return await loadPdfPage(pdf, 1);
}
//-----------------------------------
const BookUploadPage = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const { library } = useContext(LibraryContext);
    const [isSaving, setIsSaving] = useState(false);

    // Data operations 
    const [addBook] = useAddBookMutation();
    const [addBookContent] = useAddBookContentMutation();
    const [updateBookImage] = useUpdateBookImageMutation();


    //-------------- Form ----------------------

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            requests: [],
        },

        validate: {
            requests: {
                book: {
                    title: isNotEmpty(t("book.title.required")),
                    authors: value => value?.length < 1 ? (t("book.authors.required")) : null,
                    language: isNotEmpty(t("book.language.required")),
                    yearPublished: value => value ? isInRange({ min: 1000, max: new Date().getFullYear() }, t("book.yearPublished.error"))(value) : null,
                }
            },
        },

        onValuesChange: () => {
            form.validate();
        }
    });

    const fields = form.getValues().requests.map((item, index) => {
        const allowEdit = item.status === ProcessStatus.Pending || item.status === ProcessStatus.Failed;
        return (
            <Card withBorder shadow="sm" padding="lg" key={item.id}>
                <Card.Section withBorder inheritPadding p="md">
                    <Group>
                        <ProcessStatusIcon status={item.status} height={32} />
                        <Text>{item.file?.name}</Text>
                        <If condition={item.newBook}>
                            <ActionIcon variant="default" size="lg" component={Link} target="_blank" to={`/libraries/${libraryId}/books/${item.newBook?.id}`}>
                                <IconLink />
                            </ActionIcon>
                        </If>
                        <Tooltip label={t('actions.delete')}>
                            <ActionIcon variant="default" size="lg" onClick={() => form.removeListItem('requests', index)}>
                                <IconDelete />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Card.Section>
                <If condition={allowEdit}>
                    <Card.Section withBorder inheritPadding p="md">
                        <SimpleGrid cols={3}>
                            <TextInput label={t("book.title.label")} placeholder={t("book.title.placeholder")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.title`)}
                                {...form.getInputProps(`requests.${index}.book.title`)} />

                            <Textarea label={t("book.description.label")} placeholder={t("book.description.placeholder")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.description`)}
                                {...form.getInputProps(`requests.${index}.book.description`)} />

                            <Switch label={t("book.public.label")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.isPublic`)}
                                {...form.getInputProps(`requests.${index}.book.isPublic`, { type: 'checkbox' })} />

                            <AuthorsSelect t={t} libraryId={libraryId} disabled={!allowEdit}
                                label={t("book.authors.label")}
                                placeholder={t("book.authors.placeholder")}
                                key={form.key(`requests.${index}.book.authors`)}
                                {...form.getInputProps(`requests.${index}.book.authors`)} />

                            <CategoriesSelect t={t} libraryId={libraryId} label={t("book.categories.label")} disabled={!allowEdit}
                                placeholder={t("book.categories.placeholder")}
                                key={form.key(`requests.${index}.book.categories`)}
                                {...form.getInputProps(`requests.${index}.book.categories`)} />

                            <LanguageSelect label={t("book.language.label")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.language`)}
                                {...form.getInputProps(`requests.${index}.book.language`)} />
                            <CopyrightSelect t={t} disabled={!allowEdit}
                                label={t("book.copyrights.label")}
                                key={form.key(`requests.${index}.book.copyrights`)}
                                {...form.getInputProps(`requests.${index}.book.copyrights`)} />
                            <NumberInput label={t("book.yearPublished.label")} placeholder={t("book.yearPublished.placeholder")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.yearPublished`)}
                                {...form.getInputProps(`requests.${index}.book.yearPublished`)} />
                            <TextInput label={t("book.publisher.label")} placeholder={t("book.publisher.placeholder")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.publisher`)}
                                {...form.getInputProps(`requests.${index}.book.publisher`)} />

                            <Flex gap="md">
                                <SeriesSelect t={t} libraryId={libraryId} disabled={!allowEdit}
                                    label={t("book.series.label")}
                                    placeholder={t("book.series.placeholder")}
                                    style={{ flex: 1 }}
                                    key={form.key(`requests.${index}.book.seriesId`)}
                                    {...form.getInputProps(`requests.${index}.book.seriesId`)} />

                                <NumberInput min={1} max={1000} label={t("book.seriesIndex.label")} disabled={!allowEdit}
                                    key={form.key(`requests.${index}.book.seriesIndex`)}
                                    {...form.getInputProps(`requests.${index}.book.seriesIndex`)} />
                            </Flex>

                            <TextInput label={t("book.source.label")} placeholder={t("book.source.placeholder")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.source`)}
                                {...form.getInputProps(`requests.${index}.book.source`)} />
                            <PublishStatusSelect t={t} label={t("book.status.label")} disabled={!allowEdit}
                                key={form.key(`requests.${index}.book.status`)}
                                {...form.getInputProps(`requests.${index}.book.status`)} />
                        </SimpleGrid>
                    </Card.Section>
                </If>
            </Card>
        );
    });

    const hasRequests = useMemo(() => form.getValues().requests.length > 0, [form])

    //------------------------------------------
    const onFilesAdded = (files) => {
        files.forEach(file => form.insertListItem('requests', {
            id: randomId(),
            book: {
                title: removeFileExtension(file.name),
                libraryId: libraryId,
                authors: [],
                categories: [],
                language: library.language
            },
            file,
            isValid: false,
            status: ProcessStatus.Pending
        }))
    }

    const updateRequest = useCallback(({ id, status, newBook, newContent, error }) => {
        var index = form.getValues().requests.findIndex(x => x.id === id);
        if (index === -1) return;

        var currentRequest = form.getValues().requests.find(x => x.id === id);
        if (status) {
            currentRequest.status = status;
        }

        if (newBook) {
            currentRequest.newBook = newBook;
        }

        if (newContent) {
            currentRequest.newContent = newContent;
        }

        if (error) {
            currentRequest.error = error;
        }

        form.replaceListItem('requests', index, currentRequest);
    }, [form]);

    const saveBook = useCallback(async (request) => {
        try {
            updateRequest({ id: request.id, status: ProcessStatus.CreatingBook })

            if (!request.newBook) {
                const newBook = await addBook({ libraryId, payload: request.book }).unwrap();
                const img = await getTitlePage(request.file);
                await updateBookImage({ libraryId, bookId: newBook.id, payload: dataURItoBlob(img) }).unwrap();
                request.newBook = newBook;
                updateRequest({ id: request.id, newBook: request.newBook });
            }

            if (!request.newContent) {
                updateRequest({ id: request.id, status: ProcessStatus.UploadingContents });
                const newContent = await addBookContent({ book: request.newBook, payload: request.file }).unwrap();
                updateRequest({ id: request.id, status: ProcessStatus.Completed, newContent: newContent });
            }

        }
        catch (e) {
            updateRequest({ id: request.id, status: ProcessStatus.Failed, error: e });
            throw e;
        }
    }, [addBook, addBookContent, libraryId, updateBookImage, updateRequest]);

    var saveBooks = useCallback(async () => {
        const isValid = form.isValid();

        if (!isValid) return;

        setIsSaving(true);
        const requests = form.getValues().requests;

        let success = true;
        for (var i = 0; i < requests.length; i++) {
            let request = requests[i];
            try {
                updateRequest({ id: request.id, status: ProcessStatus.Pending })
                await saveBook(request);
            }
            catch (e) {
                console.error(e);
                success = false;
                updateRequest({ id: request.id, status: ProcessStatus.Failed, error: e });
            }
        }
        setIsSaving(false)
        if (success) {
            notifications.show({
                color: 'green',
                title: t("bookUpload.actions.add.success")
            })
        } else {
            notifications.show({
                color: 'red',
                title: t("bookUpload.actions.add.error")
            })
        }
    }, [form, saveBook, t, updateRequest]);

    return (<>
        <LoadingOverlay visible={isSaving} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <PageHeader
            title={t('bookUpload.title')}
            defaultIcon={IconNames.Books}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('bookUpload.title'), icon: IconNames.Home },
            ]} />
        <Grid type="container" breakpoints={{ xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' }} mx="md">
            {/* <Grid.Col span={{ md: 12, lg: 4, xl: 3 }} style={{ minWidth: rem(200) }}>
                <Card withBorder>
                    <BookForm libraryId={libraryId} onSubmit={updateBooks} showCancel={false} />
                </Card>
            </Grid.Col> */}
            <Grid.Col span="auto">
                <Card withBorder>
                    <Stack>
                        <Group>
                            <Tooltip label={t('actions.save')}>
                                <Button variant="default" disabled={!hasRequests && form.isValid()} onClick={saveBooks} leftSection={<IconSave />}>
                                    {t('actions.save')}
                                </Button>
                            </Tooltip>
                        </Group>
                        <Dropzone
                            onDrop={onFilesAdded}
                            onReject={() => notifications.show({
                                color: 'red',
                                title: t("book.actions.addFile.invalidFileTypeError")
                            })}
                            maxSize={100 * 1024 ** 2}
                            accept={[PDF_MIME_TYPE]}
                        >
                            <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
                                <Dropzone.Accept>
                                    <IconUploadAccept width={rem(52)} height={rem(52)}
                                        style={{ color: 'var(--mantine-color-blue-6)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconUploadReject width={rem(52)} height={rem(52)}
                                        style={{ color: 'var(--mantine-color-red-6)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconUplaodDocument width={rem(52)} height={rem(52)}
                                        style={{ color: 'var(--mantine-color-dimmed)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        {t("book.files.upload.title")}
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        {t("book.files.upload.message")}
                                    </Text>
                                </div>

                            </Group>
                        </Dropzone >
                        {fields}
                    </Stack>
                </Card>
            </Grid.Col>
        </Grid >
    </>)
}

export default BookUploadPage;