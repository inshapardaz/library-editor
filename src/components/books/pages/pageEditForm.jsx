import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI library import
import { Group, Button, Drawer, Box, NumberInput, Center, useMantineTheme } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm, isNotEmpty } from "@mantine/form";

// Local Import
import {
    useAddBookPageMutation,
    useUpdateBookPageMutation,
    useUpdateBookPageImageMutation
} from "/src/store/slices/books.api";
import { IconImage } from '@/components/icons';
import ImageUpload from '@/components/imageUpload';
import EditingStatusSelect from '@/components/editingStatusSelect';
import { EditingStatus } from '@/models';
import { error, success } from '@/utils/notifications';
import ChapterSelect from '@/components/books/chapters/chapterSelect';

// --------------------------------------
const PageEditForm = ({ libraryId, bookId, page = null, children }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [image, setImage] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [loaded, setLoaded] = useState(false);

    const [addPage, { isLoading: isAdding }] = useAddBookPageMutation();
    const [updatePage, { isLoading: isUpdating }] =
        useUpdateBookPageMutation();
    const [updatePageImage, { isLoading: isUpdatingImage }] = useUpdateBookPageImageMutation();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            sequenceNumber: 0,
            chapterId: null,
            status: EditingStatus.Available
        },

        validate: {
            sequenceNumber: isNotEmpty(t("page.sequenceNumber.required")),
        },
    });

    useEffect(() => {
        if (!loaded && page != null) {
            form.initialize(page);
            setLoaded(true);
        }
    }, [page, form, loaded]);

    const uploadImage = async (newPage) => {
        if (image) {
            await updatePageImage({ page: newPage, payload: image }).unwrap();
        }
    };

    const onSubmit = (values) => {
        if (page) {
            const payload = {
                ...page,
                title: values.title,
                chapterId: values.chapterId,
                status: values.status,
            };
            return updatePage({ page: payload })
                .unwrap()
                .then((p) => uploadImage(p))
                .then(() => success({ message: t("page.actions.edit.success") }))
                .then(() => close())
                .catch(() => error({ message: t("page.actions.edit.error") }));
        } else {
            return addPage({ libraryId, bookId, payload: values })
                .unwrap()
                .then((p) => uploadImage(p))
                .then(() => success({ message: t("page.actions.add.success") }))
                .then(() => close())
                .catch(() => error({ message: t("page.actions.add.error") }));
        }
    }

    const title = page ? t('page.actions.edit.title', { sequenceNumber: page.sequenceNumber }) : t('page.actions.add.title')
    const icon = <Center h={450}><IconImage width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (<>
        <Drawer opened={opened} onClose={close} title={title} position='right'>
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <NumberInput key={form.key('sequenceNumber')} disabled={true}
                    label={t("page.sequenceNumber.title")}
                    placeholder={t("page.sequenceNumber.placeholder")}
                    {...form.getInputProps('sequenceNumber')} />
                <ChapterSelect
                    key={form.key('chapterId')}
                    t={t}
                    libraryId={libraryId}
                    bookId={bookId}
                    label={t("page.chapter.label")}
                    {...form.getInputProps('chapterId')} />
                <EditingStatusSelect t={t}
                    label={t("page.status.title")}
                    {...form.getInputProps('status')} />

                <Box mt="md">
                    <ImageUpload
                        t={t}
                        src={page?.links?.image}
                        alt={`${page?.sequenceNumber}` || ''}
                        fallback={icon}
                        onChange={setImage}
                        height="auto"
                        width="100%"
                    />
                </Box>
                <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={isAdding || isUpdating || isUpdatingImage}>{t('actions.save')}</Button>
                    <Button variant='light' onClick={close}>{t('actions.cancel')}</Button>
                </Group>
            </form>
        </Drawer>
        <Box onClick={open}>
            {children}
        </Box>
    </>
    );
};


PageEditForm.propTypes = {
    libraryId: PropTypes.any,
    bookId: PropTypes.any,
    children: PropTypes.any,
    page: PropTypes.shape({
        id: PropTypes.number,
        sequenceNumber: PropTypes.number
    })
};

export default PageEditForm;