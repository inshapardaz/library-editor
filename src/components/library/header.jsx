import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Import
import cx from 'clsx';
import { Title, Text, Container, Button, Overlay, Space } from '@mantine/core';

// Local import
import classes from './header.module.css';
import { LibraryContext } from '@/contexts'
//-------------------------

const LibraryHeader = () => {
    const { t } = useTranslation();
    const { library } = useContext(LibraryContext);

    if (!library) return null;

    return (
        <div className={classes.wrapper}>
            <Overlay color="#000" opacity={0.65} zIndex={1} />

            <div className={classes.inner}>
                <Title className={classes.title}>
                    {library.name}
                </Title>

                <Container size={640}>
                    <Text size="lg" className={classes.description}>
                        {library.description}
                    </Text>
                </Container>

                <div className={classes.controls}>
                    <Button className={classes.control} variant="white" size="lg" component={Link} to={`/libraries/${library.id}/books`}>
                        {t('header.books')}
                    </Button>
                    <Space w="md" />
                    <Button className={cx(classes.control, classes.secondaryControl)} size="lg" component={Link} to={`/libraries/${library.id}/writings`}>
                        {t('header.writings')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LibraryHeader;