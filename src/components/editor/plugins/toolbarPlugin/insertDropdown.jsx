import PropTypes from 'prop-types';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

// UI library import
import { Button, Menu, Text } from "@mantine/core";

// Local Insert

import { IconInsert, IconImage, IconChevronUp } from '@/components/icons';
import { useDisclosure } from '@mantine/hooks';
import { InsertImageDialog } from '../imagesPlugin';

//-----------------------------

const InsertDropdown = ({
    editor, disabled = false
}) => {
    const { t } = useTranslation();
    const [opened, setOpened] = useState(false);
    const [showImageInsert, { open: openImageInsert, close: closeImageInsert }] = useDisclosure(false);
    const [showImageUrlInsert, { open: openImageUrlInsert, close: closeImageUrlInsert }] = useDisclosure(false);

    return (<>
        <Menu shadow="md" opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
            <Menu.Target>
                <Button width={300} variant="default" disabled={disabled}
                    leftSection={<IconInsert />}
                    rightSection={<IconChevronUp style={{
                        transform: opened ? "rotate(0)" : "rotate(180deg)",
                        transitionDuration: "250ms"
                    }} />}>
                    <Text>{t('')}</Text>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item leftSection={<IconImage />} onClick={openImageInsert}>
                    {t('editor.insertImage.title')}
                </Menu.Item>
                <Menu.Item leftSection={<IconImage />} onClick={openImageUrlInsert}>
                    {t('editor.insertImageLink.title')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
        <InsertImageDialog mode="file" opened={showImageInsert} activeEditor={editor} onClose={closeImageInsert} />
        <InsertImageDialog mode="url" opened={showImageUrlInsert} activeEditor={editor} onClose={closeImageUrlInsert} />
    </>
    );
}

InsertDropdown.propTypes = {
    editor: PropTypes.any,
    disabled: PropTypes.bool,
}

export default InsertDropdown;