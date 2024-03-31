import { useNavigate } from "react-router-dom";

// 3rd Party Imports
import { Alert, App, Button, Col, Row } from "antd";
import { useSelector } from 'react-redux';

// Local Imports
import { useGetArticleContentsQuery, useAddArticleContentsMutation, useUpdateArticleContentsMutation } from "../../features/api/articlesSlice";
import { selectedLanguage } from '../../features/ui/uiSlice';
import LanguageSelect from '../languageSelect';
import { useEffect, useState } from "react";
import Error from "../common/error";
import { FaSave } from "react-icons/fa";
import ArticleLayoutSelect from "./articleLayoutSelect";
import { useLocation, useSearchParams } from "react-router-dom/dist";
import helpers from "../../helpers";
import TextEditor from "../textEditor";

//-------------------------------------------

const ArticleContentEditor = ({ libraryId, article, t }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const lang = useSelector(selectedLanguage);
    const searchLang = searchParams.get("language") ?? lang.key;
    const [layout, setLayout] = useState('normal');
    const { data: articleContents, error, isFetching }
        = useGetArticleContentsQuery(
            { libraryId, articleId: article.id, language: searchLang },
            { skip: !libraryId || !article || !searchLang });
    const [contents, setContents] = useState('');
    const [addArticleContents, { isLoading: isAdding }] = useAddArticleContentsMutation();
    const [updateArticleContents, { isLoading: isUpdating }] = useUpdateArticleContentsMutation();
    const [saved, setSaved] = useState(articleContents);
    const onSubmit = async () => {
        if (saved || articleContents) {
            updateArticleContents({ libraryId, articleId: article.id, language: searchLang, layout: layout, payload: contents })
                .unwrap()
                .then(() => message.success(t("article.actions.edit.success")))
                .catch((_) => message.error(t("article.actions.edit.error")));
        } else {
            addArticleContents({ libraryId, articleId: article.id, language: searchLang, layout: layout, payload: contents })
                .unwrap()
                .then(() => message.success(t("article.actions.add.success")))
                .then(_ => setSaved(true))
                .catch((_) => message.error(t("article.actions.add.error")));
        }
    };

    const onSave = (c) => {
        console.log(c)
        setContents(c)
    }

    useEffect(() => {
        if (!error && articleContents) {
            setContents(articleContents.text);
        } else {
            setSaved(false);
            setContents('');
        }

    }, [articleContents, error, searchLang]);

    if (error && error.status === '500') return <Error t={t} />;


    return (<>
        <Row gutter={[16, 24]}>
            <Col gutter={[16, 24]} span={20}>
                <Button.Group size="large">
                    <LanguageSelect
                        value={searchLang}
                        style={{ width: 120 }}
                        onChange={(val) => navigate(helpers.updateLinkToArticlesEditPage(location, {
                            language: val
                        }))}
                        disabled={isFetching | isAdding | isUpdating}
                    />
                    <ArticleLayoutSelect libraryId={libraryId}
                        placeholder={t("article.layout.placeholder")}
                        onChange={(val) => setLayout(val)}
                        value={layout}
                        disabled={isFetching | isAdding | isUpdating}
                        t={t} />
                    <Button onClick={onSubmit} icon={<FaSave />}
                        disabled={isFetching | isAdding | isUpdating}>
                        {t("actions.save")}
                    </Button>
                    <Button onClick={() => navigate(-1)}
                        disabled={isFetching | isAdding | isUpdating}>
                        {t("actions.cancel")}
                    </Button>
                </Button.Group>
            </Col>
            <Col span={24}>
                {error && error.status === 404 &&
                    <Alert message={t('article.messages.newContent')} type="warning" closable showIcon banner />}
                <TextEditor value={articleContents?.text} language={searchLang} onChange={setContents} onSave={onSave} />
            </Col>
        </Row>
    </>);
};

export default ArticleContentEditor;
