import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// UI library imports
import {
    ActionIcon,
    Divider,
    FileButton,
    Group,
    Stack,
    Text,
    Tooltip,
    useMantineTheme
} from '@mantine/core';
import { IMAGE_MIME_TYPE, PDF_MIME_TYPE, MS_WORD_MIME_TYPE } from '@mantine/dropzone';

// Local imports
import { useUpdateBookContentMutation } from '@/store/slices/books.api';
import classes from './items.module.css';
import FileImage from '@/components/fileImage';
import If from '@/components/if';
import FileDeleteButton from './fileDeleteButton';
import IconText from '@/components/iconText';
import { IconDownloadDocument, IconUploadDocument, IconProcessDocument } from '@/components/icons';
import { error, success } from '@/utils/notifications';
import SetCoverButton from './setCoverButton';
//------ ---------------------------------------
const BookFileListItem = ({ t, libraryId, book, content }) => {
    const theme = useMantineTheme();
    const [updateBookContent, { isLoading: isUpdating }] = useUpdateBookContentMutation();

    const uploadFile = (file) => {
        const isAllowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
        if (!isAllowed) {
            error({ message: t("book.actions.addFile.invalidFileTypeError") });
            return;
        }

        updateBookContent({ content: content, payload: file }).unwrap()
            .then(() => {
                success({ message: t("book.actions.addFile.success") });
            })
            .catch((e) => {
                console.error(e)
                error({ message: t("book.actions.addFile.error") });
            });
    }

    return (<Stack>
        <Group mt="md" className={classes.details}>
            <FileImage mimeType={content.mimeType} width={32} style={{ color: theme.colors.dark[2] }} />
            <Text component={Link} to={content.links.download} target="_blank" rel="noreferrer">
                {content.fileName}
            </Text>

            <span style={{ flex: 1 }}></span>
            <If condition={content.links.update}>
                <Tooltip title={t('book.actions.addFile.title')}>
                    <FileButton onChange={uploadFile}
                        accept={[IMAGE_MIME_TYPE, PDF_MIME_TYPE, MS_WORD_MIME_TYPE]}>
                        {(props) => <ActionIcon {...props} disabled={isUpdating} variant='subtle' color='gray' >
                            <IconUploadDocument />
                        </ActionIcon>}
                    </FileButton>
                </Tooltip>
            </If>
            <If condition={content.links.update}>
                <Divider orientation='vertical' />
                <IconText
                    icon={<IconDownloadDocument height={16} style={{ color: theme.colors.dark[2] }} />}
                    tooltip={t('book.actions.downloadFile.title')}
                    link={content.links.download} target="_blank" rel="noreferrer" />
            </If>
            <If condition={book.links.update && content.mimeType === "application/pdf"}>
                <Divider orientation='vertical' />
                <SetCoverButton libraryId={libraryId} bookId={book.id} file={content} t={t} variant='subtle' color='gray' />
            </If>
            <If condition={book && content.links.update}>
                <Divider orientation='vertical' />
                <IconText
                    icon={<IconProcessDocument height={16} style={{ color: theme.colors.dark[2] }} />}
                    tooltip={t('book.actions.processAndSave.title')}
                    link={`/libraries/${libraryId}/books/${book.id}/files/${content.id}/process`} />

            </If>
            <If condition={content.links.delete}>
                <Divider orientation='vertical' />
                <FileDeleteButton content={content} t={t} type='default' />
            </If>
        </Group>
        <Divider />
    </Stack>);
};


BookFileListItem.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    book: PropTypes.shape({
        id: PropTypes.number,
        links: PropTypes.shape({
            update: PropTypes.string,
        }),
    }),
    index: PropTypes.number,
    content: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        fileName: PropTypes.string,
        mimeType: PropTypes.string,
        language: PropTypes.string,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            download: PropTypes.string,
        }),
    }),
    isLoading: PropTypes.object,
};

export default BookFileListItem;
