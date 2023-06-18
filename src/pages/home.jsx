import { useTranslation } from 'react-i18next';

// 3rd part imports
import { Button, Typography, theme } from 'antd'
import { GiRead } from 'react-icons/gi'

// Local imports
import styles from '../styles/common.module.scss'
import HeroImage from '../components/heroImage';
import LibrariesList from '../components/libraries/list';
import ContentsContainer from '../components/layout/contentContainer';

// ------------------------------------------------------------------

const Home = () => {
  const { t } = useTranslation()
  const { token } = theme.useToken();
  return (<>
    <HeroImage>
      <Typography.Title level={1} style={{ color: token.colorTextLightSolid }}>{t('app')}</Typography.Title>
      <div className={styles.hero__content}>
          <p>{t('home.welcome')}</p>
          <Button type="primary" icon={<GiRead />}> {t('home.gettingStarted')}</Button>
      </div>
    </HeroImage>
    <ContentsContainer>
      <LibrariesList />
    </ContentsContainer>
  </>)
}

export default Home;
