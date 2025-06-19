import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Ui Library Imports
import cx from 'clsx';
import { Avatar, Button, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { modals } from '@mantine/modals';

// Local Imports
import classes from './profile.module.css';
import { IconLogout, IconSettings, IconChangePassword, IconChevronDown } from "../icons";
import { MAIN_SITE } from '@/config';
//-----------------------------------

const ProfileDropDown = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user)
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const logoutClicked = () => modals.openConfirmModal({
        title: t('logout.title'),
        children: (
            <Text size="sm">
                {t('logout.confirmation')}
            </Text>
        ),
        labels: { confirm: t('actions.yes'), cancel: t('actions.no') },
        onConfirm: () => {
            window.location.href = `${MAIN_SITE}/account/logout?returnUrl=${window.location.href}`
        },
    });

    if (user) {
        return (<Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                    <Group gap={7} wrap="nowrap">
                        <Avatar src={user?.links?.image} alt={user?.name} radius="xl" size={24} />
                        <Text fw={500} size="sm" lh={1} mr={3}>
                            {user?.name}
                        </Text>
                        <IconChevronDown
                            size={16}
                            stroke={1.5}
                            style={{
                                transform: !userMenuOpened ? "rotate(0)" : "rotate(180deg)",
                                transitionDuration: "250ms"
                            }}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    leftSection={
                        <IconSettings size={16} stroke={1.5} />
                    }
                >
                    {t('profile.title')}
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <IconChangePassword size={16} stroke={1.5} />
                    }
                    component={Link}
                    to={`${MAIN_SITE}/account/change-password?returnUrl=${window.location.href}`}
                >
                    {t('changePassword.title')}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={logoutClicked}
                    leftSection={
                        <IconLogout size={16} stroke={1.5} />
                    }
                >
                    {t('logout.title')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>)
    }
    return (<>
        <Button variant="default"
            component={Link}
            to={`${MAIN_SITE}/account/login?returnUrl=${window.location.href}`}>
            {t('login.title')}</Button>
        <Button
            component={Link}
            to={`${MAIN_SITE}/account/register`}>
            {t('register.title')}
        </Button></>)
};

export default ProfileDropDown;
