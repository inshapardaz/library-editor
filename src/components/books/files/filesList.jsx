// 3rd party libraries
import { App, Button, Col, List, Row, Skeleton, Typography } from "antd";
import { FaBook } from "react-icons/fa";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Internal Imports
import {
    useGetBookChaptersQuery,
    useUpdateChapterSequenceMutation,
} from "../../../features/api/booksSlice";
import ChapterListItem from "../chapters/chapterListItem";
import ChapterEditor from "../chapters/chapterEditor";
import DataContainer from "../../layout/dataContainer";

// ------------------------------------------------------

const FilesList = ({
    libraryId,
    bookId,
    t,
    selectedChapterNumber = null,
    size = "default",
    hideTitle = false,
}) => {
    const { message } = App.useApp();

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

    const header = (
        <Row>
            <Col flex="auto">
                <Typography level={3}>{title}</Typography>
            </Col>
            <Col>
                <ChapterEditor
                    libraryId={libraryId}
                    bookId={bookId}
                    t={t}
                    buttonType="dashed"
                />
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
                                                selectedChapterNumber ===
                                                chapter.chapterNumber
                                            }
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

export default FilesList;
