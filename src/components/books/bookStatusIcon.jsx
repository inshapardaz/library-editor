import PropTypes from 'prop-types';

// Local imports
import {
    IconPublished,
    IconAvailableForTyping,
    IconBeingTyped,
    IconReadyForProofRead,
    IconProofRead,
    IconAll
} from "@/components/icons";
import BookStatus from '@/models/bookStatus';

//-----------------------------------------

export const getBookStatusText = ({ status, t }) => {
    switch (status) {
        case BookStatus.AvailableForTyping:
            return (t(`book.statuses.${BookStatus.AvailableForTyping}`));
        case BookStatus.BeingTyped:
            return (t(`book.statuses.${BookStatus.BeingTyped}`));
        case BookStatus.ReadyForProofRead:
            return (t(`book.statuses.${BookStatus.ReadyForProofRead}`))
        case BookStatus.ProofRead:
            return (t(`book.statuses.${BookStatus.ProofRead}`))
        case BookStatus.Published:
            return (t(`book.statuses.${BookStatus.Published}`))
        case BookStatus.All:
            return (t(`book.statuses.${BookStatus.All}`))
    }
}

export const BookStatusIcon = ({ status, ...props }) => {
    switch (status) {
        case BookStatus.AvailableForTyping:
            return <IconAvailableForTyping {...props} />;
        case BookStatus.BeingTyped:
            return <IconBeingTyped {...props} />;
        case BookStatus.ReadyForProofRead:
            return <IconReadyForProofRead {...props} />;
        case BookStatus.ProofRead:
            return <IconProofRead {...props} />;
        case BookStatus.Published:
            return <IconPublished {...props} />;
        case BookStatus.All:
            return <IconAll {...props} />;
    }
};

BookStatusIcon.propTypes = {
    status: PropTypes.string
};