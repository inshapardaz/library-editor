import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Button, Menu } from '@mantine/core';

// Local imports
import {
    IconUser,
    IconChevronUp,
    IconAssignUnassigned,
    IconAssignAssigned,
    IconAssignMe,
    IconAssignAll,
} from "@/components/icons";
import { AssignmentStatus } from '@/models';
//-----------------------------------------

const AssignmentFilterMenu = ({ value, onChange = () => { } }) => {
    const { t } = useTranslation()
    const [opened, setOpened] = useState(false);

    const options = [{
        label: t(`assignmentStatus.${AssignmentStatus.Unassigned}`),
        value: AssignmentStatus.Unassigned,
        icon: <IconAssignUnassigned />
    }, {
        label: t(`assignmentStatus.${AssignmentStatus.Assigned}`),
        value: AssignmentStatus.Assigned,
        icon: <IconAssignAssigned />
    }, {
        label: t(`assignmentStatus.${AssignmentStatus.AssignedToMe}`),
        value: AssignmentStatus.AssignedToMe,
        icon: <IconAssignMe />
    }, {
        label: t(`assignmentStatus.${AssignmentStatus.All}`),
        value: AssignmentStatus.All,
        icon: <IconAssignAll />
    }]

    const comboOptions = options.map(o => <Menu.Item
        key={o.value}
        disabled={value === o.value}
        leftSection={o.icon}
        onClick={() => onChange(o.value)}>
        {o.label}
    </Menu.Item>);

    const selectedOption = options.find(o => o.value === value) ?? options[0];
    return (<Menu shadow="md" width={200} opened={opened} onChange={setOpened} transitionProps={{ transition: 'scale-y', duration: 150 }}>
        <Menu.Target>
            <Button variant='default' leftSection={<IconUser />}
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

AssignmentFilterMenu.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default AssignmentFilterMenu;