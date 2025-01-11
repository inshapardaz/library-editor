import PropTypes from 'prop-types';

// Ui library import
import { ActionIcon, Tooltip } from "@mantine/core"

// Local imports
//---------------------------------
const CheckboxButton = ({ tooltip, icon, onClick, checked, variant = "default", ...props }) => {
    const button = (<ActionIcon {...props} variant={checked ? "light" : variant} color="gray" aria-label={tooltip}
        onClick={() => onClick(!checked)}>
        {icon}
    </ActionIcon>);
    if (tooltip) {
        return (<Tooltip label={tooltip}>
            {button}
        </Tooltip>)
    }
    return button;
}

CheckboxButton.propTypes = {
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    checked: PropTypes.bool,
    variant: PropTypes.string,
    icon: PropTypes.any
}
export default CheckboxButton;