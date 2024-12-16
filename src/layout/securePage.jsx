import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

// Local Imports
import { MAIN_SITE } from '@/config';

// -----------------------------------

const SecurePage = () => {
    const navigate = useNavigate();
    const userLoadStatus = useSelector((state) => state?.auth?.loadUserStatus)
    const user = useSelector(state => state.auth.user)

    useEffect(() => {
        if (userLoadStatus === 'succeeded' && !user && !window.location.href.includes(MAIN_SITE)) {
            window.location.href = `${MAIN_SITE}/account/login?returnUrl=${window.location.href}`
        }
    }, [user, navigate, userLoadStatus])

    return <Outlet />;

}

export default SecurePage;
