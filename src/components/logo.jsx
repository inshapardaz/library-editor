import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

// ui library
import { Anchor, Group, Title } from "@mantine/core";

// local import
import classes from './logo.module.css';
import { MAIN_SITE } from '@/config';

// --------------------------------------------

const Logo = ({ showName = false, title, home = false }) => {
    const { t } = useTranslation()
    if (showName) {
        return (
            <Group>
                <i className={classes.logo} />
                <Title order={4} visibleFrom="sm">{title ? title : t('app')}</Title>
            </Group>);
    }

    // In the header the logo links to the Nawishta home page (MAIN_SITE)
    if (home) {
        return (
            <Anchor href={MAIN_SITE} aria-label={t('apps.logo')} title={t('apps.logo')}
                display="flex" h="100%" ps="md" pe="xs" style={{ alignItems: 'center' }}>
                <i className={classes.logo} />
            </Anchor>
        );
    }

    return (<i className={classes.logo} />);
}

Logo.propTypes = {
    showName: PropTypes.bool,
    title: PropTypes.string,
    home: PropTypes.bool
};

export default Logo;