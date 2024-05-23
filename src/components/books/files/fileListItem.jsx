import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Button, List, Tooltip, Typography, Upload } from "antd";
import { FaCogs, FaFileDownload, FaFileUpload } from "react-icons/fa";

// Local Import
import { useUpdateBookContentMutation } from "/src/store/slices/booksSlice";
import FileDeleteButton from "./fileDeleteButton";
import FileTypeIcon from "./fileTypeIcon";
import BookImageFromFile from "./bookImageFromFile";
// ------------------------------------------------------

const FileListItem = ({
    libraryId,
    book,
    content,
    t,
    message
}) => {
    const [updateBookContent, { isLoading: isUpdating }] = useUpdateBookContentMutation();

    const title = (<Link
        to={`/libraries/${libraryId}/books/${book.id}/contents/${content.id}`}
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

        updateBookContent({ content: content, payload: file }).unwrap()
            .then(() => message.success(t("book.actions.addFile.success")))
            .catch(() => message.error(t("book.actions.addFile.error")));
    }

    return (<List.Item
        actions={[
            <BookImageFromFile key="book-image-from-file" libraryId={libraryId} book={book} t={t} disabled={isUpdating} content={content} />,
            content && content.links.update && (
                <Tooltip title={t('book.actions.addFile.title')}>
                    <Upload beforeUpload={uploadFile} maxCount={1} showUploadList={false} >
                        <Button icon={<FaFileUpload />} disabled={isUpdating} />
                    </Upload>
                </Tooltip>
            ),
            content && content.links.download && (
                <Tooltip title={t('book.actions.downloadFile.title')}>
                    <a href={content.links.download} target="_blank" rel="noreferrer">
                        <Button icon={<FaFileDownload />} />
                    </a>
                </Tooltip>
            ),
            content && content.links.update && (
                <Tooltip title="Process">
                    <Link
                        to={`/libraries/${libraryId}/books/${book.id}/contents/${content.id}/process`}
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
