import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// UI libraryimport
import { DatePickerInput, MonthPickerInput, YearPickerInput } from "@mantine/dates";

// Local Imports
import { PeriodicalFrequency } from '@/models';
// -------------------------------------------------

const normalizeDate = (value) => dayjs(value);
//-------------------------------------
const IssueDatePicker = ({ frequency, defaultValue, onChange, ...props }) => {
    if (frequency == PeriodicalFrequency.Annually) {
        return <YearPickerInput {...props} maxDate={new Date()} />
    } else if (frequency == PeriodicalFrequency.Quarterly) {
        return (<DatePickerInput  {...props} maxDate={new Date()} />);
    }
    else if (frequency == PeriodicalFrequency.Monthly) {
        return <MonthPickerInput {...props} maxDate={new Date()}
            value={normalizeDate(defaultValue)}
            onChange={onChange}
        />
    }
    else if (frequency == PeriodicalFrequency.Fortnightly) {
        return (<DatePickerInput  {...props} maxDate={new Date()} />);
    }
    else if (frequency == PeriodicalFrequency.Weekly) {
        return (<DatePickerInput  {...props} maxDate={new Date()} />);
    }
    else if (frequency == PeriodicalFrequency.Daily) {
        return <DatePickerInput {...props} maxDate={new Date()} />
    }

    return (<DatePickerInput  {...props}
        maxDate={new Date()}
    />);
}

IssueDatePicker.propTypes = {
    frequency: PropTypes.string,
    defaultValue: PropTypes.date,
    onChange: PropTypes.func,
};

export default IssueDatePicker;