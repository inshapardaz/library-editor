import PropTypes from 'prop-types';

// Ui Library Imports
import { Text, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

// Local imports
import { IconDeleteBook } from '@/components/icon';
import IconText from '@/components/iconText';
import { useDeleteBookMutation } from '@/store/slices/books.api';

//---------------------------------
const BookDeleteButton = ({ book, t, onDeleted = () => { } }) => {
    const theme = useMantineTheme();
    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: t("book.actions.delete.title"),
            centered: true,
            children: (
                <Text size="sm">
                    {t("book.actions.delete.message", { title: book.title })}
                </Text>
            ),
            confirmProps: { color: 'red', loading: isDeleting },
            cancelProps: { loading: isDeleting },
            onConfirm: () => {
                return deleteBook({ book })
                    .unwrap()
                    .then(() => onDeleted())
                    .then(() => {
                        notifications.show({
                            color: 'green',
                            title: t("book.actions.delete.success")
                        })
                    })
                    .catch(() => {
                        notifications.show({
                            color: 'red',
                            title: t("book.actions.delete.error")
                        })
                    });
            },
        });

    return (
        <IconText tooltip={t('actions.delete')} onClick={openDeleteModal} icon={<IconDeleteBook height={16} style={{ color: theme.colors.dark[2] }} />} />)
}

BookDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            udpate: PropTypes.string,
            delete: PropTypes.string,
        })
    })
};

export default BookDeleteButton;