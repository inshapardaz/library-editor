import React from 'react';
import { Link } from "react-router-dom";

// Local import
import './styles.scss';
// ---------------------------------------------------
const logo = '/images/logo.png';
// ---------------------------------------------------

const Logo = ({ height = 24, width = 24 }) => {
    return (
        <Link to="/" className="header__logo-text">
            <img src={logo} alt="logo" height={height} width={width} />
        </Link>);
};
export default Logo
