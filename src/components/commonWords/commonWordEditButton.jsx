import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// UI Library Imprort
import { isNotEmpty, useForm } from '@mantine/form';
import { Button, Center, Group, Loader, LoadingOverlay, Modal, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Local imports
import { useAddCommonWordMutation, useUpdateCommonWordMutation } from "@/store/slices/tools.api";
import If from '@/components/if';
import { IconAdd, IconEdit } from '@/components/icons';
import { error, success } from '@/utils/notifications';
// ------------------------------------------------------

const CommonWordForm = ({ word = null, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            word: '',
            language: ''
        },

        validate: {
            word: isNotEmpty(t("commonWords.word.required")),
        },
    });

    useEffect(() => {
        if (!loaded && word != null) {
            form.initialize(word);
            setLoaded(true);
        }
    }, [form, loaded, word]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput key={form.key('word')}
                label={t("commonWords.word.label")}
                placeholder={t("commonWords.word.placeholder")}
                {...form.getInputProps('word')}
            />


            <Group justify="flex-end" mt="md">
                <Button type="submit">{t('actions.save')}</Button>
                <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
            </Group>
        </form>
    );
}

CommonWordForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    word: PropTypes.shape({
        id: PropTypes.number,
        language: PropTypes.string,
        word: PropTypes.string,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string
        })
    }),
};

// ------------------------------------------------------

const CommonWordEditButton = ({ createNew, showLabel, language, word = null, t, variant, size, color, onCompleted = () => { } }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [add, { isLoading: isAdding }] = useAddCommonWordMutation();
    const [update, { isLoading: isUpdating }] = useUpdateCommonWordMutation();

    const onOk = async (values) => {
        if (createNew) {
            add({ language, word: values.word })
                .then(() => success({ message: t('commonWords.actions.add.success') }))
                .then(onCompleted)
                .then(close())
                .catch(e => {
                    console.error(e)
                    error({ message: t('commonWords.actions.add.error') })
                })
        } else {
            console.log(values)
            update({ word: values })
                .then(() => success({ message: t('commonWords.actions.edit.success') }))
                .then(onCompleted)
                .then(close())
                .catch(e => {
                    console.error(e)
                    error({ message: t('commonWords.actions.edit.error') })
                })
        }
    };

    const title = createNew ? t('commonWords.actions.add.title') : t('commonWords.actions.edit.title', { title: word?.word });
    return (<>
        <Modal opened={opened} onClose={close} title={title}>
            <If condition={isAdding || isUpdating}>
                <Center h={100}>
                    <LoadingOverlay visible={true} loaderProps={{ children: <Loader size={30} /> }} />
                </Center>
            </If>
            <CommonWordForm word={word ?? { language, word: '' }} onSubmit={onOk} onCancel={close} />
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

CommonWordEditButton.propTypes = {
    t: PropTypes.any,
    variant: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    profile: PropTypes.string,
    language: PropTypes.string,
    showIcon: PropTypes.bool,
    showLabel: PropTypes.bool,
    createNew: PropTypes.bool,
    word: PropTypes.shape({
        id: PropTypes.number,
        language: PropTypes.string,
        word: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    }),
    onCompleted: PropTypes.func
};

export default CommonWordEditButton;
