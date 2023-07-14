import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { App, Button, Col, List, Radio, Row, Skeleton } from "antd";
import { MdContentCopy } from "react-icons/md";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FaRegImage, FaRegListAlt } from "react-icons/fa";

// Internal Imports
import {
    useGetBookPagesQuery,
    useUpdateBookPageSequenceMutation,
} from "../../../features/api/booksSlice";
import PageListItem from "../pages/pageListItem";
import DataContainer from "../../layout/dataContainer";
import PageAddButton from "./pageAddButton";
import PageDeleteButton from "./pageDeleteButton";
import PageAssignButton from "./pageAssignButton";
import PageSortButton from "./pageSortButton";
import PageStatusFilterButton from "./pageStatusFilterButton";
import PageAssignmentFilterButton from "./pageAssignmentFilterButton";
import CheckboxButton from "../../checkboxButton";
import PageChapterButton from "./pageChapterButton";
import PageStatusButton from "./pageStatusButton";

// ------------------------------------------------------

const PagesList = ({ libraryId, book, t, size = "default" }) => {
    const { message } = App.useApp();
    const [showList, setShowList] = useLocalStorage(
        "book-pages-list-view",
        true
    );
    const [searchParams] = useSearchParams();
    const [selection, setSelection] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const status = searchParams.get("status") ?? "Typing";
    const assignment = searchParams.get("assignment") ?? "Mine";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;
    const sortDirection = searchParams.get("sortDirection") ?? 12;

    const {
        refetch,
        data: pages,
        error,
        isFetching,
    } = useGetBookPagesQuery(
        {
            libraryId,
            bookId: book.id,
            status,
            assignment,
            sortDirection,
            pageNumber,
            pageSize,
        },
        { skip: !libraryId || !book || !book.links.pages }
    );

    const [updateBookPageSequence, { isLoading: isUpdatingSequence }] =
        useUpdateBookPageSequenceMutation();

    if (isFetching) return <Skeleton />;

    const onDragDrop = (result) => {
        const fromIndex = result.source.index + 1;
        const toIndex = result.destination.index + 1;
        if (fromIndex !== toIndex) {
            const page = pages.data.find((p) => p.sequenceNumber === fromIndex);
            if (page) {
                return updateBookPageSequence({
                    page,
                    payload: { sequenceNumber: toIndex },
                })
                    .unwrap()
                    .then(() =>
                        message.success(t("chapter.actions.reorder.success"))
                    )
                    .catch((_) =>
                        message.error(t("chapter.actions.reorder.error"))
                    );
            }
        }
    };

    //------------------------------------------------------
    const onSelectChanged = (p) => {
        const currentIndex = selection.indexOf(p.sequenceNumber);
        const newSelection = [...selection];

        if (currentIndex === -1) {
            newSelection.push(p.sequenceNumber);
        } else {
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedPages(
            pages.data.filter((p) => newSelection.includes(p.sequenceNumber))
        );
    };

    const onSelectAll = () => {
        if (selection.length === pages.data.length) {
            setSelection([]);
            setSelectedPages([]);
        } else {
            setSelection(pages.data.map((p) => p.sequenceNumber));
            setSelectedPages(pages.data.map((p) => p.sequenceNumber));
        }
    };

    const hasAllSelected = selection.length === pages.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < pages.data.length;

    //------------------------------------------------------
    const toolbar = (
        <Row gutter={8}>
            <Col>
                <Button.Group>
                    <CheckboxButton
                        onChange={onSelectAll}
                        checked={hasAllSelected}
                        indeterminate={hasPartialSelection}
                    />
                    <PageAddButton libraryId={libraryId} book={book} t={t} />
                    <PageDeleteButton pages={selectedPages} t={t} />
                    <PageAssignButton
                        libraryId={libraryId}
                        pages={selectedPages}
                        t={t}
                    />
                    <PageChapterButton
                        libraryId={libraryId}
                        book={book}
                        pages={selectedPages}
                        t={t}
                    />
                    <PageStatusButton pages={selectedPages} t={t} />
                </Button.Group>
            </Col>
            <Col flex={1}></Col>
            <Col>
                <Button.Group>
                    <PageAssignmentFilterButton
                        libraryId={libraryId}
                        bookId={book.id}
                        t={t}
                    />
                    <PageStatusFilterButton
                        libraryId={libraryId}
                        bookId={book.id}
                        t={t}
                    />
                    <PageSortButton
                        libraryId={libraryId}
                        bookId={book.id}
                        t={t}
                    />
                </Button.Group>
            </Col>
            <Col>
                <Radio.Group
                    value={showList}
                    onChange={(e) => setShowList(e.target.value)}
                >
                    <Radio.Button value="true">
                        <FaRegListAlt />
                    </Radio.Button>
                    <Radio.Button value="false">
                        <FaRegImage />
                    </Radio.Button>
                </Radio.Group>
            </Col>
        </Row>
    );

    return (
        <>
            <DataContainer
                busy={isFetching | isUpdatingSequence}
                error={error}
                errorTitle={t("pages.errors.loading.title")}
                errorSubTitle={t("pages.errors.loading.subTitle")}
                errorAction={
                    <Button type="default" onClick={refetch}>
                        {t("actions.retry")}
                    </Button>
                }
                emptyImage={<MdContentCopy size="5em" />}
                emptyDescription={t("pages.empty.title")}
                empty={pages && pages.data && pages.data.length < 1}
                title={toolbar}
                bordered={false}
            >
                <DragDropContext onDragEnd={onDragDrop}>
                    <Droppable droppableId={`${book.id}_pages_droppable`}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <List
                                    size={size}
                                    itemLayout="horizontal"
                                    dataSource={pages ? pages.data : []}
                                    renderItem={(page) => (
                                        <PageListItem
                                            key={`page_${page.sequenceNumber}`}
                                            t={t}
                                            selected={
                                                selection.indexOf(
                                                    page.sequenceNumber
                                                ) >= 0
                                            }
                                            onSelectChanged={onSelectChanged}
                                            libraryId={libraryId}
                                            book={book}
                                            page={page}
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

export default PagesList;
