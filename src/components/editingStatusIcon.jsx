import PropTypes from 'prop-types';

// Local imports
import { EditingStatus } from '@/models';
import { IconAvailableForTyping, IconBeingTyped, IconReadyForProofRead, IconProofRead, IconTick } from '@/components/icons';
// -------------------------------------------------

const EditingStatusIcon = ({ editingStatus, ...props }) => {
    switch (editingStatus) {
        case EditingStatus.Available:
            return (<IconAvailableForTyping {...props} />);
        case EditingStatus.Typing:
            return (<IconBeingTyped {...props} />);
        case EditingStatus.Typed:
            return (<IconReadyForProofRead {...props} />);
        case EditingStatus.InReview:
            return (<IconProofRead {...props} />);
        case EditingStatus.Completed:
            return (<IconTick {...props} />);
        default:
            return null;
    }
};

EditingStatusIcon.propTypes = {
    editingStatus: PropTypes.string
};

export default EditingStatusIcon;
