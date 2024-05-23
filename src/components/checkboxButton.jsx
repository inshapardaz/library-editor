import React from 'react';

// 3rd party imports
import { Button, Checkbox } from "antd";

// ----------------------------------------------

const CheckboxButton = ({
    checked,
    indeterminate,
    onChange,
    type,
    disabled
}) => {
    return (
        <Button type={type} disabled={disabled}>
            <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={onChange}
                disabled={disabled}
            />
        </Button>
    );
};

export default CheckboxButton;
