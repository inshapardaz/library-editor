import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// UI Library Imports
import { Group, Text } from '@mantine/core';

// Local imports
import PeriodicalFrequency from '@/models/periodicalFrequency'
import { IconAnnually, IconQuarterly, IconMonthly, IconFornightly, IconWeekly, IconDaily } from '@/components/icon';

//-----------------------------------
const FrequencyIcon = ({ frequency, showLabel, c, size, ...props }) => {
    const { t } = useTranslation();

    if (showLabel) {
        switch (frequency) {
            case PeriodicalFrequency.Annually:
                return (<Group><IconAnnually {...props} /><Text c={c} size={size}>{t('periodical.frequency.annually')}</Text></Group>)
            case PeriodicalFrequency.Quarterly:
                return (<Group><IconQuarterly {...props} /><Text c={c} size={size}>{t('periodical.frequency.quarterly')}</Text></Group>)
            case PeriodicalFrequency.Monthly:
                return (<Group><IconMonthly {...props} /><Text c={c} size={size}>{t('periodical.frequency.monthly')}</Text></Group>)
            case PeriodicalFrequency.Fortnightly:
                return (<Group><IconFornightly {...props} /><Text c={c} size={size}>{t('periodical.frequency.fortnightly')}</Text></Group>)
            case PeriodicalFrequency.Weekly:
                return (<Group><IconWeekly {...props} /><Text c={c} size={size}>{t('periodical.frequency.weekly')}</Text></Group>)
            case PeriodicalFrequency.Daily:
                return (<Group><IconDaily {...props} /><Text c={c} size={size}>{t('periodical.frequency.daily')}</Text></Group>)
            default:
                return (<Group><IconDaily {...props} /><Text c={c} size={size}>{t('periodical.frequency.unknown')}</Text></Group>)
        }
    }
    switch (frequency) {
        case PeriodicalFrequency.Annually:
            return (<IconAnnually {...props} />)
        case PeriodicalFrequency.Quarterly:
            return (<IconQuarterly {...props} />)
        case PeriodicalFrequency.Monthly:
            return (<IconMonthly {...props} />)
        case PeriodicalFrequency.Fortnightly:
            return (<IconFornightly {...props} />)
        case PeriodicalFrequency.Weekly:
            return (<IconWeekly {...props} />)
        default:
            return (<IconDaily {...props} />)
    }
}


FrequencyIcon.propTypes = {
    frequency: PropTypes.string,
    showLabel: PropTypes.bool,
    c: PropTypes.string,
    size: PropTypes.string,
    props: PropTypes.any,
};

export default FrequencyIcon;