import React, { useState } from "react";

// 3rd party libraries
import { App, Button, Col, List, Row, Skeleton } from "antd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Internal Imports
import { FaBook } from "/src/icons";
import {
    useGetIssueArticlesQuery,
    useUpdateIssueArticleSequenceMutation
} from "/src/store/slices/issueArticlesSlice";
import DataContainer from "/src/components/layout/dataContainer";
import CheckboxButton from "/src/components/checkboxButton";
import IssueArticleListItem from "./issueArticleListItem";
import IssueArticleEditor from "./issueArticleEditor";
import IssueArticleDeleteButton from "./issueArticleDeleteButton";
import IssueArticleStatusButton from "./issueArticleStatusButton";
import IssueArticleAssignButton from "./issueArticleAssignButton";
// ------------------------------------------------------

const IssueArticlesList = ({
    libraryId,
    periodicalId,
    volumeNumber,
    issueNumber,
    t,
    size = "default"
}) => {
    const { message } = App.useApp();
    const [selection, setSelection] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const {
        refetch,
        data: articles,
        error,
        isFetching,
    } = useGetIssueArticlesQuery(
        {
            libraryId,
            periodicalId,
            volumeNumber,
            issueNumber
        },
        { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber }
    );
    const [updateIssueArticleSequence, { isLoading: isUpdating }] =
        useUpdateIssueArticleSequenceMutation();

    if (isFetching) return <Skeleton />;

    const onDragDrop = (result) => {
        const fromIndex = result.source.index;
        const toIndex = result.destination.index;
        let payload = [...articles.data];
        if (fromIndex !== toIndex) {
            const element = payload[fromIndex];
            payload.splice(fromIndex, 1);
            payload.splice(toIndex, 0, element);

            payload = payload.map((item, index) => ({
                id: item.id,
                sequenceNumber: index + 1,
            }));

            return updateIssueArticleSequence({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload
            })
                .unwrap()
                .then(() =>
                    message.success(t("issueArticles.actions.reorder.success"))
                )
                .catch(() =>
                    message.error(t("issueArticles.actions.reorder.error"))
                );
        }
    };

    //------------------------------------------------------
    const onSelectChanged = (a) => {
        const currentIndex = selection.indexOf(a.sequenceNumber);
        const newSelection = [...selection];

        if (currentIndex === -1) {
            newSelection.push(a.sequenceNumber);
        } else {
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedArticles(
            articles.data.filter((p) => newSelection.includes(p.sequenceNumber))
        );
    };

    const onSelectAll = () => {
        if (articles.data.length > 0 && selection.length === articles.data.length) {
            setSelection([]);
            setSelectedArticles([]);
        } else {
            setSelection(articles.data.map((p) => p.sequenceNumber));
            setSelectedArticles(articles.data);
        }
    };

    const hasAllSelected = selection.length === articles.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < articles.data.length;
    //------------------------------------------------------

    const header = (
        <Row gutter={8}>
            <Col>
                <Button.Group>
                    <CheckboxButton
                        onChange={onSelectAll}
                        checked={hasAllSelected}
                        indeterminate={hasPartialSelection}
                    />
                    <IssueArticleEditor
                        libraryId={libraryId}
                        periodicalId={periodicalId}
                        volumeNumber={volumeNumber}
                        issueNumber={issueNumber}
                        t={t}
                    />
                    <IssueArticleDeleteButton articles={selectedArticles} t={t} />
                    <IssueArticleAssignButton
                        libraryId={libraryId}
                        articles={selectedArticles}
                        t={t}
                        showDetails={false}
                    />
                    <IssueArticleStatusButton
                        libraryId={libraryId}
                        articles={selectedArticles}
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
                errorTitle={t("issueArticles.errors.loading.title")}
                errorSubTitle={t("issueArticles.errors.loading.subTitle")}
                errorAction={
                    <Button type="default" onClick={refetch}>
                        {t("actions.retry")}
                    </Button>
                }
                empty={articles && articles.data && articles.data.length < 1}
                emptyImage={<FaBook size="5em" />}
                emptyDescription={t("issueArticles.empty.title")}
                emptyContent={
                    <IssueArticleEditor
                        libraryId={libraryId}
                        periodicalId={periodicalId}
                        volumeNumber={volumeNumber}
                        issueNumber={issueNumber}
                        t={t}
                        buttonType="dashed"
                    />
                }
                bordered={false}
            >
                <DragDropContext onDragEnd={onDragDrop}>
                    <Droppable droppableId={`Droppable_${periodicalId}_${volumeNumber}_${issueNumber}`}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <List
                                    size={size}
                                    itemLayout="horizontal"
                                    dataSource={articles ? articles.data : []}
                                    header={header}
                                    renderItem={(article) => (
                                        <IssueArticleListItem
                                            key={article.id}
                                            t={t}
                                            selected={
                                                selection.indexOf(
                                                    article.sequenceNumber
                                                ) >= 0
                                            }
                                            onSelectChanged={onSelectChanged}
                                            libraryId={libraryId}
                                            periodicalId={periodicalId}
                                            volumeNumber={volumeNumber}
                                            issueNumber={issueNumber}
                                            article={article}
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

export default IssueArticlesList;
