import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { App, Dropdown, Button, Space } from 'antd';

// local imports
import { FaSignOutAlt, FaUser, FaUserCircle, FiLogIn, FiLogOut, ImProfile, MdPassword } from '/src/icons';
import { MAIN_SITE } from '/src/config';

// --------------------------------------------
const ProfileMenu = () => {
    const { t } = useTranslation();
    const { modal } = App.useApp();
    const user = useSelector(state => state.auth.user)

    const logoutClicked = () => {
        modal.confirm({
            title: t('logout.title'),
            icon: <FaSignOutAlt />,
            content: t('logout.confirmation'),
            okText: t('actions.yes'),
            cancelText: t('actions.no'),
            onOk: () => {
                window.location.href = `${MAIN_SITE}/account/logout?returnUrl=${window.location.href}`
            }
        });
    }

    const profileItems = (user) ?
        [{
            label: user ? user.name : '',
            key: 'username',
            icon: <FaUserCircle />
        }, {
            type: 'divider'
        }, {
            label: t('profile.title'),
            key: 'profile',
            icon: <ImProfile />
        }, {
            label: (
                <Link to={`${MAIN_SITE}/account/change-password?returnUrl=${window.location.href}`}>
                    {t('changePassword.title')}
                </Link>),
            key: 'change-password',
            icon: <MdPassword />
        }, {
            type: 'divider'
        }, {
            label: t('logout.title'),
            key: 'sign-out',
            icon: <FiLogOut />,
            onClick: logoutClicked
        }]
        : [{
            label: (
                <Link to={`${MAIN_SITE}/account/login?returnUrl=${window.location.href}`}>
                    {t('login.title')}
                </Link>),
            key: 'login',
            icon: <FiLogIn />
        }, {
            type: 'divider'
        }, {
            label: (
                <Link to={`${MAIN_SITE}/account/register`}>
                    {t('register.title')}
                </Link>),
            key: 'register',
            icon: <FaUserCircle />
        }];

    return (<Dropdown arrow
        placement='bottomRight'
        menu={{
            items: profileItems,
            selectable: false
        }}
    >
        <Button shape="circle">
            <Space>
                <FaUser />
            </Space>
        </Button>
    </Dropdown>);
}

export default ProfileMenu
