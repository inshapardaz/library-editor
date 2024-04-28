import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { App, Button, Spin, Upload } from "antd";
import { FaTimesCircle, FaFileUpload } from "react-icons/fa";

// Local imports
import { useGetBookQuery, useCreateBookPageWithImageMutation } from "~/src/store/slices/booksSlice";
import PageHeader from "~/src/components/layout/pageHeader";
import DataContainer from "~/src/components/layout/dataContainer";

//-----------------------------------------
const { Dragger } = Upload;
//-----------------------------------------

const BookPagesUploadPage = () => {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const { libraryId, bookId } = useParams();
    const [createBookPageWithImage, { isLoading: isUploading }] = useCreateBookPageWithImageMutation();
    const {
        data: book,
        error,
        isFetching,
    } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });

    const handleUpload = () => {
        createBookPageWithImage({
            book,
            fileList
        })
            .unwrap()
            .then(() => setFileList([]))
            .then(() => message.success(t("pages.actions.upload.success")))
            .catch(() => message.error(t("pages.actions.upload.error")));
    };

    const title = t('pages.actions.upload.title', { book: book?.title });
    console.log(fileList)
    const actions = [
        <Button.Group key="action-buttons">
            <Button onClick={handleUpload} icon={<FaFileUpload />} disabled={isUploading || fileList.length < 1}>
                {t('pages.actions.upload.label')}
            </Button>
            <Button onClick={() => navigate(-1)} icon={<FaTimesCircle />} disabled={isUploading}>
                {t('actions.close')}
            </Button>
        </Button.Group>,
    ];

    const props = {
        name: 'file',
        disabled: isUploading,
        multiple: true,
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        listType: "picture",
        onRemove(e) {
            const index = fileList.findIndex((f) => f.uid === e.uid);
            setFileList(fileList.splice(index, 1));
        }
    };

    return (<>
        <Spin spinning={isFetching} >
            <PageHeader
                title={title}
                icon={
                    <FaFileUpload style={{ width: 36, height: 36 }} />
                }
                actions={actions}
            />
            <DataContainer error={error}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <FaFileUpload style={{ width: 36, height: 36 }} />
                    </p>
                    <p className="ant-upload-text">{t('pages.actions.upload.message')}</p>
                    <p className="ant-upload-hint">
                        {t('pages.actions.upload.detail')}
                    </p>
                </Dragger>
            </DataContainer>
        </Spin>
    </>)
};

export default BookPagesUploadPage;
