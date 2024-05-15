import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Spin } from "antd";
import { ImLibrary } from "react-icons/im";
import { FaPencilAlt } from "react-icons/fa";

// Local Imports
import * as styles from '~/src/styles/common.module.scss'

import { useGetLibraryQuery } from '~/src/store/slices/librariesSlice'
import ContentsContainer from '~/src/components/layout/contentContainer';
import LatestBooks from "~/src/components/books/latestBooks";
import EditingBooks from "~/src/components/books/editingBooks";
import PageHeader from "~/src/components/layout/pageHeader";

// -------------------------------------------------------

const LibraryHome = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams()
    const { data: library, isFetching } = useGetLibraryQuery({ libraryId }, { skip: libraryId === null })

    if (isFetching) {
        return <Spin />
    }

    const editButton = (
        <Link to={`/libraries/${libraryId}/edit`}>
            <Button type="dashed" icon={<FaPencilAlt />}>
                {t("actions.edit")}
            </Button>
        </Link>
    );

    return (<>
        <div className={styles.home} />
        <PageHeader title={library?.name} icon={<ImLibrary />} actions={editButton} />
        <ContentsContainer>
            <EditingBooks status="BeingTyped" />
            <EditingBooks status="ProofRead" />
            <LatestBooks />
        </ContentsContainer>
    </>);
}

export default LibraryHome;
