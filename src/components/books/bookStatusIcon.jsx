import React from 'react';

// Local import
import {
    FaCheck, FaFile,
    FaFileAlt,
    FaFileSignature, FaGlasses,
    FaStarOfLife
} from "/src/icons";
import BookStatus from "/src/models/bookStatus";
//--------------------------------------------

const BookStatusIcon = ({ status, render = true }) => {
    switch (status) {
        case BookStatus.All:
            return render ? <FaStarOfLife /> : FaStarOfLife;
        case BookStatus.AvailableForTyping:
            return render ? <FaFile /> : FaFile;
        case BookStatus.BeingTyped:
            return render ? <FaFileSignature /> : FaFileSignature;
        case BookStatus.ProofRead:
            return render ? <FaGlasses /> : FaGlasses;
        case BookStatus.Published:
            return render ? <FaCheck /> : FaCheck;
        case BookStatus.ReadyForProofRead:
            return render ? <FaFileAlt /> : FaFileAlt;
        default:
            return null;
    }
};

export default BookStatusIcon;
