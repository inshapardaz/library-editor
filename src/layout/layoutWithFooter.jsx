// Third party libraries
import { Outlet } from "react-router-dom";

// local imports
import AppFooter from "@/components/layout/appFooter";

// -----------------------------------

const LayoutWithFooter = () => {
    return <>
        <Outlet />
        <AppFooter />
    </>;
}

export default LayoutWithFooter;
