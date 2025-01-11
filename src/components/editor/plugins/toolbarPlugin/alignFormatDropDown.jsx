import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// Lexical Imorts
import {
  FORMAT_ELEMENT_COMMAND,
} from "lexical";

// Ui Library imports

// Local imports
import { Button, Menu } from '@mantine/core';
import {
  IconTick,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconChevronUp
} from '@/components/icons';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------
const AlignFormatDropDown = ({ editor, disabled = false, value = 'left' }) => {
  const { t } = useTranslation();

  const [opened, setOpened] = useState(false);

  const values = useMemo(() => [
    { value: "left", label: t('editor.alignLeft'), icon: <IconAlignLeft /> },
    { value: "center", label: t('editor.alignCenter'), icon: <IconAlignCenter /> },
    { value: "right", label: t('editor.alignRight'), icon: <IconAlignRight /> },
    { value: "justify", label: t('editor.alignJustify'), icon: <IconAlignJustified /> },
  ], [t]);

  const [selected, setSelected] = useState(values[0]);

  useEffect(() => {
    const found = values.find(b => b.value === value);
    if (found) {
      setSelected(found);
    }
  }, [value, values]);

  const onItemClick = item => {
    setSelected(item);
    return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, item.value);
  };

  return (<Menu shadow="md" opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
    <Menu.Target>
      <Button width={300} variant="default" disabled={disabled} leftSection={selected.icon} rightSection={<IconChevronUp style={{
        transform: opened ? "rotate(0)" : "rotate(180deg)",
        transitionDuration: "250ms"
      }} />}>
        {selected.label}
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      {values.map(v => (
        <Menu.Item key={v.value}
          leftSection={v.icon}
          rightSection={v.value === selected.value ? <IconTick /> : null}
          onClick={() => onItemClick(v)}>
          {v.label}
        </Menu.Item>))}
    </Menu.Dropdown>
  </Menu >);
}

AlignFormatDropDown.propTypes = {
  editor: PropTypes.any,
  disabled: PropTypes.bool,
  locale: PropTypes.string,
  value: PropTypes.string
}

export default AlignFormatDropDown;
