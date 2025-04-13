import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

// Ui Library Impports
import { Button, Divider, Group, LoadingOverlay, Modal, Stack, Switch, Text } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

// Local imports
import { IconPublisher } from '@/components/icons';
import { usePublishIssueMutation, useUpdateIssueMutation } from '@/store/slices/issues.api';
import If from '@/components/if';
import { BookStatus } from '@/models';
import { success, error } from '@/utils/notifications';

//---------------------------------------

const IssuePublishButton = ({ issue, onPublished = () => { }, ...props }) => {
    const { t } = useTranslation();
    const [opened, { open, close }] = useDisclosure(false);
    const [updateStatus, setUpdateStatus] = useState(false);

    const [publish, { isLoading: isPublishing }] = usePublishIssueMutation();
    const [update, { isLoading: isUpdating }] = useUpdateIssueMutation();

    const isBusy = useMemo(() => isPublishing || isUpdating, [isPublishing, isUpdating]);
    const onPublish = async () => {
        try {

            await publish({ issue })
                .unwrap();

            if (updateStatus) {
                await update({ issue, payload: { ...issue, status: BookStatus.Published } }).unwrap();
            }

            success({ message: t("issue.actions.publish.success") });
            onPublished();
        }
        catch (e) {
            console.error(e)
            error({ message: t("issue.actions.publish.error") })
        };
    }

    return (<>
        <Modal opened={opened} onClose={close} title={t("issue.actions.publish.title")}
            closeOnEscape={!isBusy}
            closeButtonProps={{ disabled: isBusy }}>
            <LoadingOverlay visible={isBusy} loaderProps={{ children: t("issue.actions.publish.busyMessage") }} />
            <Stack gap="lg">
                <Text>{t("issue.actions.publish.message")}</Text>
                <If condition={issue.status !== BookStatus.Published} >
                    <Switch label={t('issue.actions.publish.updateIssueStatus')}
                        checked={updateStatus}
                        onChange={(event) => setUpdateStatus(event.currentTarget.checked)} />
                </If>
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
            disabled={issue && issue.links && !issue.links.publish}
            loading={isPublishing}
            leftSection={<IconPublisher />}>
            {t('issue.actions.publish.title')}
        </Button>
    </>
    );
}

IssuePublishButton.propTypes = {
    libraryId: PropTypes.any,
    issue: PropTypes.shape({
        id: PropTypes.number,
        periodicalId: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueNumber: PropTypes.number,
        periodicalName: PropTypes.string,
        status: PropTypes.string,
        links: PropTypes.shape({
            publish: PropTypes.string,
        }),
    }),
    onPublished: PropTypes.func,
};


export default IssuePublishButton;