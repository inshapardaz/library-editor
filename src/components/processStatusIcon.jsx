import PropTypes from 'prop-types';

// Local Imports
import { ProcessStatus } from "@/models";
import { IconUpload, IconBusy, IconDone, IconFailed, IconLoading } from '@/components/icons';

//---------------------------
const ProcessStatusIcon = ({ status, ...props }) => {
    switch (status) {
        case ProcessStatus.Pending:
            return <IconBusy {...props} />;
        case ProcessStatus.InProcess:
            return <IconLoading {...props} style={{ animation: 'rotation 1s linear infinite' }} />;
        case ProcessStatus.CreatingBook:
        case ProcessStatus.UploadingContents:
            return <IconUpload {...props} />
        case ProcessStatus.Completed:
            return <IconDone {...props} />;
        case ProcessStatus.Failed:
            return <IconFailed {...props} style={{ color: 'red' }} />;
        default:
            return <IconBusy />;
    }
}

ProcessStatusIcon.propTypes = {
    status: PropTypes.string,
}
export default ProcessStatusIcon;