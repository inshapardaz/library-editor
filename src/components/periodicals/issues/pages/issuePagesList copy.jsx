import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { App, Button, Col, List, Row, Segmented, Skeleton } from "antd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Internal Imports
import { MdContentCopy, FaRegImage, FaRegListAlt } from "/src/icons";
import {
    useGetIssuePagesQuery,
    useUpdateIssuePageSequenceMutation,
} from "/src/store/slices/issuesSlice";
import { BookStatus, PageStatus, AssignmentStatus } from "/src/models";
import { buildLinkToBooksPagesPage } from "/src/util";
import DataContainer from "/src/components/layout/dataContainer";
import IssuePageListItem from "./issuePageListItem";
import IssuePageAddButton from "./issuePageAddButton";
import IssuePageCard from "./issuePageCard";
import CheckboxButton from "/src/components/checkboxButton";
import IssuePageArticleButton from "./issuePageArticleButton";
import IssuePageStatusButton from "./issuePageStatusButton";
import IssuePageDeleteButton from "./issuePageDeleteButton";
import IssuePageAssignButton from "./issuePageAssignButton";
// ------------------------------------------------------

const getFilterFromIssueStatus = (issue) => {
    switch (issue?.status) {
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

const getAssignmentFilterFromIssueStatus = (issue) => {
    switch (issue?.status) {
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

const IssuePagesList = ({ libraryId, issue, t, size = "default" }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [showList, setShowList] = useLocalStorage(
        "issue-pages-list-view",
        true
    );
    const [searchParams] = useSearchParams();
    const [selection, setSelection] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const status = searchParams.get("status") ?? getFilterFromIssueStatus(issue);
    const assignment = searchParams.get("assignment");
    const reviewerAssignmentFilter = searchParams.get("reviewerAssignment");
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;
    const sortDirection = searchParams.get("sortDirection") ?? 12;

    const {
        refetch,
        data: pages,
        error,
        isFetching,
    } = useGetIssuePagesQuery(
        {
            url: issue?.links?.pages,
            status,
            assignment: assignment ? assignment : AssignmentStatus.All,
            reviewerAssignmentFilter: reviewerAssignmentFilter ? reviewerAssignmentFilter : AssignmentStatus.All,
            sortDirection,
            pageNumber,
            pageSize,
        },
        { skip: !libraryId || !issue || !issue.links.pages }
    );

    useEffect(() => {
        setSelection([]);
        setSelectedPages([]);
    }, [pages]);

    const [updateIssuePageSequence, { isLoading: isUpdatingSequence }] =
        useUpdateIssuePageSequenceMutation();

    if (isFetching) return <Skeleton />;

    const onDragDrop = (result) => {
        const fromIndex = result.source.index + 1;
        const toIndex = result.destination.index + 1;
        if (fromIndex !== toIndex) {
            const page = pages.data.find((p) => p.sequenceNumber === fromIndex);
            if (page) {
                return updateIssuePageSequence({
                    page,
                    payload: { sequenceNumber: toIndex },
                })
                    .unwrap()
                    .then(() =>
                        message.success(t("issue.pages.actions.reorder.success"))
                    )
                    .catch(() =>
                        message.error(t("issue.pages.actions.reorder.error"))
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

    const hasAllSelected = selection.length > 0 && selection.length === pages.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < pages.data.length;

    //------------------------------------------------------
    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            buildLinkToBooksPagesPage(
                location.pathname,
                newPage,
                newPageSize,
                status,
                assignment,
                reviewerAssignmentFilter,
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
                        disabled={pages?.data?.length < 1}
                        indeterminate={hasPartialSelection}
                    />
                    <IssuePageAddButton libraryId={libraryId} issue={issue} t={t} />
                    <IssuePageDeleteButton pages={selectedPages} t={t} />
                    <IssuePageAssignButton
                        libraryId={libraryId}
                        pages={selectedPages}
                        t={t}
                    />
                    <IssuePageArticleButton
                        libraryId={libraryId}
                        issue={issue}
                        pages={selectedPages}
                        t={t}
                    />
                    {/* <PageAutoChapterUpdate pages={selectedPages} t={t} /> */}
                    <IssuePageStatusButton pages={selectedPages} t={t} />
                    {/* <IssuePageOcrButton pages={selectedPages} t={t} /> */}
                </Button.Group>
            </Col>
            <Col flex={1}></Col>
            <Col>
                <Button.Group>
                    <IssuePageAssignmentFilterButton
                        libraryId={libraryId}
                        issue={issue}
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
                <Segmented size="large"
                    onChange={(value) => setShowList(value)}
                    value={showList}
                    options={[
                        { value: true, icon: <FaRegListAlt /> },
                        { value: false, icon: <FaRegImage /> },
                    ]}
                />
            </Col>
        </Row>
    );

    const renderPage = (page) => {
        if (showList) {
            return (
                <IssuePageListItem
                    key={`issue-page_${page.sequenceNumber}`}
                    t={t}
                    selected={selection.indexOf(page.sequenceNumber) >= 0}
                    onSelectChanged={onSelectChanged}
                    libraryId={libraryId}
                    issue={issue}
                    page={page}
                />
            );
        }

        return (
            <IssuePageCard
                key={`issue-page_${page.sequenceNumber}`}
                t={t}
                selected={selection.indexOf(page.sequenceNumber) >= 0}
                onSelectChanged={onSelectChanged}
                libraryId={libraryId}
                issue={issue}
                page={page}
            />
        );
    };
    return (
        <>
            <DataContainer
                busy={isFetching | isUpdatingSequence}
                error={error}
                errorTitle={t("issue.pages.errors.loading.title")}
                errorSubTitle={t("issue.pages.errors.loading.subTitle")}
                errorAction={
                    <Button type="default" onClick={refetch}>
                        {t("actions.retry")}
                    </Button>
                }
                emptyImage={<MdContentCopy size="5em" />}
                emptyDescription={t("issue.pages.empty.title")}
                empty={pages && pages.data && pages.data.length < 1}
                title={toolbar}
                bordered={false}
            >
                <DragDropContext onDragEnd={onDragDrop}>
                    <Droppable droppableId={`${issue?.id}_pages_droppable`}>
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

export default IssuePagesList;
