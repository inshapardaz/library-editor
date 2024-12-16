import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

// ui library
import { Group, Title } from "@mantine/core";

// local import
import classes from './logo.module.css';

// --------------------------------------------

const Logo = ({ showName = false, title }) => {
    const { t } = useTranslation()
    if (showName) {
        return (
            <Group>
                <i className={classes.logo} />
                <Title order={4} visibleFrom="sm">{title ? title : t('app')}</Title>
            </Group>);
    }

    return (<i className={classes.logo} />);
}

Logo.propTypes = {
    showName: PropTypes.bool,
    title: PropTypes.string
};

export default Logo;