import { useState } from "react";

// 3rd party libraries
import { App, Button, Col, List, Row, Skeleton, Typography } from "antd";
import { FaBook } from "react-icons/fa";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Internal Imports
import {
    useGetBookChaptersQuery,
    useUpdateChapterSequenceMutation,
} from "../../../features/api/booksSlice";
import ChapterListItem from "./chapterListItem";
import ChapterEditor from "./chapterEditor";
import ChapterAssignButton from "./chapterAssignButton";
import DataContainer from "../../layout/dataContainer";
import CheckboxButton from "../../checkboxButton";
import ChapterDeleteButton from "./chapterDeleteButton";
import ChapterStatusButton from "./chapterStatusButton";

// ------------------------------------------------------

const ChaptersList = ({
    libraryId,
    bookId,
    t,
    size = "default",
    hideTitle = false,
}) => {
    const { message } = App.useApp();
    const [selection, setSelection] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const {
        refetch,
        data: chapters,
        error,
        isFetching,
    } = useGetBookChaptersQuery(
        { libraryId, bookId },
        { skip: !libraryId || !bookId }
    );
    const [updateChapterSequence, { isLoading: isUpdating }] =
        useUpdateChapterSequenceMutation();

    const title = hideTitle ? null : <div>{t("book.chapters.title")}</div>;

    if (isFetching) return <Skeleton />;

    const onDragDrop = (result) => {
        const fromIndex = result.source.index;
        const toIndex = result.destination.index;
        let payload = [...chapters.data];
        if (fromIndex !== toIndex) {
            const element = payload[fromIndex];
            payload.splice(fromIndex, 1);
            payload.splice(toIndex, 0, element);

            payload = payload.map((item, index) => ({
                id: item.id,
                chapterNumber: index + 1,
            }));

            return updateChapterSequence({ libraryId, bookId, payload })
                .unwrap()
                .then(() =>
                    message.success(t("chapter.actions.reorder.success"))
                )
                .catch((_) =>
                    message.error(t("chapter.actions.reorder.error"))
                );
        }
    };

    //------------------------------------------------------
    const onSelectChanged = (c) => {
        const currentIndex = selection.indexOf(c.chapterNumber);
        const newSelection = [...selection];

        if (currentIndex === -1) {
            newSelection.push(c.chapterNumber);
        } else {
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedChapters(
            chapters.data.filter((p) => newSelection.includes(p.chapterNumber))
        );
    };

    const onSelectAll = () => {
        if (selection.length === chapters.data.length) {
            setSelection([]);
            setSelectedChapters([]);
        } else {
            setSelection(chapters.data.map((p) => p.chapterNumber));
            setSelectedChapters(chapters.data.map((p) => p.chapterNumber));
        }
    };

    const hasAllSelected = selection.length === chapters.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < chapters.data.length;
    //------------------------------------------------------

    const header = (
        <Row gutter={8}>
            <Col>
                <Typography level={3}>{title}</Typography>
            </Col>
            <Col>
                <Button.Group>
                    <CheckboxButton
                        onChange={onSelectAll}
                        checked={hasAllSelected}
                        indeterminate={hasPartialSelection}
                    />
                    <ChapterEditor
                        libraryId={libraryId}
                        bookId={bookId}
                        t={t}
                    />
                    <ChapterDeleteButton chapters={selectedChapters} t={t} />
                    <ChapterAssignButton
                        libraryId={libraryId}
                        chapters={selectedChapters}
                        t={t}
                    />
                    <ChapterStatusButton
                        libraryId={libraryId}
                        chapters={selectedChapters}
                        t={t}
                    />
                </Button.Group>
            </Col>
        </Row>
    );
    return (
        <>
            <DataContainer
                busy={isFetching | isUpdating}
                error={error}
                errorTitle={t("chapters.errors.loading.title")}
                errorSubTitle={t("chapters.errors.loading.subTitle")}
                errorAction={
                    <Button type="default" onClick={refetch}>
                        {t("actions.retry")}
                    </Button>
                }
                emptyImage={<FaBook size="5em" />}
                emptyDescription={t("chapters.empty.title")}
                emptyContent={
                    <ChapterEditor
                        libraryId={libraryId}
                        bookId={bookId}
                        t={t}
                        buttonType="dashed"
                    />
                }
                empty={chapters && chapters.data && chapters.data.length < 1}
                bordered={false}
            >
                <DragDropContext onDragEnd={onDragDrop}>
                    <Droppable droppableId={`Droppable_${bookId}`}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <List
                                    size={size}
                                    itemLayout="horizontal"
                                    dataSource={chapters ? chapters.data : []}
                                    header={header}
                                    renderItem={(chapter) => (
                                        <ChapterListItem
                                            key={chapter.id}
                                            t={t}
                                            selected={
                                                selection.indexOf(
                                                    chapter.chapterNumber
                                                ) >= 0
                                            }
                                            onSelectChanged={onSelectChanged}
                                            libraryId={libraryId}
                                            bookId={bookId}
                                            chapter={chapter}
                                        />
                                    )}
                                >
                                    {provided.placeholder}
                                </List>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </DataContainer>
        </>
    );
};

export default ChaptersList;
