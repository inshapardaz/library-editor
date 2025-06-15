import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// UI library imports
import { Group, rem, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE, MS_WORD_MIME_TYPE } from '@mantine/dropzone';

// Local imports
import { useAddIssueContentMutation } from '@/store/slices/issues.api';
import DataView from '@/components/dataView';
import IssueFileListItem from './issueFileListItem';
import { IconUploadDocument, IconUploadAccept, IconUploadReject } from '@/components/icons';
import { error, success } from '@/utils/notifications';
//------------------------------------------------------


const IssueFilesList = ({ libraryId, issue, isLoading }) => {
    const { t } = useTranslation();

    //--- Data operations -------------------------
    const [addIssueContent, { isLoading: isAdding }] = useAddIssueContentMutation();

    const uploadFile = (files) => {
        const file = files[0];
        const isAllowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
        if (!isAllowed) {
            error({ message: t("issue.actions.addFile.invalidFileTypeError") });
            return;
        }

        addIssueContent({ issue, payload: file, language: 'en' }).unwrap()
            .then(() => success({ message: t("issue.actions.addFile.success") }))
            .catch((e) => {
                console.error(e)
                error({ message: t("issue.actions.addFile.error") });
            });
    }
    //------------------------------------------------------

    return <DataView
        emptyText={t('issue.files.empty.title')}
        dataSource={issue && issue.contents ? {
            data: issue.contents
        } : null}
        isFetching={Boolean(isLoading || isAdding)}
        showViewToggle={false}
        defaultViewType="list"
        viewToggleKey="issue-file-list"
        showPagination={false}
        listItemRender={(content, index) => <IssueFileListItem t={t}
            libraryId={libraryId}
            issue={issue}
            key={content.id}
            index={index}
            content={content}
        />}
        showSearch={false}
        footer={<Dropzone
            onDrop={uploadFile}
            onReject={() => error({ message: t("issue.actions.addFile.invalidFileTypeError") })}
            maxSize={100 * 1024 ** 2}
            accept={[IMAGE_MIME_TYPE, PDF_MIME_TYPE, MS_WORD_MIME_TYPE]}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
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
                    <IconUploadDocument width={rem(52)} height={rem(52)}
                        style={{ color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        {t("issue.files.upload.title")}
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        {t("issue.files.upload.message")}
                    </Text>
                </div>
            </Group>
        </Dropzone >} />
}

IssueFilesList.propTypes = {
    libraryId: PropTypes.string,
    issue: PropTypes.shape({
        id: PropTypes.number,
        contents: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })),
        links: PropTypes.shape({
            image: PropTypes.string,
        })
    }),
    isLoading: PropTypes.bool
};

export default IssueFilesList;
