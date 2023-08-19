import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { App, Button, Spin, Upload } from "antd";
import { FaTimesCircle, FaFileUpload } from "react-icons/fa";

// Local imports
import { useGetBookQuery, useCreateBookPageWithImageMutation } from "../../../features/api/booksSlice";
import PageHeader from "../../../components/layout/pageHeader";
import DataContainer from "../../../components/layout/dataContainer";
import { useState } from "react";

//-----------------------------------------
const { Dragger } = Upload;
//-----------------------------------------

const BookPagesUploadPage = () => {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { libraryId, bookId } = useParams();
    const [createBookPageWithImage] = useCreateBookPageWithImageMutation();
    const {
        data: book,
        error,
        isFetching,
    } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });

    const handleUpload = () => {
        setUploading(true);

        createBookPageWithImage({
            book,
            fileList
        })
        .unwrap()
        .then(() => setFileList([]))
        .then(() => message.success(t("pages.actions.upload.success")))
        .catch((_) => message.error(t("pages.actions.upload.error")));
    };

    const title = t('pages.actions.upload.title', { book: book && book.title });
    const actions = [
        <Button.Group>
            <Button  onClick={handleUpload} icon={<FaFileUpload />} disabled={uploading  || fileList.length < 1}>
                {t('pages.actions.upload.label')}
            </Button>
            <Button onClick={() => navigate(-1)} icon={<FaTimesCircle />} disabled={uploading}>
                {t('actions.close')}
            </Button>
        </Button.Group>,
    ];

    const props = {
        name: 'file',
        multiple: true,
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        listType: "picture",
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove(e) {
            setFileList(fileList.splice(fileList.findIndex(function(f){
                return f.uid === e.uid;
            }), 1));
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
