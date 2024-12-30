import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

// Ui Library Import
import { Anchor, Group, Pill, useMantineTheme } from "@mantine/core";

// Local imports
import { IconCategory } from '@/components/icons';
import If from '@/components/if';
//-----------------------------------------

const CategoriesList = ({ categories, size, filter = i => i, showIcon = true }) => {
    const { libraryId } = useParams();
    const theme = useMantineTheme();

    if (categories == null || categories.length < 1) return null;
    return (
        <Group>
            <If condition={showIcon}>
                <IconCategory height={size} style={{ color: theme.colors.dark[2] }} />
            </If>
            {categories.filter(filter).map((category) => (
                <Anchor key={category.id} component={Link} to={`/libraries/${libraryId}/books?category=${category.id}`}>
                    <Pill>{category.name}</Pill >
                </Anchor>
            ))}
        </Group>)
}


CategoriesList.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    })),
    filter: PropTypes.func,
    showIcon: PropTypes.bool,
    size: PropTypes.any,
};

export default CategoriesList;