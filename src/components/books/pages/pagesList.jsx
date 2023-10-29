import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
import PageAutoChapterUpdate from "./pageAutoChapterUpdate";
import PageStatusButton from "./pageStatusButton";
import helpers from "../../../helpers";
import BookStatus from "../../../models/bookStatus";
import PageStatus from "../../../models/pageStatus";
import AssignmentStatus from "../../../models/assignmentStatus";
import PageCard from "./pageCard";
import PageOcrButton from "./pageOcrButton";

// ------------------------------------------------------

const getFilterFromBookStatus = (book) => {
    switch (book.status) {
        case BookStatus.AvailableForTyping:
            return PageStatus.AvailableForTyping;
        case BookStatus.BeingTyped:
            return PageStatus.Typing;
        case BookStatus.ReadyForProofRead:
            return PageStatus.Typed;
        case BookStatus.ProofRead:
            return PageStatus.InReview;
        case BookStatus.Published:
        default:
            return PageStatus.All;
    }
};

const getAssignmentFilterFromBookStatus = (book) => {
    switch (book.status) {
        case BookStatus.AvailableForTyping:
        case BookStatus.BeingTyped:
        case BookStatus.ReadyForProofRead:
        case BookStatus.ProofRead:
            return AssignmentStatus.AssignedToMe;
        case BookStatus.Published:
        default:
            return AssignmentStatus.All;
    }
};
// ---------------------------------------------------------------------

const PagesList = ({ libraryId, book, t, size = "default" }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [showList, setShowList] = useLocalStorage(
        "book-pages-list-view",
        true
    );
    const [searchParams] = useSearchParams();
    const [selection, setSelection] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const status = searchParams.get("status") ?? getFilterFromBookStatus(book);
    const assignment =
        searchParams.get("assignment") ??
        getAssignmentFilterFromBookStatus(book);
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

    useEffect(() => {
        setSelection([]);
        setSelectedPages([]);
    }, [pages]);

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
        if (pages.data.length > 0 && selection.length === pages.data.length) {
            setSelection([]);
            setSelectedPages([]);
        } else {
            setSelection(pages.data.map((p) => p.sequenceNumber));
            setSelectedPages(pages.data);
        }
    };

    const hasAllSelected = selection.length  > 0 && selection.length === pages.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < pages.data.length;

    //------------------------------------------------------
    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            helpers.buildLinkToBooksPagesPage(
                location.pathname,
                newPage,
                newPageSize,
                status,
                assignment,
                sortDirection
            )
        );
    };
    //------------------------------------------------------
    const toolbar = (
        <Row gutter={8}>
            <Col>
                <Button.Group>
                    <CheckboxButton
                        onChange={onSelectAll}
                        checked={hasAllSelected}
                        disabled={pages.data.length < 1}
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
                    <PageAutoChapterUpdate pages={selectedPages} t={t} />
                    <PageStatusButton pages={selectedPages} t={t} />
                    <PageOcrButton pages={selectedPages} t={t} />
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
                    <Radio.Button value={true}>
                        <FaRegListAlt />
                    </Radio.Button>
                    <Radio.Button value={false}>
                        <FaRegImage />
                    </Radio.Button>
                </Radio.Group>
            </Col>
        </Row>
    );

    const renderPage = (page) => {
        if (showList) {
            return (
                <PageListItem
                    key={`page_${page.sequenceNumber}`}
                    t={t}
                    selected={selection.indexOf(page.sequenceNumber) >= 0}
                    onSelectChanged={onSelectChanged}
                    libraryId={libraryId}
                    book={book}
                    page={page}
                />
            );
        }

        return (
            <PageCard
                key={`page_${page.sequenceNumber}`}
                t={t}
                selected={selection.indexOf(page.sequenceNumber) >= 0}
                onSelectChanged={onSelectChanged}
                libraryId={libraryId}
                book={book}
                page={page}
            />
        );
    };
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
                                    itemLayout={
                                        showList ? "horizontal" : "vertical"
                                    }
                                    grid={
                                        showList
                                            ? null
                                            : {
                                                  gutter: 16,
                                                  xs: 1,
                                                  sm: 1,
                                                  md: 2,
                                                  lg: 2,
                                                  xl: 3,
                                                  xxl: 3,
                                              }
                                    }
                                    dataSource={pages ? pages.data : []}
                                    renderItem={renderPage}
                                    pagination={{
                                        onChange: onPageChanged,
                                        pageSize: pages ? pages.pageSize : 12,
                                        current: pages
                                            ? pages.currentPageIndex
                                            : 1,
                                        total: pages ? pages.totalCount : 0,
                                        showSizeChanger: true,
                                        responsive: true,
                                        showQuickJumper: true,
                                        pageSizeOptions: [12, 24, 48, 96],
                                    }}
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
