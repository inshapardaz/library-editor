import PropTypes from 'prop-types';
import { useState } from 'react';

// UI Library Imprort
import { useField } from '@mantine/form';
import { Divider, Switch, Text, TextInput } from '@mantine/core';

// Local imports
import { useOcrIssuePagesMutation } from "@/store/slices/issues.api";
import { IconOcrDocument } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';

// ------------------------------------------------------

const IssuePageOcrButton = ({ pages = [], t, type, showIcon = true, onCompleted = () => { } }) => {
    const [ocrPages, { isLoading: isBusy }] = useOcrIssuePagesMutation();
    const [saveKey, setSaveKey] = useState(true);
    const count = pages ? pages.length : 0;

    const keyField = useField({
        initialValue: localStorage.getItem('ocrKey') ?? '',
        validate: (value) => (value && value != '' ? null : t("page.actions.ocr.key.required"))
    });

    const onOk = async () => {
        await keyField.validate();
        let value = keyField.getValue();

        if (saveKey) {
            if (value) {
                localStorage.setItem('ocrKey', value);
            }
        } else {
            localStorage.removeItem('ocrKey');
        }

        if (value && value != '') {
            return (page) => {
                if (page && page.links && page.links.ocr) {
                    return { key: value };
                }
                return null;
            }
        }

        return false;
    };

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('page.actions.ocr.title', { count })}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconOcrDocument />}
            sliderTitle={t("page.actions.ocr.title", { count })}
            onOkFunc={onOk}
            busy={isBusy}
            listTitle={t("page.actions.ocr.message")}
            items={pages}
            itemTitleFunc={page => page.sequenceNumber}
            mutation={ocrPages}
            successMessage={t("page.actions.ocr.success", { count })}
            errorMessage={t("page.actions.ocr.error", { count })}
            onSuccess={onCompleted}
            onClose={() => keyField.reset()}
        >
            <TextInput {...keyField.getInputProps()}
                label={t('page.actions.ocr.key.label')}
                description={t('page.actions.ocr.key.description')}
            />

            <Switch checked={saveKey} onChange={(event) => setSaveKey(event.currentTarget.checked)}
                label={t('page.actions.ocr.saveKey.label')}
            />

            <Text>{t('page.actions.ocr.saveKey.description')}</Text>
            <Divider />
        </BatchActionDrawer>
    </>);
};

IssuePageOcrButton.propTypes = {
    t: PropTypes.any,
    libraryId: PropTypes.string,
    type: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                delete: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onCompleted: PropTypes.func
};

export default IssuePageOcrButton;
