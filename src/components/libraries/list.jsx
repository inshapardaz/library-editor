import { useTranslation } from "react-i18next";

// 3rd party libraries
import { Button, List } from 'antd';
import { useNavigate } from "react-router-dom";

// Internal Imports
import { useGetLibrariesQuery } from '../../features/api/librariesSlice'
import DataContainer from "../layout/dataContainer";
import LibraryCard from "./libraryCard";
// ------------------------------------------------------

const grid = {
    gutter: 8,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 6,
};

function ShowMoreButton ({ t }) {
    const navigate = useNavigate();
    return(<div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button size="small" onClick={() => navigate(`/libraries`)}>
            {t('actions.seeMore')}
        </Button>
    </div>);
}

const LibrariesList = () => {
    const { t } = useTranslation()
    const { data: libraries, isError, isFetching } = useGetLibrariesQuery()

    return (<DataContainer  busy={isFetching}
        error={isError}
        empty={libraries && libraries.data && libraries.data.length < 1}>
            <List
                loading={isFetching}
                size="large"
                grid={ grid }
                itemLayout="vertical"
                dataSource={libraries ? libraries.data : []}
                loadMore={<ShowMoreButton t={t} />}
                renderItem={(l) => (<List.Item><LibraryCard key={l.id} library={l} /></List.Item>)}
            />
        </DataContainer>);
}

export default LibrariesList;
