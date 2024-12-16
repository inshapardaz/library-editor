import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Import
import { Group, Text, Tooltip } from "@mantine/core";

// Local imports
//-----------------------------------------

const IconText = ({ text, icon, link, tooltip, size = 'md', type = 'dimmed', ...props }) => {
    if (link) {
        if (tooltip) {
            return (<Tooltip label={tooltip} {...props}>
                <Group wrap='nowrap' component={Link} to={link} gap="sm" style={{ textDecoration: 'none' }}>
                    {icon}
                    <Text truncate="end" c={type} size={size}>{text}</Text>
                </Group>
            </Tooltip>);
        }

        return (<Group wrap='nowrap' component={Link} to={link} gap="sm" style={{ textDecoration: 'none' }} {...props}>
            {icon}
            <Text truncate="end" c={type} size={size}>{text}</Text>
        </Group>);
    }

    if (tooltip) {
        return (<Tooltip label={tooltip} {...props}>
            <Group gap="sm">
                {icon}
                <Text c={type} size={size}>{text}</Text>
            </Group>
        </Tooltip>)
    }

    return (<Group gap="sm" {...props}>
        {icon}
        <Text c={type} size={size}>{text}</Text>
    </Group>);
}

IconText.propTypes = {
    icon: PropTypes.object,
    link: PropTypes.string,
    text: PropTypes.any,
    tooltip: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.string
};

export default IconText;