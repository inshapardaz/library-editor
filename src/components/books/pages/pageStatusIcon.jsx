import {
    FaFile,
    FaFileSignature,
    FaFileAlt,
    FaCheck,
    FaGlasses,
} from "react-icons/fa";

// ------------------------------------------------------

const PageStatusIcon = ({ status, style }) => {
    switch (status) {
        case "Available":
            return <FaFile style={style} />;
        case "Typing":
            return <FaFileSignature style={style} />;
        case "Typed":
            return <FaFileAlt style={style} />;
        case "InReview":
            return <FaGlasses style={style} />;
        case "Completed":
            return <FaCheck style={style} />;
        default:
            return <FaFile style={style} />;
    }
};

export default PageStatusIcon;
