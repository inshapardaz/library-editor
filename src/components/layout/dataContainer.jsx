import { Card, Empty, Result } from "antd";

// Local Import
import styles from "../../styles/common.module.scss";

// ------------------------------------------------

const DataContainer = ({
    title,
    error,
    errorTitle,
    errorIcon,
    errorSubTitle,
    errorAction,
    busy,
    busyContent = null,
    emptyImage,
    emptyDescription,
    emptyContent,
    empty,
    actions,
    extra,
    bordered = true,
    style = null,
    children,
}) => {

    let content = null;

    if (error) {
        content = (<Result
            status="error"
            title={errorTitle}
            subTitle={errorSubTitle}
            icon={errorIcon}
            extra={errorAction}
        />);
    } else if (busy) {
        content = busyContent;
    } else if (!!empty) {
        content = (<Empty image={emptyImage} description={emptyDescription}>
            {emptyContent}
        </Empty>);
    } else {
        content = children;
    }

    return (
        <Card
            title={title}
            actions={actions}
            extra={extra}
            bordered={bordered}
            className={styles["api_container"]}
            loading={busy && !busyContent}
            style={style}
        >
            {content}
        </Card>
    );
};

export default DataContainer;
