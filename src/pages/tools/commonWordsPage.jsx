import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Ui Library Import
import { Card } from "@mantine/core";

// Local Imports
import { selectedLanguage } from '@/store/slices/uiSlice'
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import CommonWordsList from "@/components/commonWords/commonWordsList";
import CommonWordEditButton from "../../components/commonWords/commonWordEditButton";
//----------------------------------
const CommonWordPage = () => {
    const { t } = useTranslation();
    const defaultLanguage = useSelector(selectedLanguage)

    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const language = searchParams.get("language") ?? defaultLanguage.key;
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

    return (<>
        <PageHeader
            title={t('commonWords.title')}
            defaultIcon={IconNames.Series}
            breadcrumbs={[
                { title: t('header.home'), href: `/`, icon: IconNames.Home },
                { title: t('commonWords.title'), icon: IconNames.SpellCheck }
            ]} actions={<>
                <CommonWordEditButton t={t} createNew showLabel language={language} variant="default" color="gray" />
            </>} />
        <Card withBorder mx="md">
            <CommonWordsList
                query={query}
                language={language}
                pageNumber={pageNumber}
                pageSize={pageSize}
                showSearch />
        </Card>
    </>);
}

export default CommonWordPage;