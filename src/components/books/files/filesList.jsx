// 3rd party libraries
import { App, List, Space, Typography, Upload } from "antd";
import { FaBook, FaFileUpload } from "react-icons/fa";

// Internal Imports
import { useAddBookContentMutation } from "../../../features/api/booksSlice";
import FileListItem from "../files/fileListItem";
import DataContainer from "../../layout/dataContainer";
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

        addBookContent({ book: book, payload: file }).unwrap()
            .then(() => message.success(t("book.actions.addFile.success")))
            .catch((_) => message.error(t("book.actions.addFile.error")));
    }

    return (
        <>
            <DataContainer
                busy={isAdding}
                emptyImage={<FaBook size="5em" />}
                emptyDescription={t("book.empty.title")}
                emptyContent={
                    <Dragger beforeUpload={uploadFile} maxCount={1} showUploadList={false}  />
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
                            <FileListItem  key={`file-${c.id}`}
                                libraryId={libraryId}
                                bookId={book.id}
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
