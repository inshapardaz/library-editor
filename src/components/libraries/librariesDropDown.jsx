import { Link } from "react-router-dom";

// 3rd party imports
import { Dropdown, Button, Typography } from 'antd';
import { ImLibrary } from "react-icons/im";

// Local import
import { useGetLibrariesQuery } from '../../features/api/librariesSlice'


// ---------------------------------------------------
export function LibrariesDropdown() {
    const { data: libraries, isError, isFetching } = useGetLibrariesQuery()
    const items = !isError && !isFetching && libraries && libraries.data ? libraries.data
        .map(l => ({
            label: (<Link to={`libraries/${l.id}`}>
                <Typography>{l.name}</Typography>
            </Link>)
        })): [];

    if (items.length > 0) {
        return (<Dropdown placement='bottomRight' menu={{ items }}>
            <Button>
                <ImLibrary />
            </Button>
        </Dropdown>);
    }

    return null;
}
