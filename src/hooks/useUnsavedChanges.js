import { useState, useEffect } from "react";
import unsavedChangedRepository from "@/domain/unsavedChangesRepository";

export default function useUnsavedChanges(contentKey) {
    let unsavedContents = contentKey
        ? new unsavedChangedRepository(contentKey)
        : null;
    const [content, setContent] = useState(unsavedContents?.get(contentKey));
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (contentKey) {
            unsavedContents = new unsavedChangedRepository(contentKey);
            const value = unsavedContents?.get(contentKey);
            setContent(value);
            setHasChanges(value && value != "");
        } else {
            unsavedContents = null;
            setContent(null);
            setHasChanges(false);
        }
    }, [contentKey]);

    const saveUnsavedChanges = (value) => {
        if (value && value != "") {
            setContent(value);
            unsavedContents?.save(value);
        } else {
            unsavedContents?.clear();
            setContent(null);
            setHasChanges(false);
        }
    };

    const hasUnsavedChanges = () => hasChanges;

    const clearUnsavedChanges = () => saveUnsavedChanges(null);

    const getUnsavedChanges = () => content;

    return {
        getUnsavedChanges,
        saveUnsavedChanges,
        hasUnsavedChanges,
        clearUnsavedChanges,
    };
}
