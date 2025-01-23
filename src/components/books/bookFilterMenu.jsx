import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Button, Menu } from '@mantine/core';

// Local imports
import {
    IconFilter,
    IconChevronUp,
} from "@/components/icons";
import BookStatus from '@/models/bookStatus';
import { getBookStatusText, BookStatusIcon } from './bookStatusIcon';

//--------------------------
const BookFilterMenu = ({ value, onChange = () => { } }) => {
    const { t } = useTranslation()
    const [opened, setOpened] = useState(false);

    const options = [{
        label: getBookStatusText({ status: BookStatus.AvailableForTyping, t }),
        value: BookStatus.AvailableForTyping,
        icon: <BookStatusIcon status={BookStatus.AvailableForTyping} />
    }, {
        label: getBookStatusText({ status: BookStatus.BeingTyped, t }),
        value: BookStatus.BeingTyped,
        icon: <BookStatusIcon status={BookStatus.BeingTyped} />
    }, {
        label: getBookStatusText({ status: BookStatus.ReadyForProofRead, t }),
        value: BookStatus.ReadyForProofRead,
        icon: <BookStatusIcon status={BookStatus.ReadyForProofRead} />
    }, {
        label: getBookStatusText({ status: BookStatus.ProofRead, t }),
        value: BookStatus.ProofRead,
        icon: <BookStatusIcon status={BookStatus.ProofRead} />
    }, {
        label: getBookStatusText({ status: BookStatus.Published, t }),
        value: BookStatus.Published,
        icon: <BookStatusIcon status={BookStatus.Published} />
    }, {
        label: getBookStatusText({ status: BookStatus.All, t }),
        value: BookStatus.All,
        icon: <BookStatusIcon status={BookStatus.All} />
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