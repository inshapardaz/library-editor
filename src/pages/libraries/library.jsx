import React from 'react';
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, Spin } from "antd";
import { ImLibrary } from "/src/icons";
import { FaPencilAlt } from "/src/icons";

// Local Imports
import { useGetLibraryQuery } from '/src/store/slices/librariesSlice'
import ContentsContainer from '/src/components/layout/contentContainer';
import LatestBooks from "/src/components/books/latestBooks";
import EditingBooks from "/src/components/books/editingBooks";
import PageHeader from "/src/components/layout/pageHeader";

// -------------------------------------------------------

const LibraryHome = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams()
    const { data: library, isFetching } = useGetLibraryQuery({ libraryId }, { skip: libraryId === null })

    if (isFetching) {
        return <Spin />
    }

    const editButton = library && library.links.update && (
        <Link to={`/libraries/${libraryId}/edit`}>
            <Button type="dashed" icon={<FaPencilAlt />}>
                {t("actions.edit")}
            </Button>
        </Link>
    );

    return (<>
        <div style={{ marginTop: 50 }} />
        <PageHeader title={library?.name} icon={<ImLibrary size={48} />} actions={editButton} />
        <ContentsContainer>
            <EditingBooks status="BeingTyped" />
            <EditingBooks status="ProofRead" />
            <LatestBooks />
        </ContentsContainer>
    </>);
}

export default LibraryHome;
