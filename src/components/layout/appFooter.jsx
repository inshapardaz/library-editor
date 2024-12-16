// Ui Library Imports
import { Container, Group } from '@mantine/core';

// Local Imports
import Logo from '../logo';
import LanguageSwitch from './languageSwitch';
import DarkModeToggle from './darkModeToggle';

import classes from './appFooter.module.css';
//----------------------------------------------

const AppFooter = () => {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Logo showName={false} />
        <Group>
          <LanguageSwitch />
          <DarkModeToggle />
        </Group>
      </Container>
    </div>
  );
}


export default AppFooter;