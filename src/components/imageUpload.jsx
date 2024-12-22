import PropTypes from 'prop-types';

// Ui Library imports
import { rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';

// Local imports
import Img from '@/components/img';
import { useState } from 'react';

//--------------------------------
const ImageUpload = ({ t, src, alt, fallback, onChange, ...props }) => {
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

        <Img
            src={getImage()}
            h={rem(400)}
            w="auto"
            radius="md"
            alt={alt}
            fit='contain'
            fallback={fallback}
        />
    </Dropzone>)
}

ImageUpload.propTypes = {
    t: PropTypes.any,
    alt: PropTypes.string,
    src: PropTypes.string,
    fallback: PropTypes.any,
    onChange: PropTypes.func,
};
export default ImageUpload;
