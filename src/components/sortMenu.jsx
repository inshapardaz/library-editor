import PropTypes from 'prop-types';
import { useState } from 'react';

// Ui Library Imports
import { Button, Menu } from '@mantine/core';

// Local imports
import { IconSort, IconChevronUp } from "@/components/icons";
//-----------------------------------------

const SortMenu = ({ options = [], value = "name", onChange = () => { } }) => {
    const [opened, setOpened] = useState(false);

    const comboOptions = options.map(o => <Menu.Item
        key={o.value}
        selected={value === o.value}
        leftSection={o.icon}
        onClick={() => onChange(o.value)}    >
        {o.label}
    </Menu.Item>);

    const selectedOption = options.find(o => o.value === value) ?? options[0];
    return (<Menu shadow="md" width={200} opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
        <Menu.Target>
            <Button variant='default' leftSection={<IconSort />} rightSection={<IconChevronUp style={{
                transform: opened ? "rotate(0)" : "rotate(180deg)",
                transitionDuration: "250ms"
            }}
            />}>
                {selectedOption?.label}
            </Button>
        </Menu.Target>
        <Menu.Dropdown>
            {comboOptions}
        </Menu.Dropdown>
    </Menu>);
}

SortMenu.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
        icon: PropTypes.node
    })),
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default SortMenu;