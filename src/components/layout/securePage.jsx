import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

// Local Imports
import { isLoggedIn } from "/src/store/slices/authSlice";

// -----------------------------------

const SecurePage = () => {
    const navigate = useNavigate();
    const isUserLoggedIn = useSelector(isLoggedIn)

    useEffect(() => {
        if (!isUserLoggedIn) {
            navigate('/account/login')
        }
    }, [isUserLoggedIn, navigate])

    return <Outlet />;

}

export default SecurePage;
