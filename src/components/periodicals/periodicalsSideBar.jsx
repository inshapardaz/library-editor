import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import { Badge, Card, Center, Divider, NavLink, SimpleGrid, Skeleton, useMantineTheme } from '@mantine/core';

// Local imports
import { useGetCategoriesQuery } from '@/store/slices/categories.api';
import { IconCategory, IconPeriodicals } from '@/components/icon';
import PeriodicalFrequency from '@/models/periodicalFrequency'
import FrequencyIcon from './frequencyIcon'
//----------------------------------------------
const PeriodicalsSideBar = ({ selectedCategory, frequency }) => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const theme = useMantineTheme();

    const { data: categories, isFetching, error }
        = useGetCategoriesQuery({ libraryId }, { skip: libraryId == null });

    if (isFetching) {
        return (<Card withBorder m="sm">
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
        return (<Card withBorder m="sm">
            <Center maw={400} h={100} bg="var(--mantine-color-gray-light)">

            </Center>
        </Card>)
    }

    if (!categories || !categories.data || categories.data.length < 1) {
        return (<Card withBorder m="sm">
            <Center maw={400} h={100} bg="var(--mantine-color-gray-light)">
                {t('categories.empty.title')}
            </Center>
        </Card>)
    }

    return (<Card withBorder>
        <NavLink
            key="all-peroidicals"
            component={Link}
            to={`/libraries/${libraryId}/periodicals`}
            label={t('actions.viewAll')}
            active={!selectedCategory && !frequency}
            leftSection={<IconPeriodicals style={{ color: theme.colors.blue[9] }} />}
        />
        <Divider />
        <NavLink
            key="frequency-annually"
            component={Link}
            to={`/libraries/${libraryId}/periodicals?frequency=${PeriodicalFrequency.Annually}`}
            active={frequency === PeriodicalFrequency.Annually}
            label={t('periodical.frequency.annually')}
            leftSection={<FrequencyIcon frequency={PeriodicalFrequency.Annually} />}
        />
        <NavLink
            key="frequency-quarterly"
            component={Link}
            to={`/libraries/${libraryId}/periodicals?frequency=${PeriodicalFrequency.Quarterly}`}
            active={frequency === PeriodicalFrequency.Quarterly}
            label={t('periodical.frequency.quarterly')}
            leftSection={<FrequencyIcon frequency={PeriodicalFrequency.Quarterly} />}
        />
        <NavLink
            key="frequency-monthly"
            component={Link}
            to={`/libraries/${libraryId}/periodicals?frequency=${PeriodicalFrequency.Monthly}`}
            active={frequency === PeriodicalFrequency.Monthly}
            label={t('periodical.frequency.monthly')}
            leftSection={<FrequencyIcon frequency={PeriodicalFrequency.Monthly} />}
        />
        <NavLink
            key="frequency-fortnightly"
            component={Link}
            to={`/libraries/${libraryId}/periodicals?frequency=${PeriodicalFrequency.Fortnightly}`}
            active={frequency === PeriodicalFrequency.Fortnightly}
            label={t('periodical.frequency.fortnightly')}
            leftSection={<FrequencyIcon frequency={PeriodicalFrequency.Fortnightly} />}
        />
        <NavLink
            key="frequency-weekly"
            component={Link}
            to={`/libraries/${libraryId}/periodicals?frequency=${PeriodicalFrequency.Weekly}`}
            active={frequency === PeriodicalFrequency.Weekly}
            label={t('periodical.frequency.weekly')}
            leftSection={<FrequencyIcon frequency={PeriodicalFrequency.Weekly} />}
        />
        <Divider />
        <NavLink
            key="frequency-daily"
            component={Link}
            to={`/libraries/${libraryId}/periodicals?frequency=${PeriodicalFrequency.Daily}`}
            active={frequency === PeriodicalFrequency.Daily}
            label={t('periodical.frequency.daily')}
            leftSection={<FrequencyIcon frequency={PeriodicalFrequency.Daily} />}
        />
        <Divider />
        {
            categories.data.filter(c => c.periodicalCount > 0).map(category => (<NavLink
                key={category.id}
                component={Link}
                active={selectedCategory == category.id}
                to={`/libraries/${libraryId}/periodicals?category=${category.id}`}
                label={category.name}
                rightSection={
                    <Badge size="xs" color='gray' circle>
                        {category.periodicalCount}
                    </Badge>
                }
                leftSection={<IconCategory />}
            />))
        }
    </Card>);
}

PeriodicalsSideBar.propTypes = {
    selectedCategory: PropTypes.string,
    frequency: PropTypes.string,
};

export default PeriodicalsSideBar;