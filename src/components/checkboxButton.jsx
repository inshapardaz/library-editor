// 3rd party imports
import { Button, Checkbox } from "antd";

// ----------------------------------------------

export default function CheckboxButton({
    checked,
    indeterminate,
    onChange,
    type,
}) {
    return (
        <Button type={type} onClick={onChange}>
            <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={onChange}
            />
        </Button>
    );
}
