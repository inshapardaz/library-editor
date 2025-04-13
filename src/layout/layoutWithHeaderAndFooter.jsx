import { Outlet, useParams } from "react-router-dom";

// 3rd party libraries
import { AppShell, rem } from '@mantine/core';

// Local imports
import AppFooter from "@/components/layout/appFooter";
import AppHeader from "@/components/layout/appHeader";
import LibraryHeader from "@/components/layout/libraryHeader";
import { useGetLibraryQuery } from '@/store/slices/libraries.api';
import { LibraryContext } from '@/contexts'
// -----------------------------------------

const LayoutWithHeaderAndFooter = () => {
    const { libraryId } = useParams();
    const { data: library } = useGetLibraryQuery({ libraryId }, { skip: !libraryId });

    return (
        <LibraryContext.Provider value={{ libraryId, library }}>
            <AppShell>
                <AppShell.Header>
                    {libraryId && library ?
                        <LibraryHeader library={library} /> :
                        <AppHeader />
                    }
                </AppShell.Header>
                <AppShell.Main pt={rem(60)} pb='var(--mantine-spacing-md)' className="pageBackgound">
                    <Outlet />
                </AppShell.Main>
                <AppFooter />
            </AppShell>
        </LibraryContext.Provider>)
}

export default LayoutWithHeaderAndFooter;
