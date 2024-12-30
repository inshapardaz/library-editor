import { useDispatch, useSelector } from "react-redux";

// Ui Library Imports
import { Center, SegmentedControl } from "@mantine/core";

// Local imports
import { IconReaderViewScroll, IconReaderViewSinglePage, IconReaderViewDoublePage } from '@/components/icons'
import { setReaderView } from "@/store/slices/uiSlice";
//-----------------------------------
const ReadViewToggle = () => {
    const dispatch = useDispatch();
    const readerView = useSelector(state => state.ui.readerView);

    const onReaderViewChanged = (value) => {
        dispatch(setReaderView(value));
    }

    const layouts = [{
        value: 'scroll',
        label: (
            <Center style={{ gap: 10 }}>
                <IconReaderViewScroll />
            </Center>
        ),
    },
    {
        value: 'singlePage',
        label: (
            <Center style={{ gap: 10 }}>
                <IconReaderViewSinglePage />
            </Center>
        ),
    },
    {
        value: 'doublePage',
        label: (
            <Center style={{ gap: 10 }}>
                <IconReaderViewDoublePage />
            </Center>
        ),
    }]

    return <SegmentedControl size="lg" onChange={onReaderViewChanged} value={readerView} data={layouts} />
}

export default ReadViewToggle;