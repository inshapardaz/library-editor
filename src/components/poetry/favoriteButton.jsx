import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Ui Library Impports
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { notifications } from '@mantine/notifications';

// Local imports
import { IconFavorite, IconFavoriteFill } from '@/components/icon';
import { useAddArticleToFavoriteMutation, useRemoveArticleFromFavoriteMutation } from '@/store/slices/articles.api';
//---------------------------------------

const FavoriteButton = ({ poetry, size }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();
    const [addArticleToFavorite, { isLoading: isAdding }] = useAddArticleToFavoriteMutation();
    const [removeArticleFromFavorite, { isLoading: isRemoving }] = useRemoveArticleFromFavoriteMutation();

    const onFavorite = () => {
        if (poetry.links.create_favorite) {
            addArticleToFavorite({ article: poetry })
                .then(() => {
                    notifications.show({
                        color: 'green',
                        title: t("poetry.actions.addFavorite.success")
                    })
                })
                .catch((e) => {
                    console.error(e)
                    notifications.show({
                        color: 'red',
                        title: t("poetry.actions.addFavorite.error")
                    });
                })
        } else if (poetry.links.remove_favorite) {
            removeArticleFromFavorite({ article: poetry })
                .then(() => {
                    notifications.show({
                        color: 'green',
                        title: t("poetry.actions.removeFavorite.success")
                    })
                })
                .catch((e) => {
                    console.error(e)
                    notifications.show({
                        color: 'red',
                        title: t("poetry.actions.removeFavorite.error")
                    });
                });
        }
    }
    let icon = null;

    if (poetry.links.remove_favorite) {
        icon = (<IconFavoriteFill height={size} style={{ color: theme.colors.red[9] }} />);
    }

    if (poetry.links.create_favorite) {
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
    poetry: PropTypes.shape({
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