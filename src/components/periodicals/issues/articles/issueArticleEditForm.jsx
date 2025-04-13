import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI library import
import { Group, Button, Drawer, Box, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm, isNotEmpty } from "@mantine/form";

// Local Import
import { useAddIssueArticleMutation, useUpdateIssueArticleMutation }
    from '@/store/slices/issueArticles.api';
import EditingStatusSelect from '@/components/editingStatusSelect';
import AuthorsSelect from '@/components/authors/authorsSelect';
import { EditingStatus } from '@/models';
import { error, success } from '@/utils/notifications';

// --------------------------------------
const IssueArticleEditForm = ({ libraryId, issue, article, children }) => {
    const { t } = useTranslation();
    const [opened, { open, close }] = useDisclosure(false);
    const [loaded, setLoaded] = useState(false);

    const [addIssueArticle, { isLoading: isAdding }] = useAddIssueArticleMutation();
    const [updateIssueArticle, { isLoading: isUpdating }] = useUpdateIssueArticleMutation();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            authors: [],
            status: EditingStatus.Available
        },

        validate: {
            title: isNotEmpty(t("issueArticle.title.required")),
            authors: value => value.length < 1 ? (t("issueArticle.authors.required")) : null
        },
    });

    useEffect(() => {
        if (!loaded && article != null) {
            form.initialize(article);
            setLoaded(true);
        }
    }, [article, form, loaded]);


    const onSubmit = (values) => {
        if (article) {
            updateIssueArticle({ url: values.links.update, payload: values })
                .unwrap()
                .then(() => success({ message: t("issueArticle.actions.edit.success") }))
                .then(() => close())
                .catch(() => error({ message: t("issueArticle.actions.edit.error") }));
        } else {
            addIssueArticle({
                libraryId,
                periodicalId: issue.periodicalId,
                volumeNumber: issue.volumeNumber,
                issueNumber: issue.issueNumber,
                payload: values
            })
                .unwrap()
                .then(() => success({ message: t("issueArticle.actions.add.success") }))
                .then(() => close())
                .catch(() => error({ message: t("issueArticle.actions.add.error") }));
        }
    }

    const title = article ? article.title : t("issueArticle.actions.add.label");

    return (<>
        <Drawer opened={opened} onClose={close} title={title} position='right'>
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <TextInput key={form.key('title')}
                    label={t("issueArticle.title.label")}
                    placeholder={t("issueArticle.title.placeholder")}
                    {...form.getInputProps('title')}
                />

                <AuthorsSelect t={t} libraryId={libraryId}
                    label={t("issueArticle.authors.label")}
                    placeholder={t("issueArticle.authors.placeholder")}
                    {...form.getInputProps('authors')} />

                <EditingStatusSelect t={t}
                    label={t("issueArticle.status.label")}
                    {...form.getInputProps('status')}
                />

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


IssueArticleEditForm.propTypes = {
    libraryId: PropTypes.any,
    issue: PropTypes.shape({
        id: PropTypes.number,
        periodicalId: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueNumber: PropTypes.number
    }),
    children: PropTypes.any,
    article: PropTypes.shape({
        title: PropTypes.string,
        authors: PropTypes.array,
        status: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            edit: PropTypes.string
        })
    })
};

export default IssueArticleEditForm;