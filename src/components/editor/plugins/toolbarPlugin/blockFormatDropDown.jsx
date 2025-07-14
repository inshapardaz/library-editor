import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Editor imports
import {
    formatBulletList,
    formatCode,
    formatHeading,
    formatNumberedList,
    formatParagraph,
    formatQuote,
} from './utils';

// Local imports
import { Button, Menu, Text } from '@mantine/core';
import {
    IconH1, IconH2, IconH3, IconH4, IconH5, IconH6,
    IconTick,
    IconParagraph,
    IconListBullet,
    IconListNumber,
    IconQuote,
    IconCode,
    IconChevronUp,
} from '@/components/icons';
import { BlockTypeToBlockName } from './toolbarContext';

// ----------------------------------------------------------------
const BlockFormatDropDown = ({
    editor, blockType = "normal", disabled = false
}) => {
    const { t } = useTranslation();
    const [opened, setOpened] = useState(false);

    const blockTypes = useMemo(() => [
        { value: BlockTypeToBlockName.paragraph, label: t('editor.paragraph'), icon: <IconParagraph />, onClick: () => formatParagraph(editor, blockType) },
        { value: BlockTypeToBlockName.h1, label: t('editor.heading1'), icon: <IconH1 />, onClick: () => formatHeading(editor, blockType, BlockTypeToBlockName.h1) },
        { value: BlockTypeToBlockName.h2, label: t('editor.heading2'), icon: <IconH2 />, onClick: () => formatHeading(editor, blockType, BlockTypeToBlockName.h2) },
        { value: BlockTypeToBlockName.h3, label: t('editor.heading3'), icon: <IconH3 />, onClick: () => formatHeading(editor, blockType, BlockTypeToBlockName.h3) },
        { value: BlockTypeToBlockName.h4, label: t('editor.heading4'), icon: <IconH4 />, onClick: () => formatHeading(editor, blockType, BlockTypeToBlockName.h4) },
        { value: BlockTypeToBlockName.h5, label: t('editor.heading5'), icon: <IconH5 />, onClick: () => formatHeading(editor, blockType, BlockTypeToBlockName.h5) },
        { value: BlockTypeToBlockName.h6, label: t('editor.heading6'), icon: <IconH6 />, onClick: () => formatHeading(editor, blockType, BlockTypeToBlockName.h6) },
        { value: BlockTypeToBlockName.bullet, label: t('editor.bulletList'), icon: <IconListBullet />, onClick: () => formatBulletList(editor, blockType) },
        { value: BlockTypeToBlockName.number, label: t('editor.numberList'), icon: <IconListNumber />, onClick: () => formatNumberedList(editor, blockType) },
        { value: BlockTypeToBlockName.quote, label: t('editor.quote'), icon: <IconQuote />, onClick: () => formatQuote(editor, blockType) },
        { value: BlockTypeToBlockName.code, label: t('editor.code'), icon: <IconCode />, onClick: () => formatCode(editor, blockType) }
    ], [blockType, editor, t]);

    const [selected, setSelected] = useState(blockTypes[0]);

    useEffect(() => {
        const found = blockTypes.find(b => b.value === blockType);
        if (found) {
            setSelected(found);
        }
    }, [blockType, blockTypes]);

    const onItemClick = item => {
        setSelected(item);
        return item.onClick();
    };

    return (<Menu shadow="md" opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
        <Menu.Target>
            <Button width={300} variant="default" disabled={disabled} leftSection={selected.icon} rightSection={<IconChevronUp style={{
                transform: opened ? "rotate(0)" : "rotate(180deg)",
                transitionDuration: "250ms"
            }} />}>
                <Text>{selected.label}</Text>
            </Button>
        </Menu.Target>
        <Menu.Dropdown>
            {blockTypes.map(b => (
                <Menu.Item key={b.value}
                    leftSection={b.icon}
                    rightSection={b.value === selected.value ? <IconTick /> : null}
                    onClick={() => onItemClick(b)}>
                    {b.label}
                </Menu.Item>))}
        </Menu.Dropdown>
    </Menu >);

}

BlockFormatDropDown.propTypes = {
    editor: PropTypes.any,
    blockType: PropTypes.string,
    disabled: PropTypes.bool
}

export default BlockFormatDropDown;
