import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI library import
import { TextInput, Group, Button, Drawer, Box } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm, isNotEmpty } from "@mantine/form";

// Local Import
import {
    useAddChapterMutation,
    useUpdateChapterMutation,
} from "/src/store/slices/books.api";
import EditingStatusSelect from '@/components/editingStatusSelect';
import { EditingStatus } from '@/models';
import { error, success } from '@/utils/notifications';
// --------------------------------------
const ChapterEditForm = ({ libraryId, bookId, chapter = null, children }) => {
    const { t } = useTranslation();
    const [opened, { open, close }] = useDisclosure(false);
    const [loaded, setLoaded] = useState(false);

    const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();
    const [updateChapter, { isLoading: isUpdating }] =
        useUpdateChapterMutation();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            status: EditingStatus.Available
        },

        validate: {
            title: isNotEmpty(t("chapter.title.required")),
        },
    });

    useEffect(() => {
        if (!loaded && chapter != null) {
            form.initialize(chapter);
            setLoaded(true);
        }
    }, [chapter, form, loaded]);

    const onSubmit = (values) => {
        if (chapter) {
            const payload = {
                ...chapter,
                title: values.title,
                status: values.status,
            };
            return updateChapter({ chapter: payload })
                .unwrap()
                .then(() => success({ message: t("chapter.actions.edit.success") }))
                .then(() => close())
                .catch(() => error({ message: t("chapter.actions.edit.error") }));
        } else {
            return addChapter({ libraryId, bookId, payload: values })
                .unwrap()
                .then(() => success({ message: t("chapter.actions.add.success") }))
                .then(() => close())
                .catch(() => error({ message: t("chapter.actions.add.error") }));
        }
    }

    const title = chapter ? chapter.title : t('chapter.actions.add.title')

    return (<>
        <Drawer opened={opened} onClose={close} title={title} position='right'>
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <TextInput key={form.key('title')}
                    label={t("chapter.title.label")}
                    placeholder={t("chapter.title.placeholder")}
                    {...form.getInputProps('title')} />
                <EditingStatusSelect t={t}
                    label={t("chapter.status.label")}
                    {...form.getInputProps('status')} />

                <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={isAdding || isUpdating}>{t('actions.save')}</Button>
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


ChapterEditForm.propTypes = {
    libraryId: PropTypes.any,
    bookId: PropTypes.any,
    children: PropTypes.any,
    chapter: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
    })
};

export default ChapterEditForm;