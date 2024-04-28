import { useParams } from "react-router-dom";

// 3rd party libraries
import { Spin } from "antd";

// Local Imports
import * as styles from '~/src/styles/common.module.scss'

import ContentsContainer from '~/src/components/layout/contentContainer';
import LatestBooks from "~/src/components/books/latestBooks";
import EditingBooks from "~/src/components/books/editingBooks";
import { useGetLibraryQuery } from '~/src/store/slices/librariesSlice'

// -------------------------------------------------------

const LibraryHome = () => {
  const { libraryId } = useParams()
  const { isFetching } = useGetLibraryQuery({ libraryId }, { skip: libraryId === null })

  if (isFetching) {
    return <Spin />
  }

  return (<>
    <div className={styles.home} />
    <ContentsContainer>
      <EditingBooks status="BeingTyped" />
      <EditingBooks status="ProofRead" />
      <LatestBooks />
    </ContentsContainer>
  </>);
}

export default LibraryHome;
