import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

// Lexical imports
import { $getSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';

// Ui Library Imports
import { Button, Menu } from '@mantine/core';

// Local imprts
import { getFonts } from '@/i18n';
import { IconFont, IconTick, IconChevronUp } from '@/components/icons';
// --------------------------------------------------

const FONT_FAMILY_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Verdana", label: "Verdana" },
];

// eslint-disable-next-line react-refresh/only-export-components
export const defaultFont = (configuration) => {
  var fonts = configuration?.toolbar?.fonts ?? fonts;
  var retVal = configuration?.toolbar?.defaultFont
    ? fonts.find((x) => x.value === configuration?.toolbar?.defaultFont) ||
    fonts[0]
    : fonts[0];
  return retVal;
};

// --------------------------------------------------
const FontDropDown = ({ t, editor, value, locale }) => {
  const [opened, setOpened] = useState(false);

  const configuredFonts = getFonts(t, locale) ?? FONT_FAMILY_OPTIONS;
  const [selected, setSelected] = useState(configuredFonts[0]);

  const onChange = useCallback(
    (_value) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            ['font-family']: _value,
          });
        }
      });
    },
    [editor],
  );

  useEffect(() => {
    const found = configuredFonts.find(b => b.value === value);
    if (found) {
      setSelected(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onItemClick = item => {
    setSelected(item);
    return onChange(item.value);
  };

  return (<Menu shadow="md" opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
    <Menu.Target>
      <Button width={300} variant="default" leftSection={<IconFont />} rightSection={<IconChevronUp style={{
        transform: opened ? "rotate(0)" : "rotate(180deg)",
        transitionDuration: "250ms"
      }} />}>
        {selected.label}
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      {configuredFonts.map(f => (
        <Menu.Item key={f.value}
          leftSection={<IconFont />}
          rightSection={f.value === selected.value ? <IconTick /> : null}
          onClick={() => onItemClick(f)}>
          {f.label}
        </Menu.Item>))}
    </Menu.Dropdown>
  </Menu >);
};

FontDropDown.propTypes = {
  editor: PropTypes.any,
  t: PropTypes.any,
  disabled: PropTypes.bool,
  locale: PropTypes.string,
  value: PropTypes.string,
}

export default FontDropDown;
