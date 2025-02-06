import PropTypes from 'prop-types';

// Local imports
import { useUpdateIssuePagesMutation } from "@/store/slices/issues.api";
import { IconChaptersSet } from "@/components/icons";
import BatchActionDrawer from "@/components/batchActionDrawer";

// ------------------------------------------------------

const IssuePageAutoArticleUpdate = ({ pages, t, type, showIcon = true, onCompleted = () => { } }) => {
    const [update, { isLoading: isUpdating }] = useUpdateIssuePagesMutation();
    const count = pages ? pages.length : 0;

    const onOk = async () => {
        var c = null;
        return (page) => {
            if (page.articleId) {
                c = page.articleId;
            } else if (c) {
                if (page && page.links && page.links.update) {
                    return ({ ...page, articleId: c });
                }
            }
            return null;
        };
    };

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t("pages.actions.autoFillArticle.title", { count })}
                buttonType={type}
                disabled={pages.length < 1}
                icon={showIcon && <IconChaptersSet />}
                sliderTitle={t("pages.actions.autoFillArticle.title", { count })}
                onOkFunc={onOk}
                busy={isUpdating}
                listTitle={t("pages.actions.autoFillArticle.message")}
                items={pages}
                itemTitle={page => page.sequenceNumber}
                mutation={update}
                successMessage={t("page.actions.setArticle.success", { count })}
                errorMessage={t("page.actions.setArticle.error", { count })}
                onSuccess={onCompleted}
            />
        </>
    );
};

IssuePageAutoArticleUpdate.propTypes = {
    t: PropTypes.any,
    type: PropTypes.string,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            articleId: PropTypes.number,
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                delete: PropTypes.string,
            }),
        })),
    showIcon: PropTypes.bool,
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default IssuePageAutoArticleUpdate;
