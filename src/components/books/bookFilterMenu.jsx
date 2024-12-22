import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Button, Menu } from '@mantine/core';

// Local imports
import {
    IconFilter,
    IconChevronUp,
    IconPublished,
    IconAvailableForTyping,
    IconBeingTyped,
    IconReadyForProofRead,
    IconProofRead,
    IconAll,
} from "@/components/icon";
import BookStatus from '@/models/bookStatus';
//-----------------------------------------


const BookFilterMenu = ({ value, onChange = () => { } }) => {
    const { t } = useTranslation()
    const [opened, setOpened] = useState(false);

    const options = [{
        label: t(`book.statuses.${BookStatus.AvailableForTyping}`),
        value: BookStatus.AvailableForTyping,
        icon: <IconAvailableForTyping />
    }, {
        label: t(`book.statuses.${BookStatus.BeingTyped}`),
        value: BookStatus.BeingTyped,
        icon: <IconBeingTyped />
    }, {
        label: t(`book.statuses.${BookStatus.ReadyForProofRead}`),
        value: BookStatus.ReadyForProofRead,
        icon: <IconReadyForProofRead />
    }, {
        label: t(`book.statuses.${BookStatus.ProofRead}`),
        value: BookStatus.ProofRead,
        icon: <IconProofRead />
    }, {
        label: t(`book.statuses.${BookStatus.Published}`),
        value: BookStatus.Published,
        icon: <IconPublished />
    }, {
        label: t(`book.statuses.${BookStatus.All}`),
        value: BookStatus.All,
        icon: <IconAll />
    }]

    const comboOptions = options.map(o => <Menu.Item
        key={o.value}
        selected={value === o.value}
        leftSection={o.icon}
        onClick={() => onChange(o.value)}    >
        {o.label}
    </Menu.Item>);

    const selectedOption = options.find(o => o.value === value) ?? options[0];
    return (<Menu shadow="md" width={200} opened={opened} onChange={setOpened}>
        <Menu.Target>
            <Button variant='default' leftSection={<IconFilter />}
                rightSection={<IconChevronUp style={{
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

BookFilterMenu.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default BookFilterMenu;