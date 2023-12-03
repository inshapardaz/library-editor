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
    children,
}) => {
    const content = error ? (
        <Result
            status="error"
            title={errorTitle}
            subTitle={errorSubTitle}
            icon={errorIcon}
            extra={errorAction}
        />
    ) : !!empty ? (
        <Empty image={emptyImage} description={emptyDescription}>
            {emptyContent}
        </Empty>
    ) : busy ? busyContent : (
        children
    );
    return (
        <Card
            title={title}
            actions={actions}
            extra={extra}
            bordered={bordered}
            className={styles["api_container"]}
            loading={busy && !busyContent}
        >
            {content}
        </Card>
    );
};

export default DataContainer;
