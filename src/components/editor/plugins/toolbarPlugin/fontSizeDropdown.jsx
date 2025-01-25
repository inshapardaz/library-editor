import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

// Lexical imports
import { $getSelection, $isRangeSelection } from 'lexical';

import { $patchStyleText } from "@lexical/selection";
// Ui Library Imports

// Local imprts
import { Button, Menu, Text } from '@mantine/core';
import { IconFontSize, IconTick, IconChevronUp } from '@/components/icons';
import { updateFontSizeInSelection } from './utils';
// --------------------------------------------------
const configuredSizes = [
  { value: '10px', label: '10' },
  { value: '11px', label: '11' },
  { value: '12px', label: '12' },
  { value: '13px', label: '13' },
  { value: '14px', label: '14' },
  { value: '15px', label: '15' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '22px', label: '22' },
  { value: '24px', label: '24' },
  { value: '26px', label: '26' },
  { value: '28px', label: '28' },
  { value: '30px', label: '30' },
  { value: '34px', label: '34' },
  { value: '38px', label: '38' },
  { value: '46px', label: '46' },
  { value: '56px', label: '56' },
  { value: '60px', label: '60' },
  { value: '78px', label: '78' },
  { value: '96px', label: '96' },
];

const FontSizeDropDown = ({ editor, value }) => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(configuredSizes[0]);
  const onChange = useCallback(
    (_value) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            "font-size": _value,
          });
        }
      });
      updateFontSizeInSelection(editor, _value, null);
    },
    [editor],
  );


  useEffect(() => {
    const found = configuredSizes.find(b => b.value === value);
    if (found) {
      setSelected(found);
    }
  }, [value]);

  const onItemClick = item => {
    setSelected(item);
    return onChange(item.value);
  };

  return (<Menu shadow="md" opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
    <Menu.Target>
      <Button width={300} variant="default" leftSection={<IconFontSize />} rightSection={<IconChevronUp style={{
        transform: opened ? "rotate(0)" : "rotate(180deg)",
        transitionDuration: "250ms"
      }} />}>
        <Text>{selected.label}</Text>
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      {configuredSizes.map(f => (
        <Menu.Item key={f.value}
          leftSection={<IconFontSize />}
          rightSection={f.value === selected.value ? <IconTick /> : null}
          onClick={() => onItemClick(f)}>
          {f.label}
        </Menu.Item>))}
    </Menu.Dropdown>
  </Menu >);
};

FontSizeDropDown.propTypes = {
  editor: PropTypes.any,
  t: PropTypes.any,
  disabled: PropTypes.bool,
  value: PropTypes.string,
}

export default FontSizeDropDown;
