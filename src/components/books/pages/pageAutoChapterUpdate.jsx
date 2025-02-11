import PropTypes from 'prop-types';

// Local imports
import { useUpdateBookPagesMutation } from "@/store/slices/books.api";
import { IconChaptersSet } from "@/components/icons";
import BatchActionDrawer from "@/components/batchActionDrawer";

// ------------------------------------------------------

const PageAutoChapterUpdate = ({ pages, t, type, showIcon = true, onCompleted = () => { } }) => {
    const [updateBookPages, { isLoading: isUpdating }] = useUpdateBookPagesMutation();
    const count = pages ? pages.length : 0;

    const onOk = async () => {
        var c = null;
        return (page) => {
            if (page.chapterId) {
                c = page.chapterId;
            } else if (c) {
                if (page && page.links && page.links.update) {
                    console.log(c)
                    return ({ ...page, chapterId: c });
                }
            }
            return null;
        };
    };

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t("pages.actions.autoFillChapter.title", { count })}
                buttonType={type}
                disabled={pages.length < 1}
                icon={showIcon && <IconChaptersSet />}
                sliderTitle={t("pages.actions.autoFillChapter.title", { count })}
                onOkFunc={onOk}
                busy={isUpdating}
                listTitle={t("pages.actions.autoFillChapter.message")}
                items={pages}
                itemTitle={page => page.sequenceNumber}
                mutation={updateBookPages}
                successMessage={t("page.actions.setChapter.success", { count })}
                errorMessage={t("page.actions.setChapter.error", { count })}
                onSuccess={onCompleted}
            />
        </>
    );
};

PageAutoChapterUpdate.propTypes = {
    t: PropTypes.any,
    type: PropTypes.string,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            chapterId: PropTypes.number,
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                delete: PropTypes.string,
            }),
        })),
    showIcon: PropTypes.bool,
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default PageAutoChapterUpdate;
