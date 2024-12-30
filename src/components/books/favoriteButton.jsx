import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Ui Library Impports
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { notifications } from '@mantine/notifications';

// Local imports
import { IconFavorite, IconFavoriteFill } from '@/components/icons';
import { useAddBookToFavoriteMutation, useRemoveBookFromFavoriteMutation } from '@/store/slices/books.api';
//---------------------------------------

const FavoriteButton = ({ book, readonly, size }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [addBookToFavorite, { isLoading: isAdding }] = useAddBookToFavoriteMutation();
    const [removeBookFromFavorite, { isLoading: isRemoving }] = useRemoveBookFromFavoriteMutation();

    const onFavorite = () => {
        if (book.links.create_favorite) {
            addBookToFavorite({ book })
                .then(() => {
                    notifications.show({
                        color: 'green',
                        title: t("book.actions.addFavorite.success")
                    })
                })
                .catch((e) => {
                    console.error(e)
                    notifications.show({
                        color: 'red',
                        title: t("book.actions.addFavorite.error")
                    });
                })
        } else if (book.links.remove_favorite) {
            removeBookFromFavorite({ book })
                .then(() => {
                    notifications.show({
                        color: 'green',
                        title: t("book.actions.removeFavorite.success")
                    })
                })
                .catch((e) => {
                    console.error(e)
                    notifications.show({
                        color: 'red',
                        title: t("book.actions.removeFavorite.error")
                    });
                });
        }
    }

    if (readonly) {
        if (book.links.remove_favorite) {
            return (<IconFavoriteFill style={{ color: theme.colors.red[9] }} />);
        }

        return null;
    }

    let icon = null;

    if (book.links.remove_favorite) {
        icon = (<IconFavoriteFill height={size} style={{ color: theme.colors.red[9] }} />);
    }

    if (book.links.create_favorite) {
        icon = (<IconFavorite height={size} style={{ color: theme.colors.dark[3] }} />);
    }

    if (icon) {

        return (<ActionIcon variant="transparent" aria-label="favorite" onClick={onFavorite} loading={isAdding || isRemoving}>
            {icon}
        </ActionIcon>);
    }

    return null;
}

FavoriteButton.propTypes = {
    readonly: PropTypes.bool,
    book: PropTypes.shape({
        id: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            create_favorite: PropTypes.string,
            remove_favorite: PropTypes.string,
        }),
    }),
    size: PropTypes.any,
};


export default FavoriteButton;