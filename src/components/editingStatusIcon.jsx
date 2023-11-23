import {
    FaFile,
    FaFileSignature,
    FaFileAlt,
    FaCheck,
    FaGlasses,
    FaRegFile,
} from "react-icons/fa";

// ------------------------------------------------------

const EditingStatusIcon = ({ status, style, render = true }) => {
    switch (status) {
        case "Available":
            return render ? <FaFile style={style} /> : FaFile;
        case "Typing":
            return render ? <FaFileSignature style={style} /> : FaFileSignature;
        case "Typed":
            return render ? <FaFileAlt style={style} /> : FaFileAlt;
        case "InReview":
            return render ? <FaGlasses style={style} /> : FaGlasses;
        case "Completed":
            return render ? <FaCheck style={style} /> : FaCheck;
        default:
            return render ? <FaRegFile style={style} /> : FaRegFile;
    }
};

export default EditingStatusIcon;
