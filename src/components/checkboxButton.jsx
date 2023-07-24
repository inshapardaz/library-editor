// 3rd party imports
import { Button, Checkbox } from "antd";

// ----------------------------------------------

export default function CheckboxButton({
    checked,
    indeterminate,
    onChange,
    type,
    disabled
}) {
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
}
