import PropTypes from 'prop-types';
import { useState } from "react";

// Ui Library Improts
import { Image } from "@mantine/core";
//--------------------------------
const Img = ({ src, fallback = null, ...props }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError || !src) {
        return fallback;
    }

    return <Image src={src} {...props}
        onError={() => setImgError(true)}
    />
}

Img.propTypes = {
    src: PropTypes.any,
    fallback: PropTypes.any
};

export default Img;