import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ui library 
import { Overlay, Container, Title, Button, Text } from '@mantine/core';

// Local imports
import classes from './homePage.module.css';

// ------------------------------------------------------------------

const HomePage = () => {
  const { t } = useTranslation();
  return (<>
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>
          {t('app')}
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          {t('slogan')}
        </Text>

        <Button variant="gradient" size="xl" radius="xl" className={classes.control}
          component={Link} to="https://libraries.nawishta.co.uk/">
          {t('actions.seeMore')}
        </Button>
      </Container>
    </div>
  </>)
}

export default HomePage;
