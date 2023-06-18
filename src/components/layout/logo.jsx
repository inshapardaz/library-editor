import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// 3rd party imports
import { Dropdown, Space } from 'antd';
import { ImLibrary } from "react-icons/im";

// Local import
import styles from '../../styles/common.module.scss';
import { useGetLibrariesQuery } from '../../features/api/librariesSlice'

// ---------------------------------------------------
export function Logo({ t, library, showLibrarySwitcher = true }) {
  const navigate = useNavigate();
  const { data: libraries, isError, isFetching } = useGetLibrariesQuery()
  const items = !isError && !isFetching && libraries && libraries.data ? libraries.data.map(l => ({
    key: l.id,
    label : (
      <Link to={`/libraries/${l.id}`}>
        {l.name}
      </Link>
    ),
    icon: <ImLibrary />,
  })) : [];


  if (showLibrarySwitcher && items.length > 0) {
    const selectedKeys = library ? [library.id] : null
    return (<Space size={8} className={styles['header__logo']}>
          <Dropdown.Button menu={{ items }}
            trigger='click'
            type="text"
            size="large"
            selectable={true}
            icon={<ImLibrary />}
            selectedKeys= {selectedKeys}
            onClick={() =>  navigate('/') }>
              <img src="/images/logo.png" alt="logo" height={24} width={24} />
          </Dropdown.Button>
        </Space>)
  }

  return (<Space size={8} className={styles['header__logo']}>
      <Link to="/" className={styles["header__logo-text"]}>
        <img src="/images/logo.png" alt="logo" height={24} width={24} />
      </Link>
    </Space>)
}
