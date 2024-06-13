import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Button, List, Tooltip, Typography, Upload } from "antd";

// Local Import
import { FaCogs, FaFileDownload, FaFileUpload } from "/src/icons";
import { useUpdateIssueContentMutation } from "/src/store/slices/issuesSlice";
import FileDeleteButton from "./fileDeleteButton";
import FileTypeIcon from "/src/components/fileTypeIcon";
import IssueImageFromFile from "./issueImageFromFile";
// ------------------------------------------------------

const FileListItem = ({
    libraryId,
    issue,
    content,
    t,
    message
}) => {
    const [updateIssueContent, { isLoading: isUpdating }] = useUpdateIssueContentMutation();

    const title = (<Link
        to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/${issue.id}/contents/${content.id}`}
    >
        <Typography.Text>
            {content.fileName}
        </Typography.Text>
    </Link>);

    const uploadFile = (file) => {
        const isAllowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
        if (!isAllowed) {
            message.error(t("errors.imageRequired"));
            return;
        }

        updateIssueContent({ content: content, payload: file }).unwrap()
            .then(() => message.success(t("issue.actions.addFile.success")))
            .catch(() => message.error(t("issue.actions.addFile.error")));
    }

    return (<List.Item
        actions={[
            <IssueImageFromFile key="issue-image-from-file" libraryId={libraryId} issue={issue} t={t} disabled={isUpdating} content={content} />,
            content && content.links.update && (
                <Tooltip title={t('issue.actions.addFile.title')}>
                    <Upload beforeUpload={uploadFile} maxCount={1} showUploadList={false} >
                        <Button icon={<FaFileUpload />} disabled={isUpdating} />
                    </Upload>
                </Tooltip>
            ),
            content && content.links.download && (
                <Tooltip title={t('issue.actions.downloadFile.title')}>
                    <a href={content.links.download} target="_blank" rel="noreferrer">
                        <Button icon={<FaFileDownload />} />
                    </a>
                </Tooltip>
            ),
            content && content.links.update && (
                <Tooltip title="Process">
                    <Link
                        to={`/libraries/${libraryId}/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/contents/${content.id}/process`}
                    >
                        <Button disabled={content.mimeType !== 'application/pdf'} icon={<FaCogs />} />
                    </Link>
                </Tooltip>
            ),
            content && content.links.delete && (
                <FileDeleteButton
                    content={content}
                    t={t}
                />
            ),
        ]}
    >
        <List.Item.Meta
            title={title}
            avatar={
                <Avatar>
                    <FileTypeIcon
                        type={content.mimeType}
                    />
                </Avatar>
            }
        />
    </List.Item>
    );
};

export default FileListItem;
