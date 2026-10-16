// Ui Library Imports
import { Container, Group } from '@mantine/core';

// Local Imports
import Logo from '../logo';
import LanguageSwitch from './languageSwitch';
import DarkModeToggle from './darkModeToggle';
import AppearanceMenu from './appearanceMenu';

import classes from './appFooter.module.css';
//----------------------------------------------

const AppFooter = () => {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Logo showName={false} />
        <Group>
          <LanguageSwitch />
          <AppearanceMenu />
                        <DarkModeToggle />
        </Group>
      </Container>
    </div>
  );
}


export default AppFooter;