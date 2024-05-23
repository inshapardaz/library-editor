import React from 'react';
import { useDispatch, useSelector } from "react-redux";

// 3rd party imports
import { Switch } from "antd";

// Local imports
import { MdOutlineDarkMode, MdOutlineWbSunny } from '/src/icons'
import { toggleUiMode } from '/src/store/slices/uiSlice';
// -------------------------------------------------

const DarkModeToggle = () => {
    const dispatch = useDispatch();
    const mode = useSelector(state => state.ui.uiMode);
    const toggleDarkMode = () => dispatch(toggleUiMode())

    return (<Switch
        checkedChildren={<MdOutlineDarkMode />}
        unCheckedChildren={<MdOutlineWbSunny />}
        checked={mode === 'dark'}
        onChange={toggleDarkMode}
    />);
};

export default DarkModeToggle;
