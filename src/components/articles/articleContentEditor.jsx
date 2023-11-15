import { useNavigate } from "react-router-dom";

// 3rd Party Imports
import { Alert, App, Button, Col, Input, Row } from "antd";
import { useSelector } from 'react-redux';

// Local Imports
import { useGetArticleContentsQuery, useAddArticleContentsMutation, useUpdateArticleContentsMutation } from "../../features/api/articlesSlice";
import { selectedLanguage } from '../../features/ui/uiSlice';
import LanguageSelect from '../languageSelect';
import { useEffect, useState } from "react";
import Error from "../common/error";
import { FaSave } from "react-icons/fa";

//-------------------------------------------
const { TextArea } = Input;
//-------------------------------------------

const ArticleContentEditor = ({ libraryId, article, t }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const lang = useSelector(selectedLanguage);
    const [language, setLanguage] = useState(lang.key);
    const { data: articleContents, error, isFetching, isSuccess } = useGetArticleContentsQuery({ libraryId, articleId : article.id, language: language }, { skip: !libraryId || !article || !language });
    const [contents, setContents] = useState('');
    const [ addArticleContents, { isLoading: isAdding }] = useAddArticleContentsMutation();
    const [ updateArticleContents, { isLoading: isUpdating }] = useUpdateArticleContentsMutation();

    const onSubmit = async () => {
        if (articleContents) {
            updateArticleContents({ libraryId, articleId : article.id, language: language, payload: contents })
                .unwrap()
                .then(() => message.success(t("article.actions.edit.success")))
                .catch((_) => message.error(t("article.actions.edit.error")));
        } else {
            addArticleContents({ libraryId, articleId: article.id, language: language, payload: contents })
                .unwrap()
                .then(() => message.success(t("article.actions.add.success")))
                .catch((_) => message.error(t("article.actions.add.error")));
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setContents(articleContents.text);
        }
    }, [ articleContents, isSuccess]);

    if (error && error.status === '500') return <Error t={t} />;


    return (<>
        <Row gutter={[16, 24]}>
            <Col gutter={[16, 24]} span={20}>
                <Button.Group size="large">
                    <LanguageSelect
                        value={language}
                        style={{ width: 120 }}
                        onChange={(val) => setLanguage(val)}
                        disabled={ isFetching | isAdding | isUpdating }
                    />
                    <Button onClick={onSubmit} icon={<FaSave />}
                        disabled={ isFetching | isAdding | isUpdating }>
                        {t("actions.save")}
                    </Button>
                    <Button onClick={() => navigate(-1)}
                        disabled={ isFetching | isAdding | isUpdating }>
                        {t("actions.cancel")}
                    </Button>
                </Button.Group>
            </Col>
            <Col span={24}>
                { error && error.status === 404 &&
                    <Alert message={t('article.messages.newContent')} type="warning" closable showIcon banner /> }
                <TextArea value={contents}
                    onChange={v => setContents(v.target.value)}
                    disabled={ isFetching | isAdding | isUpdating } />
            </Col>
        </Row>
    </>);
};

export default ArticleContentEditor;
