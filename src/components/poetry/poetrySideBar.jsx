import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import { Badge, Card, Center, Divider, NavLink, SimpleGrid, Skeleton, useMantineTheme } from '@mantine/core';

// Local imports
import { useGetCategoriesQuery } from '@/store/slices/categories.api';
import { IconCategory, IconFavorite, IconPoetries } from '@/components/icons';

//----------------------------------------------
const PoetrySidebar = ({ selectedCategory, favorite, read }) => {
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
            to={`/libraries/${libraryId}/poetry?favorite=true`}
            active={favorite}
            label={t('poetries.favorites')}
            leftSection={<IconFavorite style={{ color: theme.colors.red[9] }} />}
        />
        <NavLink
            key="read"
            component={Link}
            to={`/libraries/${libraryId}/poetry?read=true`}
            active={read}
            label={t('poetries.lastRead')}
            leftSection={<IconPoetries style={{ color: theme.colors.green[9] }} />}
        />
        <Divider />
        <NavLink
            key="all-writings"
            component={Link}
            to={`/libraries/${libraryId}/poetry`}
            label={t('poetries.all')}
            active={!selectedCategory && !favorite && !read}
            leftPortry={<IconPoetries style={{ color: theme.colors.blue[9] }} />}
        />
        <Divider />
        {
            categories.data.filter(c => c.poetryCount > 0).map(category => (<NavLink
                key={category.id}
                component={Link}
                active={selectedCategory == category.id}
                to={`/libraries/${libraryId}/poetry?category=${category.id}`}
                label={category.name}
                rightSection={
                    <Badge size="xs" color='gray' circle>
                        {category.poetryCount}
                    </Badge>
                }
                leftSection={<IconCategory />}
            />))
        }
    </Card>);
}

PoetrySidebar.propTypes = {
    selectedCategory: PropTypes.string,
    favorite: PropTypes.string,
    read: PropTypes.string,
};

export default PoetrySidebar;