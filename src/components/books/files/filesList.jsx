import React from 'react';

// 3rd party libraries
import { App, List, Space, Typography, Upload } from "antd";

// Internal Imports
import { FaBook, FaFileUpload } from "/src/icons";
import { useAddBookContentMutation } from "/src/store/slices/booksSlice";
import DataContainer from "/src/components/layout/dataContainer";
import FileListItem from "./fileListItem";
// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const FilesList = ({
    libraryId,
    book,
    t,
    size = "default"
}) => {
    const { message } = App.useApp();

    const [addBookContent, { isLoading: isAdding }] = useAddBookContentMutation();

    const uploadFile = (file) => {
        const isAllowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
        if (!isAllowed) {
            message.error(t("errors.imageRequired"));
            return;
        }

        addBookContent({ book: book, payload: file, language: 'en' }).unwrap()
            .then(() => { message.success(t("book.actions.addFile.success")) })
            .catch(() => { message.error(t("book.actions.addFile.error")) });
    }

    return (
        <>
            <DataContainer
                busy={isAdding}
                emptyImage={<FaBook size="5em" />}
                emptyDescription={t("book.empty.title")}
                emptyContent={
                    <Dragger beforeUpload={uploadFile} maxCount={1} showUploadList={false} />
                }
                empty={!book || (book.contents && book.contents.length < 1)}
                bordered={false}
            >
                <List
                    size={size}
                    itemLayout="horizontal"
                    dataSource={book && book.contents ? book.contents : []}
                    footer={<Dragger beforeUpload={uploadFile} maxCount={1} showUploadList={false} >
                        <Space direction="vertical">
                            <FaFileUpload style={{ width: 36, height: 36 }} />
                            <Typography.Text>{t('book.actions.addFile.title')}</Typography.Text>
                        </Space>
                    </Dragger>}
                    renderItem={(c) => (
                        <FileListItem key={`file-${c.id}`}
                            libraryId={libraryId}
                            book={book}
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
