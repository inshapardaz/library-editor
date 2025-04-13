import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Ui Library Import
import { Card } from "@mantine/core";

// Local Imports
import { selectedLanguage } from '@/store/slices/uiSlice'
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import CorrectionsList from "@/components/corrections/correctionsList";
import CorrectionEditButton from "@/components/corrections/correctionEditButton";
//----------------------------------
const CorrectionsPage = () => {
    const { t } = useTranslation();
    const defaultLanguage = useSelector(selectedLanguage)
    const { profile = 'autocorrect' } = useParams();

    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const language = searchParams.get("language") ?? defaultLanguage.key;
    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

    return (<>
        <PageHeader
            title={t('corrections.title')}
            defaultIcon={IconNames.Series}
            breadcrumbs={[
                { title: t('header.home'), href: `/`, icon: IconNames.Home },
                { title: t('corrections.title'), icon: IconNames.SpellCheck }
            ]} actions={<>
                <CorrectionEditButton t={t} createNew showLabel profile={profile} language={language} variant="default" color="gray" />
            </>} />
        <Card withBorder mx="md">
            <CorrectionsList
                profile={profile}
                query={query}
                language={language}
                pageNumber={pageNumber}
                pageSize={pageSize}
                showSearch />
        </Card>
    </>);
}

export default CorrectionsPage;