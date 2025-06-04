import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

// Ui Library Impports
import { Button, Divider, Group, LoadingOverlay, Modal, Stack, Switch, Text } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

// Local imports
import { IconPublisher } from '@/components/icons';
import { usePublishBookMutation, useUpdateBookMutation } from '@/store/slices/books.api';
import If from '@/components/if';
import { BookStatus } from '@/models';
import { success, error } from '@/utils/notifications';
import PublishOutputSelect from '@/components/publishOutputSelect';

//---------------------------------------

const PublishButton = ({ libraryId, book, onPublished = () => { }, ...props }) => {
    const { t } = useTranslation();
    const [opened, { open, close }] = useDisclosure(false);
    const [updateStatus, setUpdateStatus] = useState(false);
    const [publishFilesOnly, setPublishFilesOnly] = useState(false);
    const [outputType, setOutputType] = useState('None');

    const [publishBook, { isLoading: isPublishing }] = usePublishBookMutation();
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

    const isBusy = useMemo(() => isPublishing || isUpdating, [isPublishing, isUpdating]);
    const onPublish = async () => {
        try {

            await publishBook({
                book, payload: {
                    outputType: outputType,
                    onlyPublishFile: publishFilesOnly
                }
            })
                .unwrap();

            if (updateStatus) {
                await updateBook({ libraryId, bookId: book.id, payload: { ...book, status: BookStatus.Published } }).unwrap();
            }

            success({ message: t("book.actions.publish.success") });
            onPublished();
        }
        catch (e) {
            console.error(e)
            error({ message: t("book.actions.publish.error") })
        };
    }

    return (<>
        <Modal opened={opened} onClose={close} title={t("book.actions.publish.title")}
            closeOnEscape={!isBusy}
            closeButtonProps={{ disabled: isBusy }}>
            <LoadingOverlay visible={isBusy} loaderProps={{ children: t("book.actions.publish.busyMessage") }} />
            <Stack gap="lg">
                <Text>{t("book.actions.publish.message", { title: book.title })}</Text>
                <If condition={book.status !== BookStatus.Published} >
                    <Switch label={t('book.actions.publish.updateBookStatus')}
                        checked={updateStatus}
                        onChange={(event) => setUpdateStatus(event.currentTarget.checked)} />
                </If>
                <Switch label={t('book.actions.publish.publishFilesOnly')}
                    checked={publishFilesOnly}
                    onChange={(event) => setPublishFilesOnly(event.currentTarget.checked)} />
                <PublishOutputSelect t={t} defaultValue={outputType} onChange={setOutputType} />
                <Divider />
                <Group justify='space-between'>
                    <Button onClick={onPublish} loading={isBusy}>{t('actions.yes')}</Button>
                    <Button variant='default' disabled={isBusy} onClick={close}>{t('actions.no')}</Button>
                </Group>
            </Stack>
        </Modal >
        <Button
            {...props}
            aria-label="publish"
            onClick={open}
            disabled={book && book.links && !book.links.publish}
            loading={isPublishing}
            leftSection={<IconPublisher />}>
            {t('book.actions.publish.title')}
        </Button>
    </>
    );
}

PublishButton.propTypes = {
    libraryId: PropTypes.any,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        status: PropTypes.string,
        links: PropTypes.shape({
            publish: PropTypes.string,
        }),
    }),
    onPublished: PropTypes.func,
};


export default PublishButton;
