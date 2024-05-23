import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// 3rd party libraries
import { App, Dropdown, Button, Space } from 'antd';
import { FaSignOutAlt, FaUser, FaUserCircle } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { ImProfile } from 'react-icons/im';
import { MdPassword } from 'react-icons/md';

// local imports

import { logout, loggedInUser, isLoggedIn } from '/src/store/slices/authSlice'

// --------------------------------------------
const ProfileMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const dispatch = useDispatch();
  const user = useSelector(loggedInUser)
  const isUserLoggedIn = useSelector(isLoggedIn)

  const logoutClicked = () => {
    modal.confirm({
      title: t('logout.title'),
      icon: <FaSignOutAlt />,
      content: t('logout.confirmation'),
      okText: t('actions.yes'),
      cancelText: t('actions.no'),
      onOk: () => {
        dispatch(logout())
        navigate('/')
      }
    });
  }

  const profileItems = (isUserLoggedIn) ?
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
        <Link to='/change-password'>
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
        <Link to='/account/login'>
          {t('login.title')}
        </Link>),
      key: 'login',
      icon: <FiLogIn />
    }, {
      type: 'divider'
    }, {
      label: (
        <Link to='/account/register'>
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
