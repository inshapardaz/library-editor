import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// Ui library imports
import { ActionIcon, Box, Button, Card, Collapse, Container, Flex, Group, LoadingOverlay, NumberInput, rem, SimpleGrid, Switch, Text, Textarea, TextInput, Tooltip } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { randomId, useDisclosure } from '@mantine/hooks';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';

// Local Import
import { LibraryContext } from '@/contexts'
import { useAddBookContentMutation, useAddBookMutation, useUpdateBookImageMutation } from '@/store/slices/books.api';
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconLink, IconSave, IconDelete, IconChevronDown, IconUplaodDocument, IconUploadAccept, IconUploadReject } from '@/components/icons';
import ProcessStatusIcon from '@/components/processStatusIcon';
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
    const [opened, { toggle, close }] = useDisclosure(false);

    // Data operations 
    const [addBook] = useAddBookMutation();
    const [addBookContent] = useAddBookContentMutation();
    const [updateBookImage] = useUpdateBookImageMutation();

    //-------------- Form ----------------------

    const itemForm = useForm({
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
            itemForm.validate();
        }
    });

    const editorForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            authors: [],
            categories: [],
            language: null,
            yearPublished: 0,
            publisher: null,
            copyrights: null,
            seriesId: null,
            source: null,
            status: null
        },
        validate: {
            yearPublished: value => value != 0 ? isInRange({ min: 1000, max: new Date().getFullYear() }, t("book.yearPublished.error"))(value) : null,
        },
    })

    const fields = itemForm.getValues().requests.map((item, index) => {
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
                            <ActionIcon variant="default" size="lg" onClick={() => itemForm.removeListItem('requests', index)}>
                                <IconDelete />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Card.Section>
                <If condition={allowEdit}>
                    <Card.Section withBorder inheritPadding p="md">
                        <SimpleGrid cols={3}>
                            <TextInput label={t("book.title.label")} placeholder={t("book.title.placeholder")} disabled={!allowEdit}
                                key={itemForm.key(`requests.${index}.book.title`)}
                                {...itemForm.getInputProps(`requests.${index}.book.title`)} />

                            <Textarea label={t("book.description.label")} placeholder={t("book.description.placeholder")} disabled={!allowEdit}
                                key={itemForm.key(`requests.${index}.book.description`)}
                                {...itemForm.getInputProps(`requests.${index}.book.description`)} />

                            <AuthorsSelect t={t} libraryId={libraryId} disabled={!allowEdit}
                                label={t("book.authors.label")}
                                placeholder={t("book.authors.placeholder")}
                                key={itemForm.key(`requests.${index}.book.authors`)}
                                {...itemForm.getInputProps(`requests.${index}.book.authors`)} />

                            <CategoriesSelect t={t} libraryId={libraryId} label={t("book.categories.label")} disabled={!allowEdit}
                                placeholder={t("book.categories.placeholder")}
                                key={itemForm.key(`requests.${index}.book.categories`)}
                                {...itemForm.getInputProps(`requests.${index}.book.categories`)} />

                            <Flex gap="md">
                                <LanguageSelect label={t("book.language.label")} disabled={!allowEdit} style={{ flex: 1 }}
                                    key={itemForm.key(`requests.${index}.book.language`)}
                                    {...itemForm.getInputProps(`requests.${index}.book.language`)} />
                                <CopyrightSelect t={t} disabled={!allowEdit} style={{ flex: 1 }}
                                    label={t("book.copyrights.label")}
                                    key={itemForm.key(`requests.${index}.book.copyrights`)}
                                    {...itemForm.getInputProps(`requests.${index}.book.copyrights`)} />
                            </Flex>
                            <Flex gap="md">
                                <NumberInput label={t("book.yearPublished.label")}
                                    placeholder={t("book.yearPublished.placeholder")} disabled={!allowEdit}
                                    key={itemForm.key(`requests.${index}.book.yearPublished`)}
                                    {...itemForm.getInputProps(`requests.${index}.book.yearPublished`)}
                                    style={{ flex: 1 }}
                                />

                                <PublishStatusSelect t={t} label={t("book.status.label")} disabled={!allowEdit}
                                    key={itemForm.key(`requests.${index}.book.status`)}
                                    {...itemForm.getInputProps(`requests.${index}.book.status`)} />

                                <Box my="xl">
                                    <Switch label={t("book.public.label")} disabled={!allowEdit}
                                        key={itemForm.key(`requests.${index}.book.isPublic`)}
                                        {...itemForm.getInputProps(`requests.${index}.book.isPublic`, { type: 'checkbox' })} />
                                </Box>
                            </Flex>

                            <TextInput label={t("book.publisher.label")} placeholder={t("book.publisher.placeholder")} disabled={!allowEdit}
                                key={itemForm.key(`requests.${index}.book.publisher`)}
                                {...itemForm.getInputProps(`requests.${index}.book.publisher`)} />

                            <Flex gap="md">
                                <SeriesSelect t={t} libraryId={libraryId} disabled={!allowEdit}
                                    label={t("book.series.label")}
                                    placeholder={t("book.series.placeholder")}
                                    style={{ flex: 1 }}
                                    key={itemForm.key(`requests.${index}.book.seriesId`)}
                                    {...itemForm.getInputProps(`requests.${index}.book.seriesId`)} />

                                <NumberInput min={1} max={1000} label={t("book.seriesIndex.label")} disabled={!allowEdit}
                                    key={itemForm.key(`requests.${index}.book.seriesIndex`)}
                                    {...itemForm.getInputProps(`requests.${index}.book.seriesIndex`)} />
                            </Flex>
                            <TextInput label={t("book.source.label")} placeholder={t("book.source.placeholder")} disabled={!allowEdit}
                                key={itemForm.key(`requests.${index}.book.source`)}
                                {...itemForm.getInputProps(`requests.${index}.book.source`)} />
                        </SimpleGrid>
                    </Card.Section>
                </If>
            </Card>
        );
    });

    const hasRequests = useMemo(() => itemForm.getValues().requests.length > 0, [itemForm])

    //------------------------------------------
    const onFilesAdded = (files) => {
        files.forEach(file => itemForm.insertListItem('requests', {
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
        var index = itemForm.getValues().requests.findIndex(x => x.id === id);
        if (index === -1) return;

        var currentRequest = itemForm.getValues().requests.find(x => x.id === id);
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

        itemForm.replaceListItem('requests', index, currentRequest);
    }, [itemForm]);

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
        const isValid = itemForm.isValid();

        if (!isValid) return;

        setIsSaving(true);
        const requests = itemForm.getValues().requests;

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
    }, [itemForm, saveBook, t, updateRequest]);

    const applyToAll = useCallback((values) => {
        const additionalProperties = {};
        if (values.authors && values.authors.length > 0) {
            additionalProperties.authors = values.authors;
        }

        if (values.categories && values.categories.length > 0) {
            additionalProperties.categories = values.categories;
        }

        if (values.language) additionalProperties.language = values.language;
        if (values.copyrights) additionalProperties.copyrights = values.copyrights;
        if (values.yearPublished) additionalProperties.yearPublished = values.yearPublished;
        if (values.publisher) additionalProperties.publisher = values.publisher;
        if (values.seriesId) additionalProperties.seriesId = values.seriesId;
        if (values.source) additionalProperties.source = values.source;
        if (values.status) additionalProperties.status = values.status;

        //status and year published is not working
        itemForm.getValues().requests.forEach((r, index) => {
            const n = { ...r, book: { ...r.book, ...additionalProperties } };
            itemForm.replaceListItem('requests', index, n)
        });

        editorForm.reset();
        close()
    }, [close, editorForm, itemForm]);

    return (<Container padding="md" fluid>
        <LoadingOverlay visible={isSaving} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <PageHeader
            title={t('bookUpload.title')}
            defaultIcon={IconNames.Books}
            breadcrumbs={[
                { title: t('header.home'), href: `/libraries/${libraryId}`, icon: IconNames.Home },
                { title: t('bookUpload.title'), icon: IconNames.Home },
            ]} />
        <Card withBorder>
            <Card.Section withBorder p="sm">
                <Group justify="space-between">
                    <Button variant="outline" onClick={toggle} disabled={!hasRequests} rightSection={<IconChevronDown
                        size={16}
                        stroke={1.5}
                        style={{
                            transform: !opened ? "rotate(0)" : "rotate(180deg)",
                            transitionDuration: "250ms"
                        }}
                    />}>
                        {t('bookUpload.actions.applyToAll.title')}
                    </Button>
                    <Button variant="outline" color="green" disabled={!hasRequests && itemForm.isValid()} onClick={saveBooks} leftSection={<IconSave />}>
                        {t('actions.save')}
                    </Button>
                </Group>
                <Collapse in={opened}>
                    <form onSubmit={editorForm.onSubmit((values) => applyToAll(values))}>
                        <SimpleGrid cols={3} >
                            <AuthorsSelect t={t} libraryId={libraryId}
                                key={editorForm.key('authors')}
                                label={t("book.authors.label")}
                                placeholder={t("book.authors.placeholder")}
                                {...editorForm.getInputProps('authors')} />

                            <CategoriesSelect t={t}
                                key={editorForm.key('categories')}
                                libraryId={libraryId}
                                label={t("book.categories.label")}
                                placeholder={t("book.categories.placeholder")}
                                {...editorForm.getInputProps('categories')} />
                            <LanguageSelect
                                label={t("book.language.label")}
                                {...editorForm.getInputProps('language')}
                            />
                            <CopyrightSelect t={t} key={editorForm.key('copyrights')}
                                label={t("book.copyrights.label")}
                                {...editorForm.getInputProps('copyrights')}
                            />
                            <NumberInput key={editorForm.key('yearPublished')} disabled
                                label={t("book.yearPublished.label")}
                                placeholder={t("book.yearPublished.placeholder")}
                                {...editorForm.getInputProps('yearPublished')}
                            />
                            <TextInput key={editorForm.key('publisher')}
                                label={t("book.publisher.label")}
                                placeholder={t("book.publisher.placeholder")}
                                {...editorForm.getInputProps('publisher')}
                            />

                            <SeriesSelect t={t} libraryId={libraryId} key={editorForm.key('seriesId')}
                                label={t("book.series.label")}
                                placeholder={t("book.series.placeholder")}
                                {...editorForm.getInputProps('seriesId')}
                                style={{ flex: 1 }}
                            />

                            <TextInput key={editorForm.key('source')}
                                label={t("book.source.label")}
                                placeholder={t("book.source.placeholder")}
                                {...editorForm.getInputProps('source')}
                            />
                            <PublishStatusSelect t={t} key={editorForm.key('status')} disabled
                                label={t("book.status.label")}
                                {...editorForm.getInputProps('status')}
                            />
                            <div />
                            <div />
                            <Group justify="flex-end" mt="md">
                                <Button type="submit">{t('actions.save')}</Button>
                                <Button variant='light' onClick={() => editorForm.reset()}>{t('actions.reset')}</Button>
                            </Group>
                        </SimpleGrid>
                    </form>
                </Collapse>
            </Card.Section>
            <Card.Section withBorder p="sm">
                <Dropzone
                    onDrop={onFilesAdded}
                    onReject={() => notifications.show({
                        color: 'red',
                        title: t("book.actions.addFile.invalidFileTypeError")
                    })}
                    maxSize={300 * 1024 ** 2}
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
            </Card.Section>
            <Card.Section withBorder p="sm">
                {fields}
            </Card.Section>
        </Card>
    </Container>)
}

export default BookUploadPage;