// Local imports
import LibrariesList from '~/src/components/libraries/list';
import ContentsContainer from '~/src/components/layout/contentContainer';
import * as styles from '~/src/styles/common.module.scss'

// ------------------------------------------------------------------

const Home = () => {
  return (<>
    <div className={styles.home} />
    <ContentsContainer>
      <LibrariesList showMore />
    </ContentsContainer>
  </>)
}

export default Home;
