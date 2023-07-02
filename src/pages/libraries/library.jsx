import { useParams } from "react-router-dom";

// 3rd party libraries
import { Spin } from "antd";

// Local Imports
import ContentsContainer from '../../components/layout/contentContainer';
import LatestBooks from "../../components/books/latestBooks";
import EditingBooks from "../../components/books/editingBooks";
import { useGetLibraryQuery }  from '../../features/api/librariesSlice'

import styles from '../../styles/common.module.scss'
// -------------------------------------------------------

const LibraryHome = () => {
  const { libraryId } = useParams()
  const { isFetching  } = useGetLibraryQuery({libraryId}, { skip : libraryId === null})

  if (isFetching) {
    return <Spin />
  }

  return (<>
    <div className={styles.home}/>
    <ContentsContainer>
      <EditingBooks status="BeingTyped" />
      <EditingBooks status="ProofRead" />
      <LatestBooks />
    </ContentsContainer>
  </>);
}

export default LibraryHome;
