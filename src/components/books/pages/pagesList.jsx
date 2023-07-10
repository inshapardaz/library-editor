import { Link, useNavigate, useSearchParams } from "react-router-dom";

// 3rd party libraries
import { Button, List, Menu, Skeleton } from "antd";
import { MdContentCopy } from "react-icons/md";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Internal Imports
import { useGetBookPagesQuery } from "../../../features/api/booksSlice";
import PageListItem from "../pages/pageListItem";
import DataContainer from "../../layout/dataContainer";
import {
    FaCheck,
    FaFile,
    FaFileAlt,
    FaFilePdf,
    FaFileSignature,
    FaFilter,
    FaGlasses,
    FaInfoCircle,
    FaLayerGroup,
    FaPlus,
    FaRegImage,
    FaRegListAlt,
    FaSort,
    FaSortAmountDown,
    FaSortAmountUp,
    FaStarOfLife,
    FaTrash,
    FaUser,
    FaUserAlt,
    FaUserFriends,
    FaUserSlash,
    FaUsers,
} from "react-icons/fa";
import { FaFileArrowUp, FaFileCirclePlus, FaFileZipper } from "react-icons/fa6";
import helpers from "../../../helpers";

// ------------------------------------------------------

const PagesList = ({
    libraryId,
    bookId,
    t,
    selectedChapterNumber: selectedPageNumber = null,
    size = "default",
    hideTitle = false,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status") ?? "Typing";
    const assignment = searchParams.get("assignment") ?? "Mine";
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const {
        refetch,
        data: pages,
        error,
        isFetching,
    } = useGetBookPagesQuery(
        { libraryId, bookId, status, pageNumber, pageSize },
        { skip: !libraryId || !bookId }
    );

    if (isFetching) return <Skeleton />;

    const setStatus = (newStatus) => {
        navigate(
            helpers.buildLinkToBooksPagesPage(
                libraryId,
                bookId,
                pageNumber,
                pageSize,
                newStatus,
                assignment
            )
        );
    };

    const setAssignment = (newAvailabilityStatus) => {
        navigate(
            helpers.buildLinkToBooksPagesPage(
                libraryId,
                bookId,
                pageNumber,
                pageSize,
                status,
                newAvailabilityStatus
            )
        );
    };
    const onDragDrop = (result) => {
        // const fromIndex = result.source.index;
        // const toIndex = result.destination.index;
        // let payload = [ ...chapters.data ]
        // if (fromIndex !== toIndex) {
        //   const element = payload[fromIndex];
        //   payload.splice(fromIndex, 1);
        //   payload.splice(toIndex, 0, element);
        //   payload = payload.map((item, index) => ({
        //     id: item.id,
        //     chapterNumber : index + 1
        //   }))
        //   return updateChapterSequence({ libraryId, bookId, payload })
        //     .unwrap()
        //     .then(() => message.success(t("chapter.actions.reorder.success")))
        //     .catch((_) => message.error(t("chapter.actions.reorder.error")));
        // }
    };
    // {/* <PageEditor libraryId={libraryId} bookId={bookId} t={t} buttonType="dashed" /> */}

    const selectedKeys = [
        assignment
            ? `assignment.${assignment}`.toLowerCase()
            : "assignment.all",
        status ? `status.${status}`.toLowerCase() : "status.all",
    ];

    console.log(selectedKeys);
    const headerItems = [
        {
            icon: <FaPlus />,
            children: [
                {
                    icon: <FaFileCirclePlus />,
                    label: (
                        <Link
                            to={`/libraries/${libraryId}/books/${bookId}/pages/add`}
                        >
                            {t("page.actions.add.label")}
                        </Link>
                    ),
                },
                {
                    icon: <FaFileArrowUp />,
                    label: t("page.actions.uploadPage.label"),
                },
                {
                    icon: <FaFilePdf />,
                    label: t("page.actions.uploadPdf.label"),
                },
                {
                    icon: <FaFileZipper />,
                    label: t("page.actions.uploadZip.label"),
                },
            ],
        },
        {
            icon: <FaTrash />,
        },
        {
            icon: <FaUser />,
        },
        {
            icon: <FaLayerGroup />,
        },
        {
            icon: <FaInfoCircle />,
        },
        {
            icon: <FaFileAlt />,
        },
        {
            type: "divider",
            style: { flex: "1", order: 7 },
        },
        {
            icon: <FaUser />,
            children: [
                {
                    icon: <FaUsers />,
                    label: t("pages.assignment.all"),
                    onClick: () => setAssignment("all"),
                    key: "assignment.all",
                },
                {
                    icon: <FaUserAlt />,
                    label: t("pages.assignment.mine"),
                    onClick: () => setAssignment("assignedToMe"),
                    key: "assignment.assignedtome",
                },
                {
                    icon: <FaUserFriends />,
                    label: t("pages.assignment.assigned"),
                    onClick: () => setAssignment("assigned"),
                    key: "assignment.assigned",
                },
                {
                    icon: <FaUserSlash />,
                    label: t("pages.assignment.unassigned"),
                    onClick: () => setAssignment("unassigned"),
                    key: "assignment.unassigned",
                },
            ],
        },
        {
            icon: <FaFilter />,
            children: [
                {
                    icon: <FaStarOfLife />,
                    label: t("pages.filters.all"),
                    onClick: () => setStatus("all"),
                    key: "status.unassigned",
                },
                {
                    icon: <FaFile />,
                    label: t("pages.filters.availableToType"),
                    onClick: () => setStatus("Available"),
                    key: "status.available",
                },
                {
                    icon: <FaFileSignature />,
                    label: t("pages.filters.typing"),
                    onClick: () => setStatus("Typing"),
                    key: "status.typing",
                },
                {
                    icon: <FaFileAlt />,
                    label: t("pages.filters.typed"),
                    onClick: () => setStatus("Typed"),
                    key: "status.typed",
                },
                {
                    icon: <FaGlasses />,
                    label: t("pages.filters.proofreading"),
                    onClick: () => setStatus("InReview"),
                    key: "status.inreview",
                },
                {
                    icon: <FaCheck />,
                    label: t("pages.filters.completed"),
                    onClick: () => setStatus("Completed"),
                    key: "status.completed",
                },
            ],
        },
        {
            icon: <FaSort />,
            children: [
                {
                    icon: <FaSortAmountDown />,
                    label: t("pages.sort.descending"),
                },
                {
                    icon: <FaSortAmountUp />,
                    label: t("pages.sort.ascending"),
                },
            ],
        },
        {
            icon: <FaRegImage />,
        },
        {
            icon: <FaRegListAlt />,
        },
    ];
    const header = (
        <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={headerItems}
        ></Menu>
    );
    console.log(pages);
    return (
        <>
            <DataContainer
                busy={isFetching}
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
                title={header}
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
                                    dataSource={pages ? pages.data : []}
                                    renderItem={(page) => (
                                        <PageListItem
                                            key={page.id}
                                            t={t}
                                            selected={
                                                selectedPageNumber ===
                                                page.sequenceNumber
                                            }
                                            libraryId={libraryId}
                                            bookId={bookId}
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
