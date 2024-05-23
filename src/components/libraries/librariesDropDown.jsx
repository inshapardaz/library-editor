import React from 'react';
import { Link } from "react-router-dom";

// 3rd party imports
import { Dropdown, Button, Typography } from 'antd';

// Local import
import { ImLibrary } from "/src/icons";
import { useGetLibrariesQuery } from '/src/store/slices/librariesSlice'


// ---------------------------------------------------
const LibrariesDropdown = () => {
    const { data: libraries, isError, isFetching } = useGetLibrariesQuery({})
    const items = !isError && !isFetching && libraries && libraries.data ? libraries.data
        .map(l => ({
            label: (<Link to={`libraries/${l.id}`}>
                <Typography>{l.name}</Typography>
            </Link>)
        })) : [];

    if (items.length > 0) {
        return (<Dropdown placement='bottomRight' menu={{ items }}>
            <Button>
                <ImLibrary />
            </Button>
        </Dropdown>);
    }

    return null;
};

export default LibrariesDropdown;
