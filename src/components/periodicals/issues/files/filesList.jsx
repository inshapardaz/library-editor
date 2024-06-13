import React from 'react';

// 3rd party libraries
import { App, List, Space, Typography, Upload } from "antd";

// Internal Imports
import { FaBook, FaFileUpload } from "/src/icons";
import { useAddIssueContentMutation } from "/src/store/slices/issuesSlice";
import DataContainer from "/src/components/layout/dataContainer";
import FileListItem from "./fileListItem";
// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const FilesList = ({
    libraryId,
    issue,
    t,
    size = "default"
}) => {
    const { message } = App.useApp();

    const [addIssueContent, { isLoading: isAdding }] = useAddIssueContentMutation();

    const uploadFile = (file) => {
        const isAllowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
        if (!isAllowed) {
            message.error(t("errors.imageRequired"));
            return;
        }

        addIssueContent({ issue: issue, payload: file, language: 'en' }).unwrap()
            .then(() => { message.success(t("issue.actions.addFile.success")) })
            .catch(() => { message.error(t("issue.actions.addFile.error")) });
    }

    return (
        <>
            <DataContainer
                busy={isAdding}
                emptyImage={<FaBook size="5em" />}
                emptyDescription={t("issue.files.empty.title")}
                emptyContent={
                    <Dragger beforeUpload={uploadFile} maxCount={1} showUploadList={false} />
                }
                empty={!issue || (issue.contents && issue.contents.length < 1)}
                bordered={false}
            >
                <List
                    size={size}
                    itemLayout="horizontal"
                    dataSource={issue && issue.contents ? issue.contents : []}
                    footer={<Dragger beforeUpload={uploadFile} maxCount={1} showUploadList={false} >
                        <Space direction="vertical">
                            <FaFileUpload style={{ width: 36, height: 36 }} />
                            <Typography.Text>{t('issue.actions.addFile.title')}</Typography.Text>
                        </Space>
                    </Dragger>}
                    renderItem={(c) => (
                        <FileListItem key={`file-${c.id}`}
                            libraryId={libraryId}
                            issue={issue}
                            content={c}
                            t={t}
                            message={message} />
                    )}
                >
                </List>
            </DataContainer>
        </>
    );
};

export default FilesList;
