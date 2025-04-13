import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// UI Library Imprort
import { isNotEmpty, useForm } from '@mantine/form';
import { Button, Center, Group, Loader, LoadingOverlay, Modal, Switch, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Local imports
import { useAddCorrectionMutation, useUpdateCorrectionMutation } from "@/store/slices/tools.api";
import LanguageSelect from '@/components/languageSelect';
import If from '@/components/if';
import { IconAdd, IconEdit } from '@/components/icons';
import { error, success } from '@/utils/notifications';
// ------------------------------------------------------

const CorrectionForm = ({ correction = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            language: '',
            incorrectText: '',
            correctText: '',
            completeWord: true
        },

        validate: {
            language: isNotEmpty(t("corrections.language.required")),
            incorrectText: isNotEmpty(t("corrections.incorrectText.required")),
            correctText: (value, values) => value ?
                values.incorrectText == values.correctText ? t("corrections.correctText.mismatch") : null
                : t("corrections.correctText.required"),
        },
    });

    useEffect(() => {
        if (!loaded && correction != null) {
            form.initialize(correction);
            setLoaded(true);
        }
    }, [correction, form, loaded]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <LanguageSelect
                label={t("book.language.label")}
                {...form.getInputProps('language')}
            />

            <TextInput key={form.key('incorrectText')}
                label={t("corrections.incorrectText.label")}
                placeholder={t("corrections.incorrectText.placeholder")}
                {...form.getInputProps('incorrectText')}
            />

            <TextInput key={form.key('correctText')}
                label={t("corrections.correctText.label")}
                placeholder={t("corrections.correctText.placeholder")}
                {...form.getInputProps('correctText')}
            />

            <Switch py="md"
                label={t("corrections.completeWord.label")}
                key={form.key('completeWord')}
                {...form.getInputProps('completeWord', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

CorrectionForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    libraryId: PropTypes.any,
    correction: PropTypes.shape({
        id: PropTypes.number,
        language: PropTypes.string,
        profile: PropTypes.string,
        incorrectText: PropTypes.string,
        correctText: PropTypes.string,
        completeWord: PropTypes.bool,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    }),
};

// ------------------------------------------------------

const CorrectionEditButton = ({ createNew, showLabel, profile, language, correction = null, t, variant, size, color, onCompleted = () => { } }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [addCorrection, { isLoading: isAdding }] = useAddCorrectionMutation();
    const [updateCorrection, { isLoading: isUpdating }] = useUpdateCorrectionMutation();

    const onOk = async (values) => {

        const payload = {
            incorrectText: values.incorrectText,
            correctText: values.correctText,
            completeWord: values.completeWord,
        };

        if (createNew) {
            addCorrection({ language: values.language, profile, payload })
                .then(() => success({ message: t('corrections.actions.add.success') }))
                .then(onCompleted)
                .then(close())
                .catch(e => {
                    console.error(e)
                    error({ message: t('corrections.actions.add.error') })
                })
        } else {
            updateCorrection({ language: values.language, profile, id: correction.id, payload })
                .then(() => success({ message: t('corrections.actions.edit.success') }))
                .then(onCompleted)
                .then(close())
                .catch(e => {
                    console.error(e)
                    error({ message: t('corrections.actions.edit.error') })
                })
        }
    };

    const title = createNew ? t('corrections.actions.add.title') : t('corrections.actions.edit.title', { title: correction?.incorrectText });
    return (<>
        <Modal opened={opened} onClose={close} title={title}>
            <If condition={isAdding || isUpdating}>
                <Center h={100}>
                    <LoadingOverlay visible={true} loaderProps={{ children: <Loader size={30} /> }} />
                </Center>
            </If>
            <CorrectionForm correction={correction ?? { profile, language }} onSubmit={onOk} onCancel={close} />
        </Modal>
        <Tooltip label={title}>
            <If condition={showLabel} elseChildren={
                <Button onClick={open} variant={variant} size={size} color={color}>
                    {createNew ? <IconAdd /> : <IconEdit />}
                </Button>
            }>
                <Button onClick={open} variant={variant} size={size} color={color}
                    leftSection={createNew ? <IconAdd /> : <IconEdit />}
                >
                    {title}
                </Button>
            </If>
        </Tooltip>
    </>);
};

CorrectionEditButton.propTypes = {
    t: PropTypes.any,
    variant: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    profile: PropTypes.string,
    language: PropTypes.string,
    showIcon: PropTypes.bool,
    showLabel: PropTypes.bool,
    createNew: PropTypes.bool,
    correction: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        language: PropTypes.string,
        profile: PropTypes.string,
        incorrectText: PropTypes.string,
        correctText: PropTypes.string,
        completeWord: PropTypes.bool,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    }),
    onCompleted: PropTypes.func
};

export default CorrectionEditButton;
