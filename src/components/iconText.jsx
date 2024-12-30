import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library Import
import { Button, Group, Text, Tooltip } from "@mantine/core";

// Local imports
//-----------------------------------------

const IconText = ({ text, icon, link, onClick, tooltip, size = 'md', type = 'dimmed', ...props }) => {

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

    if (onClick) {
        if (tooltip) {
            return (<Tooltip label={tooltip}>
                <Button {...props} leftSection={icon} variant='transparent' onClick={onClick}>
                    <Text truncate="end" c={type} size={size}>{text}</Text>
                </Button>
            </Tooltip>);
        }

        return (<Button {...props} leftSection={icon} variant='transparent' onClick={onClick}>
            <Text truncate="end" c={type} size={size}>{text}</Text>
        </Button>);
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
    size: PropTypes.string,
    onClick: PropTypes.func
};

export default IconText;