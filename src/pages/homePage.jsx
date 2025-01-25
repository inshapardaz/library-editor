import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// UI library Imports
import { Button, Card, Container } from '@mantine/core';

// Local imports
import LibrariesList from '@/components/library/librariesList';
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconAdd } from '@/components/icons';
// ------------------------------------------------------------------

const HomePage = () => {
  const { t } = useTranslation();
  return (<Container fluid mt="sm">
    <PageHeader title={t('header.libraries')} defaultIcon={IconNames.Library}
      actions={[
        <Button key="add-library" variant='default' component={Link} to="/libraries/add" leftSection={<IconAdd />}>{t('library.actions.add.title')}</Button>
      ]} />
    <Card withBorder>
      <LibrariesList />
    </Card>
  </Container>
  )
}

export default HomePage;
