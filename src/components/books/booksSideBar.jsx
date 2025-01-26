import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import { Badge, Card, Center, Divider, NavLink, SimpleGrid, Skeleton, useMantineTheme } from '@mantine/core';

// Local imports
import { useGetCategoriesQuery } from '@/store/slices/categories.api';
import { IconCategory, IconFavorite, IconBook, IconBooks } from '@/components/icons';
import { BookStatus } from '@/models';
//----------------------------------------------
const BooksSideBar = ({ status, selectedCategory, favorite, read }) => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const theme = useMantineTheme();

    const isStatusTyping = useMemo(() => status === BookStatus.BeingTyped, [status]);
    const isStatusProofRead = useMemo(() => status === BookStatus.ProofRead, [status]);

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
            to={`/libraries/${libraryId}/books?favorite=true`}
            active={favorite}
            label={t('book.favorites')}
            leftSection={<IconFavorite style={{ color: theme.colors.red[9] }} />}
        />
        <NavLink
            key="read"
            component={Link}
            to={`/libraries/${libraryId}/books?read=true`}
            active={read}
            label={t('book.lastRead')}
            leftSection={<IconBook style={{ color: theme.colors.green[9] }} />}
        />
        <Divider />
        <NavLink
            key="typing"
            component={Link}
            to={`/libraries/${libraryId}/books?status=BeingTyped`}
            active={isStatusTyping}
            label={t('book.beingTyped')}
            leftSection={<IconBook style={{ color: theme.colors.blue[9] }} />}
        />
        <NavLink
            key="proofread"
            component={Link}
            to={`/libraries/${libraryId}/books?status=ProofRead`}
            active={isStatusProofRead}
            label={t('book.beingProofRead')}
            leftSection={<IconBook style={{ color: theme.colors.yellow[9] }} />}
        />

        <Divider />
        <NavLink
            key="all-books"
            component={Link}
            to={`/libraries/${libraryId}/books`}
            label={t('books.allBooks')}
            active={!selectedCategory && !favorite && !read && !isStatusProofRead && !isStatusTyping}
            leftSection={<IconBooks style={{ color: theme.colors.blue[9] }} />}
        />
        <Divider />
        {
            categories.data.filter(c => c.bookCount > 0).map(category => (<NavLink
                key={category.id}
                component={Link}
                active={selectedCategory == category.id}
                to={`/libraries/${libraryId}/books?category=${category.id}`}
                label={category.name}
                rightSection={
                    <Badge size="xs" color='gray' circle>
                        {category.bookCount}
                    </Badge>
                }
                leftSection={<IconCategory />}
            />))
        }
    </Card>);
}

BooksSideBar.propTypes = {
    status: PropTypes.string,
    selectedCategory: PropTypes.string,
    favorite: PropTypes.string,
    read: PropTypes.string,
};

export default BooksSideBar;