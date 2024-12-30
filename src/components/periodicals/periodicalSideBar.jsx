import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// UI library imports
import { Badge, Card, Center, Divider, NavLink, SimpleGrid, Skeleton } from '@mantine/core';

// Local imports
import { useGetIssuesYearsQuery } from '@/store/slices/issues.api';
import { IconAnnually } from '@/components/icons';
import PeriodicalFrequency from '@/models/periodicalFrequency'
//----------------------------------------------
const PeriodicalSideBar = ({ libraryId, periodicalId }) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const year = searchParams.get("year");

    const { data: issueYears, isFetching, error }
        = useGetIssuesYearsQuery({ libraryId, periodicalId },
            { skip: libraryId == null || periodicalId == null });

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

    if (!issueYears || !issueYears.data || issueYears.data.length < 1) {
        return (<Card withBorder m="sm">
            <Center maw={400} h={100} bg="var(--mantine-color-gray-light)">
                {t('issues.empty.title')}
            </Center>
        </Card>)
    }


    return (<Card withBorder>
        <NavLink
            key="frequency-daily"
            component={Link}
            to={`/libraries/${libraryId}/periodicals/${periodicalId}`}
            active={!year}
            label={t('actions.viewAll')}
            leftSection={<IconAnnually frequency={PeriodicalFrequency.Daily} />}
        />
        <Divider />
        {
            issueYears.data.filter(c => c.count > 0)
                .map(issueYear => (<NavLink
                    key={issueYear.year}
                    component={Link}
                    active={year == issueYear.year}
                    to={`/libraries/${libraryId}/periodicals/${periodicalId}?year=${issueYear.year}`}
                    label={issueYear.year}
                    rightSection={
                        <Badge size="xs" color='gray' circle>
                            {issueYear.count}
                        </Badge>
                    }
                    leftSection={<IconAnnually />}
                />))
        }
    </Card>);
}

PeriodicalSideBar.propTypes = {
    libraryId: PropTypes.string,
    periodicalId: PropTypes.string,
};

export default PeriodicalSideBar;