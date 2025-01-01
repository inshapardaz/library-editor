import PropTypes from 'prop-types';

// Local Imports
import { Icon } from '@/components/icons';
import IconNames from '@/components/iconNames';
//----------------------------------------
const FileImage = ({ mimeType, ...props }) => {
    let name = "";
    switch (mimeType) {
        case "application/pdf":
            name = IconNames.FilePdf;
            break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            name = IconNames.FileWord;
            break;
        default:
            name = IconNames.File;
    }
    return <Icon name={name} {...props} />;
};

FileImage.propTypes = {
    mimeType: PropTypes.string
};

export default FileImage;