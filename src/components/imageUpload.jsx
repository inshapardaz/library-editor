import PropTypes from 'prop-types';
import { useState } from 'react';

// Ui Library imports
import { rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';

// Local imports
import Img from '@/components/img';

//--------------------------------
const ImageUpload = ({ t, src, alt, fallback, onChange, height = rem(400), width = "auto", fit = "contain", ...props }) => {
    const [file, setFile] = useState(null);

    const getImage = () => {
        if (file) {
            return file;
        } else {
            return src;
        }
    }

    const onFileRead = (files) => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setFile(fileReader.result);
        });
        fileReader.readAsDataURL(files[0]);
        onChange(files[0]);
    }

    return (<Dropzone onDrop={onFileRead}
        onReject={() => notifications.show({
            color: 'red',
            title: t("errors.imageRequired")
        })}
        maxSize={5 * 1024 ** 2}
        multiple={false}
        maxFiles={1}
        accept={IMAGE_MIME_TYPE}
        {...props}>
        <div style={{ overflow: 'scroll' }}>
            <Img
                src={getImage()}
                h={height}
                w={width}
                radius="md"
                alt={alt}
                fit={fit}
                fallback={fallback}
            />
        </div>
    </Dropzone>)
}

ImageUpload.propTypes = {
    t: PropTypes.any,
    alt: PropTypes.string,
    src: PropTypes.string,
    fallback: PropTypes.any,
    onChange: PropTypes.func,
    height: PropTypes.any,
    width: PropTypes.any,
    fit: PropTypes.string,
};
export default ImageUpload;
