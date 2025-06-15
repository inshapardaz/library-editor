import PropTypes from 'prop-types';
import { useState } from 'react';

// Ui Library Imports
import { ActionIcon, LoadingOverlay, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';

// Local imports
import { error, success } from '@/utils/notifications';
import { IconSetImage } from '@/components/icons';
import { dataURItoBlob, getTitlePage, downloadPdf } from '@/utils';
import { useUpdateBookImageMutation } from '@/store/slices/books.api';

//---------------------------------
const SetCoverButton = ({ libraryId, bookId, file, t, onComplete = () => { }, ...props }) => {
    const theme = useMantineTheme();
    const [busy, setBusy] = useState(false);
    const [updateBookImage] = useUpdateBookImageMutation();

    const setBookCover = async () => {
        setBusy(true);
        try {

            const fileContent = await downloadPdf(file.links.download);
            const img = await getTitlePage(fileContent);
            await updateBookImage({ libraryId, bookId: bookId, payload: dataURItoBlob(img) }).unwrap();
            if (onComplete) {
                onComplete();
            }
            success({ message: t("book.actions.setCover.success") })
            modals.closeAll();
        }
        catch (e) {
            console.error(e);
            error({ message: t("book.actions.setCover.error") })
        }
        finally {
            setBusy(false);
        }
    };

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: t("book.actions.setCover.title"),
            centered: true,
            children: (
                <>
                    <LoadingOverlay visible={busy} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <Text size="sm">
                        {t("book.actions.setCover.message")}
                    </Text>
                </>
            ),
            confirmProps: { loading: busy },
            cancelProps: { loading: busy },
            closeOnConfirm: false,
            onConfirm: setBookCover,
        });

    return (
        <Tooltip label={t("book.actions.setCover.title")}>
            <ActionIcon {...props}
                onClick={openDeleteModal}>
                <IconSetImage height={16} style={{ color: theme.colors.dark[2] }} />
            </ActionIcon>
        </Tooltip>

    );
}

SetCoverButton.propTypes = {
    libraryId: PropTypes.string,
    bookId: PropTypes.string,
    file: PropTypes.shape({
        links: PropTypes.shape({
            download: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    t: PropTypes.any,
    onComplete: PropTypes.func,
    content: PropTypes.shape({
        id: PropTypes.number,
        fileName: PropTypes.string
    })
};

export default SetCoverButton;
