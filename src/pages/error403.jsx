import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 3rd part library
import { Title, Text, Button, Container, Group } from '@mantine/core';

// Local imports
import classes from './error403.module.css';
//--------------------------------

const Erro403Page = () => {
    const { t } = useTranslation();
    return (
        <Container className={classes.root}>
            <div className={classes.label}>403</div>
            <Title className={classes.title}>{t('403.title')}</Title>
            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                {t('403.description')}
            </Text>
            <Group justify="center">
                <Button variant="subtle" size="md" component={Link} to="/">
                    {t('403.action')}
                </Button>
            </Group>
        </Container>
    );
}

export default Erro403Page;
