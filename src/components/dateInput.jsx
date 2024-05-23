import React from 'react';
import dayjs from "dayjs";

// 3rd party libraries
import { DatePicker } from "antd";

// -------------------------------------------------

const datePickerType = (frequency) => {
    switch (frequency) {
        case "Weekly":
            return "week";
        case "Monthly":
            return "month";
        case "Quarterly":
            return "quarter";
        case "Annually":
            return "year";
        case "Daily":
        case "FortNightly":
        default:
            return "date";
    }
};
// -------------------------------------------------

const normalizeDate = (value) => dayjs(value);

// -------------------------------------------------

const DateInput = ({ value, onChange, placeholder, frequency, allowFutureValues = true }) => {
    return (
        <DatePicker
            placeholder={placeholder}
            picker={datePickerType(frequency)}
            value={normalizeDate(value)}
            onChange={(val) => onChange(val)}
            disabledDate={(current) => {
                if (allowFutureValues) return false;
                return dayjs() <= current;
            }}
        />
    );
};

export default DateInput;
