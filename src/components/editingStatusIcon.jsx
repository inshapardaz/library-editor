import PropTypes from 'prop-types';

// Local imports
import { EditingStatus } from '@/models';
import IconText from './iconText';
import { IconAvailableForTyping, IconBeingTyped, IconReadyForProofRead, IconProofRead, IconTick } from '@/components/icons';
// -------------------------------------------------

const EditingStatusIcon = ({ editingStatus, t, showText = false, ...props }) => {
    let icon = null;
    switch (editingStatus) {
        case EditingStatus.Available:
            icon = (<IconAvailableForTyping {...props} />);
            break;
        case EditingStatus.Typing:
            icon = (<IconBeingTyped {...props} />);
            break;
        case EditingStatus.Typed:
            icon = (<IconReadyForProofRead {...props} />);
            break;
        case EditingStatus.InReview:
            icon = (<IconProofRead {...props} />);
            break;
        case EditingStatus.Completed:
            icon = (<IconTick {...props} />);
            break;
    }
    if (showText) {
        return (<IconText icon={icon} text={t(`editingStatus.${editingStatus}`)} />);
    }

    return icon;
};

EditingStatusIcon.propTypes = {
    editingStatus: PropTypes.string,
    showText: PropTypes.bool,
    t: PropTypes.any,
};

export default EditingStatusIcon;
