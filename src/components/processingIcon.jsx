// 3rd party libraries
import { FaFileUpload, FaHourglass, FaRedo, FaRegCheckCircle, FaRegTimesCircle, FaSave, FaTrash, FaUpload } from '/src/icons';

// Local imports
const { ProcessStatus } = require("/src/models");
//-----------------------------------
const ProcessingIcon = ({ status }) => {
    switch (status) {
        case ProcessStatus.Pending:
            return <FaHourglass />;
        case ProcessStatus.CreatingBook:
        case ProcessStatus.UploadingContents:
            return <FaFileUpload />
        case ProcessStatus.Completed:
            return <FaRegCheckCircle />;
        case ProcessStatus.Failed:
            return <FaRegTimesCircle style={{ color: 'red' }} />;
        default:
            return null;
    }
}
