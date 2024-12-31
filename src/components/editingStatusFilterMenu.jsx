import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Badge, Button, Menu } from '@mantine/core';

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
} from "@/components/icons";
import { EditingStatus } from '@/models';
//-----------------------------------------

const getStatusCount = (statuses, status) => {
    if (statuses) {
        const item = statuses.find(x => x.status === status);
        if (item) {
            return (<Badge size="xs" color="gray" circle>
                {item.count}
            </Badge>)
        }
    }

    return null;
};

const EditingStatusFilterMenu = ({ statuses = null, value, onChange = () => { } }) => {
    const { t } = useTranslation()
    const [opened, setOpened] = useState(false);

    const options = [{
        label: t(`editingStatus.${EditingStatus.Available}`),
        value: EditingStatus.Available,
        icon: <IconAvailableForTyping />
    }, {
        label: t(`editingStatus.${EditingStatus.Typing}`),
        value: EditingStatus.Typing,
        icon: <IconBeingTyped />
    }, {
        label: t(`editingStatus.${EditingStatus.Typed}`),
        value: EditingStatus.Typed,
        icon: <IconReadyForProofRead />
    }, {
        label: t(`editingStatus.${EditingStatus.InReview}`),
        value: EditingStatus.InReview,
        icon: <IconProofRead />
    }, {
        label: t(`editingStatus.${EditingStatus.Completed}`),
        value: EditingStatus.Completed,
        icon: <IconPublished />
    }, {
        label: t(`editingStatus.${EditingStatus.All}`),
        value: EditingStatus.All,
        icon: <IconAll />
    }]

    const comboOptions = options.map(o => <Menu.Item
        key={o.value}
        selected={value === o.value}
        leftSection={o.icon}
        onClick={() => onChange(o.value)}
        rightSection={getStatusCount(statuses, o.value)}>
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

EditingStatusFilterMenu.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    statuses: PropTypes.arrayOf(PropTypes.shape({
        status: PropTypes.string,
        count: PropTypes.number,
        percentage: PropTypes.number
    }))
};

export default EditingStatusFilterMenu;