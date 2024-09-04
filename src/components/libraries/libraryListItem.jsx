import React from 'react';

// 3rd Party Libraries
import { Button, List, Tooltip, Typography } from "antd";

// Local Import
import "./styles.scss";
import { FaEdit, ImLibrary } from "/src/icons";
import { setDefaultLibraryImage } from "/src/util";
import LibraryDeleteButton from "./libraryDeleteButton";
import { useNavigate } from 'react-router-dom';
// ------------------------------------------------------

const { Paragraph } = Typography;

// ------------------------------------------------------

const LibraryListItem = ({ library, t }) => {
    const navigate = useNavigate();
    const cover = library?.links?.image ? (<img src={library.links.image}
        onError={setDefaultLibraryImage}
        className="library__image"
        onClick={() => navigate(`/libraries/${library.id}`)}
        alt={library.name} />) :
        <ImLibrary size={64} className='library__icon--small'
            onClick={() => navigate(`/libraries/${library.id}`)} />;

    const title = (<div className='library__link' onClick={() => navigate(`/libraries/${library.id}`)}>{library.name}</div>);

    const description = library.description ? (
        <Paragraph type="secondary" ellipsis>
            {library.description}
        </Paragraph>
    ) : null;

    let actions = [];

    if (library?.links?.update) {
        actions.push(<Tooltip title={t('actions.edit')}>
            <Button icon={<FaEdit />}
                key="library-edit"
                type="ghost"
                size="small"
                onClick={() => navigate(`/libraries/${library.id}/edit`)} />
        </Tooltip>)
    }

    if (library?.links?.delete) {
        actions.push(<LibraryDeleteButton
            key="deleteButton"
            library={library}
            t={t}
            type="ghost"
            size="small"
        />)
    }

    return (
        <List.Item
            key={library.id}
            actions={actions}
            extra={cover}

        >
            <List.Item.Meta
                title={title}
                description={description}
            />
        </List.Item>
    );
};

export default LibraryListItem;
