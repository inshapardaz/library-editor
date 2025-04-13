import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 3rd part library
import { Container, Title, Text, Button, Group } from '@mantine/core';

// Local imports
import classes from './error500.module.css';
//--------------------------------

const Erro500Page = () => {
    const { t } = useTranslation();
    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.label}>500</div>
                <Title className={classes.title}>{t('500.title')}</Title>
                <Text size="lg" ta="center" className={classes.description}>
                    {t('500.description')}
                </Text>
                <Group justify="center">
                    <Button variant="white" size="md" component={Link} to="/">
                        {t('500.action')}
                    </Button>
                </Group>
            </Container>
        </div>
    );
}

export default Erro500Page;
