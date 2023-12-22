import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 3rd party imports
import { App, Button, Spin } from "antd";
import Editor from 'urdu-web-editor'
import { FaCheckCircle, FaSave } from "react-icons/fa";

// Local imports
import {
    useGetChapterQuery,
    useGetChapterContentsQuery,
    useAddChapterContentsMutation,
    useUpdateChapterContentsMutation
} from "../../../features/api/booksSlice";
import { selectedLanguage } from '../../../features/ui/uiSlice'
import PageHeader from "../../../components/layout/pageHeader";
import EditingStatusIcon from "../../../components/editingStatusIcon";
import DataContainer from "../../../components/layout/dataContainer";
import EditingStatus from "../../../models/editingStatus";
// ------------------------------------------

const EMPTY_CONTENT =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';



// ----------------------------------------
const EditChapter = () =>   {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const { libraryId, bookId, chapterNumber } = useParams();
    const [text, setText] = useState("");

    const {
        data: chapter,
        error: chapterError,
        isFetching : loadingChapter,
    } = useGetChapterQuery(
        { libraryId, bookId, chapterNumber },
        { skip: !libraryId || !bookId || !chapterNumber }
    );

    const editorConfiguration =   {
        richText: true,
        language: selectedLanguage?.key ?? 'en',
        toolbar: {
            showAlignment: false,
            showFontFormat: true,
            showInsert: true,
            showExtraFormat: false,
            showInsertLink: false,
        }
    }
    const {
        data: chapterContent,
        error: chapterContentError,
        isFetching : loadingChapterContent,
    } = useGetChapterContentsQuery(
        { libraryId, bookId, chapterNumber },
        { skip: !chapter }
    );

    const [updateChapterContents, { isLoading: isUpdating }] = useUpdateChapterContentsMutation();
    const [addChapterContents, { isLoading: isAdding }] = useAddChapterContentsMutation();

    useEffect(() => {
        setText(chapterContent?.content || "");
    }, [chapterContent]);

    const onSave = async () => {
        console.log('Saving : %s', text);
        if (chapterContentError && chapterContentError.status === 404) {
            addChapterContents({
                chapter: chapter,
                page: text,
            })
                .unwrap()
                .then(() => message.success(t("book.actions.edit.success")))
                .catch((_) => message.error(t("book.actions.edit.error")));
        } else {
            updateChapterContents({
                chapterContent,
                payload: text,
            })
                .unwrap()
                .then(() => message.success(t("book.actions.add.success")))
                .catch((_) => message.error(t("book.actions.add.error")));
        }
    };

    const onComplete = () => {
        if (chapter.status === EditingStatus.Typing) {
            chapter.status = EditingStatus.Typed;
        } else if (chapter.status === EditingStatus.InReview) {
            chapter.status = EditingStatus.Completed;
        } else {
            return;
        }
        onSave();
    };


    const showCompleteButton =
        chapter &&
        (chapter.status === EditingStatus.Typing ||
            chapter.status === EditingStatus.InReview);

    const actions = [
        <Button.Group>
            <Button onClick={onSave}>
                <FaSave />
            </Button>
            {showCompleteButton && (
                <Button onClick={onComplete}>
                    <FaCheckCircle />
                </Button>
            )}
        </Button.Group>,
    ];

    return (
        <>
            <Spin
                spinning={loadingChapter | loadingChapterContent | isAdding | isUpdating}
            >
                <PageHeader
                    title={chapter?.title}
                    icon={
                        <EditingStatusIcon
                            status={chapter && chapter.status}
                            style={{ width: 36, height: 36 }}
                        />
                    }
                    actions={actions}
                />
                <DataContainer error={chapterError | chapterContentError}>
                    <Editor configuration={editorConfiguration}
                        value={chapterContent?.content ?? EMPTY_CONTENT }
                        setValue={(content) => setText(content)}
                    />
                </DataContainer>
            </Spin>
        </>);
}

export default EditChapter;
