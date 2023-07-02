// Local imports
import LibrariesList from '../components/libraries/list';
import ContentsContainer from '../components/layout/contentContainer';
import styles from '../styles/common.module.scss'

// ------------------------------------------------------------------

const Home = () => {
  return (<>
    <div className={styles.home}/>
    <ContentsContainer>
      <LibrariesList />
    </ContentsContainer>
  </>)
}

export default Home;
