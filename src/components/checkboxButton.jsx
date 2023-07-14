// 3rd party imports
import { Button, Checkbox } from "antd";
import {
    FaRegCheckSquare,
    FaRegMinusSquare,
    FaRegSquare,
} from "react-icons/fa";

// ----------------------------------------------

export default function CheckboxButton({
    checked,
    indeterminate,
    onChange,
    type,
}) {
    const icon = indeterminate ? (
        <FaRegMinusSquare />
    ) : checked ? (
        <FaRegCheckSquare />
    ) : (
        <FaRegSquare />
    );
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
