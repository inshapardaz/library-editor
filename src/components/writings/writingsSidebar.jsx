import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import { Badge, Card, Center, Divider, NavLink, SimpleGrid, Skeleton, useMantineTheme } from '@mantine/core';

// Local imports
import { useGetCategoriesQuery } from '@/store/slices/categories.api';
import { IconCategory, IconFavorite, IconWriting, IconWritings } from '@/components/icons';

//----------------------------------------------
const WritingsSideBar = ({ selectedCategory, favorite, read }) => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const theme = useMantineTheme();

    const { data: categories, isFetching, error }
        = useGetCategoriesQuery({ libraryId }, { skip: libraryId == null });

    if (isFetching) {
        return (<Card withBorder>
            <SimpleGrid
                cols={1}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
                {Array(12).fill(1).map((_, index) => <Skeleton key={index} height={32} />)}
            </SimpleGrid>
        </Card>);
    }

    if (error) {
        return (<Card withBorder>
            <Center maw={400} h={100} bg="var(--mantine-color-gray-light)">

            </Center>
        </Card>)
    }

    if (!categories || !categories.data || categories.data.length < 1) {
        return (<Card withBorder>
            <Center maw={400} h={100} bg="var(--mantine-color-gray-light)">
                {t('categories.empty.title')}
            </Center>
        </Card>)
    }

    return (<Card withBorder>
        <NavLink
            key="favorites"
            component={Link}
            to={`/libraries/${libraryId}/writings?favorite=true`}
            active={favorite}
            label={t('writings.favorites')}
            leftSection={<IconFavorite style={{ color: theme.colors.red[9] }} />}
        />
        <NavLink
            key="read"
            component={Link}
            to={`/libraries/${libraryId}/writings?read=true`}
            active={read}
            label={t('writings.lastRead')}
            leftSection={<IconWriting style={{ color: theme.colors.green[9] }} />}
        />
        <Divider />
        <NavLink
            key="all-writings"
            component={Link}
            to={`/libraries/${libraryId}/writings`}
            label={t('writings.all')}
            active={!selectedCategory && !favorite && !read}
            leftSection={<IconWritings style={{ color: theme.colors.blue[9] }} />}
        />
        <Divider />
        {
            categories.data.filter(c => c.articleCount > 0).map(category => (<NavLink
                key={category.id}
                component={Link}
                active={selectedCategory == category.id}
                to={`/libraries/${libraryId}/writings?category=${category.id}`}
                label={category.name}
                rightSection={
                    <Badge size="xs" color='gray' circle>
                        {category.articleCount}
                    </Badge>
                }
                leftSection={<IconCategory />}
            />))
        }
    </Card>);
}

WritingsSideBar.propTypes = {
    selectedCategory: PropTypes.string,
    favorite: PropTypes.string,
    read: PropTypes.string,
};

export default WritingsSideBar;