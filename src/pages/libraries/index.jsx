import { useTranslation } from "react-i18next";

// 3rd party libraries
import { ImLibrary } from "react-icons/im";

// Local Imports
import LibrariesList from "../../components/libraries/list";
import PageHeader from "../../components/layout/pageHeader";
import ContentsContainer from "../../components/layout/contentContainer";

// -------------------------------------------------------

const LibrariesHome = () => {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader title={t("libraries.title")} icon={<ImLibrary />} />
            <ContentsContainer>
                <LibrariesList />
            </ContentsContainer>
        </>
    );
};

export default LibrariesHome;
