import { useParams } from "react-router-dom";

// 3rd party libraries
import { Spin, Typography } from "antd";

// Local Imports
import styles from '../../styles/common.module.scss'
import ContentsContainer from '../../components/layout/contentContainer';
import HeroImage from "../../components/heroImage";
import SearchBox from "../../components/searchBox";
import LatestBooks from "../../components/books/latestBooks";
import { useGetLibraryQuery }  from '../../features/api/librariesSlice'

// -------------------------------------------------------

const LibraryHome = () => {
  const { libraryId } = useParams()
  const { data: library, isFetching  } = useGetLibraryQuery({libraryId}, { skip : libraryId === null})

  if (isFetching) {
    return <Spin />
  }

  return (<>
    <HeroImage>
      <Typography.Title level={1} className={styles.hero__title} >{library ? library.name : ''}</Typography.Title>
      <div className={styles.hero__content}>
        <SearchBox />
      </div>
    </HeroImage>
    <ContentsContainer>
      <LatestBooks />
    </ContentsContainer>
  </>);
}

export default LibraryHome;
