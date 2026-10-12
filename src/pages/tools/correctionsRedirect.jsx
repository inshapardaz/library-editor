import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Local Imports
import { selectedLanguage } from '@/store/slices/uiSlice'
import { correctionsUrl } from '@/utils/languageTools';
//----------------------------------

// The autocorrect and punctuation lists moved to LanguageTools; old links and bookmarks to
// /tools/language/{autocorrect|punctuation} land there instead.
const CorrectionsRedirectPage = () => {
    const defaultLanguage = useSelector(selectedLanguage)
    const { profile = 'autocorrect' } = useParams();
    const [searchParams] = useSearchParams();
    const language = searchParams.get("language") ?? defaultLanguage.key;

    useEffect(() => {
        window.location.replace(correctionsUrl(profile, language));
    }, [profile, language]);

    return null;
}

export default CorrectionsRedirectPage;
