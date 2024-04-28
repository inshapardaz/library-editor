import { FileOutlined, FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";
//----------------------------------------------------------------

const FileTypeIcon = ({ type }) => {
    switch (type) {
        case 'application/pdf':
            return (<FilePdfOutlined />)
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return (<FileWordOutlined />);
        default:
            return (<FileOutlined />)
    }
};

export default FileTypeIcon;
